import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import type {
   EmailPreferences, User, SnsEvent, SesMessage,
   Recipient, AppSyncEvent, HandlerEvent
} from './types';
import { OptOutReason } from './types';
import { logger } from '../../shared/logger';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddb = DynamoDBDocumentClient.from(client);

const SOFT_BOUNCE_THRESHOLD = 5;

/**
 * Email Preference Manager Lambda
 * 
 * Processes SES bounce and complaint events and manages user email preferences.
 * 
 * **Triggers:**
 * - SNS events from SES (bounces, complaints)
 * - GraphQL query/mutation invocation via AppSync (getPublicUserEmailPreferences, updateUserEmailPreferences)
 * 
 * **Responsibilities:**
 * - Process SES bounce notifications (hard and soft bounces)
 * - Process SES complaint notifications
 * - Update user email preferences in DynamoDB
 * - Track soft bounce counts with threshold-based opt-out
 * - Handle user-initiated preference updates via JWT-authenticated requests
 * - Provide public email preference retrieval
 * 
 * **Integration Points:**
 * - SNS (SES event notifications)
 * - SES (bounce/complaint events)
 * - AppSync (GraphQL resolver for preference management)
 * - DynamoDB (user preferences storage)
 * 
 * **Business Logic:**
 * - Hard bounces → immediate permanent opt-out (BOUNCE_HARD)
 * - Soft bounces → increment counter, permanent opt-out after 5 soft bounces (BOUNCE_SOFT)
 * - Complaints → immediate permanent opt-out (COMPLAINT)
 * - User choice → respect opt-out preferences (USER_CHOICE)
 * - JWT token validation for preference updates (90-day expiry)
 * - Email validation against user records
 * 
 * @param event - SNS event or AppSync event containing bounce/complaint data or preference update request
 * @returns Status response or email preferences
 */
export const handler = async (event: HandlerEvent): Promise<any> =>
{
   logger.log('Event:', event);

   if ((event as SnsEvent).Records) { return handleSnsEvent(event as SnsEvent); }
   if ((event as AppSyncEvent).info?.fieldName === 'getPublicUserEmailPreferences')
   { return handleGetPreferences((event as AppSyncEvent).arguments!.email!); }
   if ((event as AppSyncEvent).info?.fieldName === 'updateUserEmailPreferences')
   {
      const args = (event as AppSyncEvent).arguments!;
      return handleUpdatePreferences(args.email!, args.token!, args.preferences!);
   }

   throw new Error('Unknown event type');
};

async function handleSnsEvent(event: SnsEvent): Promise<{ statusCode: number }>
{
   try
   {
      const message: SesMessage = JSON.parse(event.Records[0].Sns.Message);
      const notificationType = message.eventType;

      logger.log('Notification type:', notificationType);

      if (notificationType === 'Bounce') { await handleBounce(message); }
      else if (notificationType === 'Complaint') { await handleComplaint(message); }

      return { statusCode: 200 };
   }
   catch (error)
   {
      logger.error('Error processing notification:', error);
      throw error;
   }
}

async function handleBounce(message: SesMessage): Promise<void>
{
   if (!message.bounce)
   {
      logger.error('Bounce notification missing bounce data');
      return;
   }

   const bounceType = message.bounce.bounceType;
   const recipients = message.bounce.bouncedRecipients;

   logger.log(`Bounce type: ${bounceType}, Recipients:`, recipients);

   if (bounceType === 'Permanent')
   { await optOutUsers(recipients, OptOutReason.BOUNCE_HARD); }
   else if (bounceType === 'Transient') { await handleSoftBounces(recipients); }
}

async function handleComplaint(message: SesMessage): Promise<void>
{
   const recipients = message.complaint!.complainedRecipients;
   logger.log('Complaint recipients:', recipients);
   await optOutUsers(recipients, OptOutReason.COMPLAINT);
}

async function handleSoftBounces(recipients: Recipient[]): Promise<void>
{
   for (const recipient of recipients)
   {
      const email = recipient.emailAddress;
      const user = await getUserByEmail(email);

      if (!user)
      {
         logger.log(`User not found for email: ${email}`);
         continue;
      }

      const softBounceCount = (user.emailPreferences?.softBounceCount || 0) + 1;

      if (softBounceCount >= SOFT_BOUNCE_THRESHOLD)
      {
         await optOutUsers([recipient], OptOutReason.BOUNCE_SOFT);
         logger.log(`Opted out ${email} after ${softBounceCount} soft bounces`);
      }
      else
      {
         await updateUserPreferences(user.id, { softBounceCount: softBounceCount });
         logger.log(`Soft bounce ${softBounceCount}/${SOFT_BOUNCE_THRESHOLD} for ${email}`);
      }
   }
}

async function optOutUsers(recipients: Recipient[], reason: OptOutReason): Promise<void>
{
   for (const recipient of recipients)
   {
      const email = recipient.emailAddress;
      const user = await getUserByEmail(email);

      if (!user)
      {
         logger.log(`User not found for email: ${email}`);
         continue;
      }

      await updateUserPreferences(user.id,
      {
         allOptOut: true,
         optOutReason: reason,
         optOutAt: new Date().toISOString(),
         softBounceCount: 0
      });

      logger.log(`Opted out ${email}: ${reason}`);
   }
}

async function getUserByEmail(email: string): Promise<User | null>
{
   const params = {
      TableName: process.env.USER_TABLE_NAME,
      IndexName: 'byEmail',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
   };

   try
   {
      const result = await ddb.send(new QueryCommand(params));
      return (result.Items?.[0] as User) || null;
   }
   catch (error)
   {
      logger.error(`Error querying user by email ${email}:`, error);
      return null;
   }
}

async function getUserById(userId: string): Promise<User | null>
{
   const params = {
      TableName: process.env.USER_TABLE_NAME,
      Key: { id: userId }
   };

   try
   {
      const result = await ddb.send(new GetCommand(params));
      return (result.Item as User) || null;
   }
   catch (error)
   {
      logger.error(`Error getting user by ID ${userId}:`, error);
      return null;
   }
}

async function updateUserPreferences(userId: string, preferences: Partial<EmailPreferences>): Promise<void>
{
   const params = {
      TableName: process.env.USER_TABLE_NAME,
      Key: { id: userId },
      UpdateExpression: 'SET emailPreferences = :prefs',
      ExpressionAttributeValues: { ':prefs': preferences }
   };

   try { await ddb.send(new UpdateCommand(params)); }
   catch (error)
   {
      logger.error(`Error updating user ${userId}:`, error);
      throw error;
   }
}

async function handleGetPreferences(email: string): Promise<EmailPreferences | null>
{
   try
   {
      const user = await getUserByEmail(email);
      if (!user)
      {
         logger.log(`User not found for email: ${email}`);
         return null;
      }

      return user.emailPreferences || {
         __typename:         'EmailPreferences' as const,
         allOptOut:          false,
         boxRequestOptOut:   false,
         collaboratorOptOut: false,
         systemOptOut:       false
      };
   }
   catch (error)
   {
      logger.error('Error getting preferences:', error);
      throw error;
   }
}

async function handleUpdatePreferences(email: string, token: string,
                                       preferences: EmailPreferences): Promise<EmailPreferences>
{
   let duck = false;
   try
   {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) { throw new Error('JWT_SECRET not configured'); }

      let decoded;
      try { decoded = jwt.verify(token, jwtSecret); }
      catch (error)
      {
         logger.error('JWT verification failed:', error);
         throw new Error('Invalid or expired token', { cause: error});
      }

      if ('string' === typeof decoded || !decoded.email || !decoded.userId)
      {
         duck = true;
         logger.error('JWT payload missing required fields');
         throw new Error('Invalid token');
      }

      if (decoded.email !== email)
      {
         duck = true;
         logger.error('Email mismatch:', { decoded: decoded.email, provided: email });
         throw new Error('Email does not match token');
      }

      const user = await getUserById(decoded.userId);
      if (!user)
      {
         duck = true;
         logger.error('User not found:', decoded.userId);
         throw new Error('User not found');
      }

      if (user.email !== email)
      {
         duck = true;
         logger.error('Email mismatch:', { token: email, database: user.email });
         throw new Error('Email does not match user record');
      }

      await updateUserPreferences(user.id, preferences);

      logger.log(`Updated email preferences for ${email}`);
      return preferences;
   }
   catch (error)
   {
      if (duck) { throw error; }
      logger.error('Error updating preferences:', error);
      throw error;
   }
}
