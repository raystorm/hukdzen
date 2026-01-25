/* Amplify Params - DO NOT EDIT
 API_HUKDZEN_GRAPHQLAPIENDPOINTOUTPUT
 API_HUKDZEN_GRAPHQLAPIIDOUTPUT
 API_HUKDZEN_USERTABLE_ARN
 API_HUKDZEN_USERTABLE_NAME
 ENV
 REGION
 JWT_SECRET
 Amplify Params - DO NOT EDIT */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const jwt = require('jsonwebtoken');
const { logger } = require('./logger.js');

const client = new DynamoDBClient({ region: process.env.REGION });
const ddb = DynamoDBDocumentClient.from(client);

const SOFT_BOUNCE_THRESHOLD = 5;

// OptOutReason values (matches GraphQL enum)
const OptOutReason = {
   BOUNCE_HARD: 'BOUNCE_HARD',
   BOUNCE_SOFT: 'BOUNCE_SOFT',
   COMPLAINT:   'COMPLAINT',
   USER_CHOICE: 'USER_CHOICE'
};

exports.handler = async (event) =>
{
   logger.log('Event:', event);

   // 1. SNS Event (bounce/complaint from SES)
   if (event.Records)
   {
      return handleSnsEvent(event);
   }

   // 2. AppSync Query (getPublicUserEmailPreferences)
   if (event.info?.fieldName === 'getPublicUserEmailPreferences')
   {
      return handleGetPreferences(event.arguments.email);
   }

   // 3. AppSync Mutation (updateUserEmailPreferences)
   if (event.info?.fieldName === 'updateUserEmailPreferences')
   {
      return handleUpdatePreferences(
         event.arguments.email,
         event.arguments.token,
         event.arguments.preferences
      );
   }

   throw new Error('Unknown event type');
};

async function handleSnsEvent(event)
{
   try
   {
      const message = JSON.parse(event.Records[0].Sns.Message);
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

async function handleBounce(message)
{
   const bounceType = message.bounce.bounceType;
   const recipients = message.bounce.bouncedRecipients;

   logger.log(`Bounce type: ${bounceType}, Recipients:`, recipients);

   if (bounceType === 'Permanent')
   { await optOutUsers(recipients, OptOutReason.BOUNCE_HARD); }
   else if (bounceType === 'Transient')
   { await handleSoftBounces(recipients); }
}

async function handleComplaint(message)
{
   const recipients = message.complaint.complainedRecipients;
   logger.log('Complaint recipients:', recipients);
   await optOutUsers(recipients, OptOutReason.COMPLAINT);
}

async function handleSoftBounces(recipients)
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

async function optOutUsers(recipients, reason)
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

async function getUserByEmail(email)
{
   const params = {
      TableName: process.env.API_HUKDZEN_USERTABLE_NAME,
      IndexName: 'byEmail',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email }
   };

   try
   {
      const result = await ddb.send(new QueryCommand(params));
      return result.Items?.[0];
   }
   catch (error)
   {
      logger.error(`Error querying user by email ${email}:`, error);
      return null;
   }
}

async function updateUserPreferences(userId, preferences)
{
   const emailPreferences = {};
   Object.keys(preferences).forEach(key => {
      emailPreferences[key] = preferences[key];
   });

   const params = {
      TableName: process.env.API_HUKDZEN_USERTABLE_NAME,
      Key: { id: userId },
      UpdateExpression: 'SET emailPreferences = :prefs',
      ExpressionAttributeValues: { ':prefs': emailPreferences }
   };

   try { await ddb.send(new UpdateCommand(params)); }
   catch (error)
   {
      logger.error(`Error updating user ${userId}:`, error);
      throw error;
   }
}

async function handleGetPreferences(email)
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
         allOptOut: false,
         boxRequestOptOut: false,
         collaboratorOptOut: false,
         systemOptOut: false
      };
   }
   catch (error)
   {
      logger.error('Error getting preferences:', error);
      throw error;
   }
}

async function handleUpdatePreferences(email, token, preferences)
{
   try
   {
      // Verify JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) { throw new Error('JWT_SECRET not configured'); }

      let decoded;
      try { decoded = jwt.verify(token, jwtSecret); }
      catch (error)
      {
         logger.error('JWT verification failed:', error);
         throw new Error('Invalid or expired token');
      }

      // Verify email matches
      if (decoded.email !== email)
      {
         logger.error('Email mismatch:', { decoded: decoded.email, provided: email });
         throw new Error('Email does not match token');
      }

      // Get user from database
      const user = await getUserByEmail(email);
      if (!user)
      {
         logger.error('User not found:', email);
         throw new Error('User not found');
      }

      // Verify userId matches
      if (user.id !== decoded.userId)
      {
         logger.error('User ID mismatch:', { decoded: decoded.userId, database: user.id });
         throw new Error('User ID does not match token');
      }

      // Update preferences
      await updateUserPreferences(user.id, preferences);

      logger.log(`Updated email preferences for ${email}`);
      return preferences;
   }
   catch (error)
   {
      logger.error('Error updating preferences:', error);
      throw error;
   }
}
