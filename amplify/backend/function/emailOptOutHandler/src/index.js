/* Amplify Params - DO NOT EDIT
 API_HUKDZEN_GRAPHQLAPIENDPOINTOUTPUT
 API_HUKDZEN_GRAPHQLAPIIDOUTPUT
 API_HUKDZEN_USERTABLE_ARN
 API_HUKDZEN_USERTABLE_NAME
 ENV
 REGION
 Amplify Params - DO NOT EDIT */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
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

   try
   {
      const message = JSON.parse(event.Records[0].Sns.Message);
      const notificationType = message.notificationType;

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
};

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
   const updateExpression = [];
   const expressionAttributeNames = {};
   const expressionAttributeValues = {};

   Object.keys(preferences).forEach((key, index) =>
   {
      const attrName = `#attr${index}`;
      const attrValue = `:val${index}`;
      updateExpression.push(`emailPreferences.${attrName} = ${attrValue}`);
      expressionAttributeNames[attrName] = key;
      expressionAttributeValues[attrValue] = preferences[key];
   });

   const params = {
      TableName: process.env.API_HUKDZEN_USERTABLE_NAME,
      Key: { id: userId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
   };

   try { await ddb.send(new UpdateCommand(params)); }
   catch (error)
   {
      logger.error(`Error updating user ${userId}:`, error);
      throw error;
   }
}
