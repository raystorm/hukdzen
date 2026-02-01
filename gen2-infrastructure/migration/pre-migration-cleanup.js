#!/usr/bin/env node

/**
 * Pre-Migration Cleanup Script
 * 
 * Reassigns ownership to SYSTEM for:
 * 1. Duplicate email accounts (Tom's accounts)
 * 
 * Note: FORCE_CHANGE_PASSWORD users own no content (verified via query)
 * 
 * Run this BEFORE exporting DynamoDB data for Gen2 migration
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

// Get environment from command line argument
const ENV = process.argv[2] || 'dev';

if (!['dev', 'prod'].includes(ENV))
{
   console.error('Usage: node pre-migration-cleanup.js [dev|prod]');
   process.exit(1);
}

const SYSTEM_ID = '00000000-0000-0000-0000-000000000001';

// Environment-specific configuration
const CONFIG = {
   dev: {
      region: 'us-west-2',
      tablePrefix: 'vziz2d2xgbbx7ec2s44ncx73p4',
      duplicateAccountIds: [
         'facebook_10231024664460561',
         '6703dc53-6a3f-4631-9775-30b8d2c01289',
         '36e29345-a1df-4cb4-a83e-96ad3d8ace10',
         'b2faec0e-1068-4c0e-9871-07e977d484a1'
      ]
   },
   prod: {
      region: 'us-west-2',
      tablePrefix: 'p56j3ha5kjhmjn66c4m4eevl4a',
      duplicateAccountIds: [
         'facebook_10231024664460561',
         'loginwithamazon_amzn1.account.aein3tipmmexfwuzptp4gfbwf5oa',
         '4756fb61-ce77-40cb-8076-226c438d0dc6'
      ]
   }
};

const REGION = CONFIG[ENV].region;
const TABLE_PREFIX = CONFIG[ENV].tablePrefix;

const USER_TABLE = `User-${TABLE_PREFIX}-${ENV}`;
const DOCUMENT_TABLE = `DocumentDetails-${TABLE_PREFIX}-${ENV}`;
const BOX_TABLE = `Xbiis-${TABLE_PREFIX}-${ENV}`;
const BOXUSER_TABLE = `BoxUser-${TABLE_PREFIX}-${ENV}`;

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function ensureSystemUser()
{
   console.log('Checking for SYSTEM user...');
   
   const params = {
      TableName: USER_TABLE,
      Key: { id: SYSTEM_ID }
   };
   
   const result = await docClient.send(new ScanCommand({
      TableName: USER_TABLE,
      FilterExpression: 'id = :systemId',
      ExpressionAttributeValues: { ':systemId': SYSTEM_ID }
   }));
   
   if (result.Items && result.Items.length > 0) {
      console.log('SYSTEM user already exists');
      return;
   }
   
   console.log('Creating SYSTEM user...');
   const systemUser = {
      __typename: 'User',
      id: SYSTEM_ID,
      name: 'System',
      email: 'noreply@smalgyax-files.org',
      isAdmin: false,
      createdAt: '2023-06-23T01:13:51.459Z',
      updatedAt: new Date().toISOString()
   };
   
   await docClient.send(new PutCommand({
      TableName: USER_TABLE,
      Item: systemUser
   }));
   
   console.log('SYSTEM user created\n');
}

async function getUserIdsToReassign()
{
   const ids = CONFIG[ENV].duplicateAccountIds;
   console.log(`Reassigning ${ids.length} duplicate accounts to SYSTEM`);
   return ids;
}

async function reassignDocuments(userIds)
{
   console.log(`Reassigning documents for ${userIds.length} users...`);
   let count = 0;
   
   for (const userId of userIds) {
      const params = {
         TableName: DOCUMENT_TABLE,
         FilterExpression: 'documentDetailsOwnerId = :userId',
         ExpressionAttributeValues: { ':userId': userId }
      };
      
      const result = await docClient.send(new ScanCommand(params));
      
      if (result.Items)
      {
         for (const doc of result.Items)
         {
            await docClient.send(new UpdateCommand({
               TableName: DOCUMENT_TABLE,
               Key: { id: doc.id },
               UpdateExpression: 'SET documentDetailsOwnerId = :systemId',
               ExpressionAttributeValues: { ':systemId': SYSTEM_ID }
            }));
            count++;
         }
      }
   }
   
   console.log(`Reassigned ${count} documents to SYSTEM`);
}

async function reassignBoxes(userIds)
{
   console.log(`Reassigning boxes for ${userIds.length} users...`);
   let count = 0;
   
   for (const userId of userIds)
   {
      const params = {
         TableName: BOX_TABLE,
         FilterExpression: 'xbiisOwnerId = :userId',
         ExpressionAttributeValues: { ':userId': userId }
      };
      
      const result = await docClient.send(new ScanCommand(params));
      
      if (result.Items)
      {
         for (const box of result.Items)
         {
            await docClient.send(new UpdateCommand({
               TableName: BOX_TABLE,
               Key: { id: box.id },
               UpdateExpression: 'SET xbiisOwnerId = :systemId',
               ExpressionAttributeValues: { ':systemId': SYSTEM_ID }
            }));
            count++;
         }
      }
   }
   
   console.log(`Reassigned ${count} boxes to SYSTEM`);
}

async function reassignBoxUsers(userIds)
{
   console.log(`Reassigning box users for ${userIds.length} users...`);
   let count = 0;
   
   for (const userId of userIds)
   {
      const params = {
         TableName: BOXUSER_TABLE,
         FilterExpression: 'boxUserUserId = :userId',
         ExpressionAttributeValues: { ':userId': userId }
      };
      
      const result = await docClient.send(new ScanCommand(params));
      
      if (result.Items)
      {
         for (const bu of result.Items)
         {
            await docClient.send(new UpdateCommand({
               TableName: BOXUSER_TABLE,
               Key: { id: bu.id },
               UpdateExpression: 'SET boxUserUserId = :systemId',
               ExpressionAttributeValues: { ':systemId': SYSTEM_ID }
            }));
            count++;
         }
      }
   }
   
   console.log(`Reassigned ${count} box users to SYSTEM`);
}

async function main()
{
   console.log(`Starting pre-migration cleanup for ${ENV.toUpperCase()}...\n`);
   console.log(`Region: ${REGION}`);
   console.log(`Tables: ${TABLE_PREFIX}\n`);
   
   // Ensure SYSTEM user exists
   await ensureSystemUser();
   
   // Get user IDs to reassign
   const userIds = await getUserIdsToReassign();
   
   console.log(`\nTotal users to reassign: ${userIds.length}\n`);
   
   if (0 === userIds.length)
   {
      console.log('No users to reassign. Exiting.');
      return;
   }
   
   // Reassign ownership
   await reassignDocuments(userIds);
   await reassignBoxes(userIds);
   await reassignBoxUsers(userIds);
   
   console.log(`\nCleanup complete for ${ENV.toUpperCase()}! Ready to export DynamoDB data.`);
}

main().catch(console.error);
