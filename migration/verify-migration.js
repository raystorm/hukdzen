#!/usr/bin/env node

/**
 * Verify Migration Script (Phase 5)
 * 
 * Automated verification of migration success
 * Checks seed users, admin groups, OAuth links, foreign keys, and user counts
 */

import {
   CognitoIdentityProviderClient,
   AdminGetUserCommand,
   AdminListGroupsForUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GEN2_CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.argv[2] || 'sbx';

if (!['sbx', 'dev', 'prod'].includes(ENV))
{
   console.error('Usage: node verify-migration.js [sbx|dev|prod]');
   process.exit(1);
}

const SEED_EMAILS = [
   'testuser@example.com',
   'admin@example.com',
   'raystorm_@hotmail.com',
   'Tom.Burton@Outlook.com'
];

/**
 * Get Cognito user by email
 */
async function getCognitoUser(email, userPoolId, cognitoClient)
{
   try
   {
      const response = await cognitoClient.send(
         new AdminGetUserCommand({
            UserPoolId: userPoolId,
            Username: email
         })
      );
      return response;
   }
   catch (error)
   {
      if (error.name === 'UserNotFoundException')
      { return null; }
      throw error;
   }
}

/**
 * Check if user is in group
 */
async function isInGroup(email, groupName, userPoolId, cognitoClient)
{
   try
   {
      const response = await cognitoClient.send(
         new AdminListGroupsForUserCommand({
            UserPoolId: userPoolId,
            Username: email
         })
      );
      return response.Groups.some(g => g.GroupName === groupName);
   }
   catch (error)
   {
      return false;
   }
}

/**
 * Get DynamoDB user by email
 */
async function getDynamoUser(email, tableName, dynamoClient)
{
   try
   {
      const response = await dynamoClient.send(
         new ScanCommand({
            TableName: tableName,
            FilterExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email }
         })
      );
      return response.Items?.[0] || null;
   }
   catch (error)
   {
      return null;
   }
}

/**
 * Verify seed user conflicts handled
 */
export async function verifySeedUsers(
   seedEmails,
   getCognitoUserFn,
   getDynamoUserFn,
   isInGroupFn
)
{
   const results = [];
   
   for (const email of seedEmails)
   {
      const cognitoUser = await getCognitoUserFn(email);
      const dynamoUser = await getDynamoUserFn(email);
      const inWebAppAdmin = await isInGroupFn(email);
      
      results.push({
         email,
         cognitoExists: !!cognitoUser,
         dynamoExists: !!dynamoUser,
         hasGen1Data: dynamoUser?.clan || dynamoUser?.waa ? true : false,
         inWebAppAdmin
      });
   }
   
   return results;
}

/**
 * Verify admin group membership
 */
export async function verifyAdminGroups(users, isInGroupFn)
{
   const adminUsers = users.filter(u => u.isAdmin === true);
   const results = [];
   
   for (const user of adminUsers)
   {
      const inGroup = await isInGroupFn(user.email);
      results.push({
         email: user.email,
         isAdmin: user.isAdmin,
         inWebAppAdmin: inGroup,
         status: inGroup ? '✓' : '✗ MISSING'
      });
   }
   
   return results;
}

/**
 * Find Gen1 ID from Gen2 sub (reverse lookup)
 * Used in verification to determine if a user was originally OAuth
 */
function findGen1Id(gen2Sub, mapping)
{
   for (const [gen1Id, gen2Id] of mapping.entries())
   {
      if (gen2Id === gen2Sub)
      { return gen1Id; }
   }
   return null;
}

/**
 * Detect provider from Gen1 ID
 */
function detectProvider(userId)
{
   if (!userId) return null;
   if (userId.startsWith('google_')) return 'Google';
   if (userId.startsWith('facebook_')) return 'Facebook';
   if (userId.startsWith('loginwithamazon_')) return 'LoginWithAmazon';
   return null;
}

/**
 * Verify OAuth provider links
 */
export async function verifyOAuthLinks(users, mapping, getCognitoUserFn)
{
   const results = [];
   
   for (const user of users)
   {
      const gen1Id = findGen1Id(user.id, mapping);
      const expectedProvider = detectProvider(gen1Id);
      
      if (!expectedProvider)
      { continue; }
      
      const cognitoUser = await getCognitoUserFn(user.email);
      const identitiesAttr = cognitoUser?.UserAttributes?.find(a => a.Name === 'identities');
      const providers = identitiesAttr 
         ? JSON.parse(identitiesAttr.Value).map(p => p.providerName)
         : [];
      
      results.push({
         email: user.email,
         expectedProvider,
         linkedProviders: providers,
         status: providers.length > 0 ? '✓' : '✗ NO PROVIDER LINK'
      });
   }
   
   return results;
}

/**
 * Verify foreign key integrity
 */
export async function verifyForeignKeys(users, documents, boxes, boxUsers, collections)
{
   const userIds = new Set(users.map(u => u.id));
   
   const orphanedDocuments = documents.filter(
      d => !userIds.has(d.documentContentOwnerUserId)
   );
   
   const orphanedBoxes = boxes.filter(
      b => !userIds.has(b.ownerUserId)
   );
   
   const orphanedBoxUsers = boxUsers.filter(
      bu => !userIds.has(bu.userUserId) || !userIds.has(bu.boxUserUserId)
   );
   
   const orphanedCollections = collections.filter(
      c => !userIds.has(c.collectionContentOwnerUserId)
   );
   
   const totalOrphans = orphanedDocuments.length + orphanedBoxes.length + 
                        orphanedBoxUsers.length + orphanedCollections.length;
   
   return {
      totalUsers: users.length,
      totalDocuments: documents.length,
      totalBoxes: boxes.length,
      totalBoxUsers: boxUsers.length,
      totalCollections: collections.length,
      orphanedDocuments: orphanedDocuments.length,
      orphanedBoxes: orphanedBoxes.length,
      orphanedBoxUsers: orphanedBoxUsers.length,
      orphanedCollections: orphanedCollections.length,
      status: totalOrphans === 0 ? '✓' : '✗ ORPHANED RECORDS'
   };
}

/**
 * Verify user counts
 */
export async function verifyUserCounts(gen1Users, gen2Users, mapping)
{
   return {
      gen1Count: gen1Users.length,
      gen2Count: gen2Users.length,
      mappingCount: mapping.size,
      status: gen2Users.length >= gen1Users.length ? '✓' : '✗ USER COUNT MISMATCH'
   };
}

/**
 * Generate verification report
 */
function generateReport(results, env)
{
   console.log(`\\n=== Migration Verification Report (${env.toUpperCase()}) ===\\n`);
   
   console.log('Seed User Conflicts:');
   results.seedUserConflicts.forEach(r => {
      const status = r.cognitoExists && r.dynamoExists ? '✓' : '✗';
      console.log(`  ${status} ${r.email} - Cognito: ${r.cognitoExists}, DynamoDB: ${r.dynamoExists}, Gen1 Data: ${r.hasGen1Data}`);
   });
   
   console.log('\\nAdmin Group Membership:');
   results.adminGroups.forEach(r => {
      console.log(`  ${r.status} ${r.email}`);
   });
   
   if (results.oauthLinks.length > 0)
   {
      console.log('\\nOAuth Provider Links:');
      results.oauthLinks.forEach(r => {
         console.log(`  ${r.status} ${r.email} - Expected: ${r.expectedProvider}, Linked: ${r.linkedProviders.join(', ')}`);
      });
   }
   
   console.log('\\nForeign Key Integrity:');
   console.log(`  ${results.foreignKeys.status}`);
   console.log(`  Users: ${results.foreignKeys.totalUsers}`);
   console.log(`  Documents: ${results.foreignKeys.totalDocuments} (${results.foreignKeys.orphanedDocuments} orphaned)`);
   console.log(`  Boxes: ${results.foreignKeys.totalBoxes} (${results.foreignKeys.orphanedBoxes} orphaned)`);
   console.log(`  BoxUsers: ${results.foreignKeys.totalBoxUsers} (${results.foreignKeys.orphanedBoxUsers} orphaned)`);
   console.log(`  Collections: ${results.foreignKeys.totalCollections} (${results.foreignKeys.orphanedCollections} orphaned)`);
   
   console.log('\\nUser Counts:');
   console.log(`  ${results.userCounts.status}`);
   console.log(`  Gen1: ${results.userCounts.gen1Count}`);
   console.log(`  Gen2: ${results.userCounts.gen2Count}`);
   console.log(`  Mapping: ${results.userCounts.mappingCount}`);
   
   console.log('\\n=== End Report ===\\n');
}

/**
 * Main execution
 */
export async function verifyMigration(env, cognitoClient, dynamoClient)
{
   const config = GEN2_CONFIG[env];
   const gen2Config = GEN2_CONFIG[env];
   const sourceEnv = gen2Config.gen1Source || env;
   
   const mappingFile = path.join(__dirname, 'mappings', env, 'id-mapping.json');
   const importReadyDir = path.join(__dirname, 'import-ready', env);
   const transformedDir = path.join(__dirname, 'transformed', sourceEnv);
   
   const mappingObj = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
   const mapping = new Map(Object.entries(mappingObj));
   
   const gen2Users = JSON.parse(fs.readFileSync(path.join(importReadyDir, 'User.json'), 'utf8'));
   const gen1Users = JSON.parse(fs.readFileSync(path.join(transformedDir, 'User.json'), 'utf8'));
   const documents = JSON.parse(fs.readFileSync(path.join(importReadyDir, 'Document.json'), 'utf8'));
   const boxes = JSON.parse(fs.readFileSync(path.join(importReadyDir, 'Box.json'), 'utf8'));
   const boxUsers = JSON.parse(fs.readFileSync(path.join(importReadyDir, 'BoxUser.json'), 'utf8'));
   const collections = JSON.parse(fs.readFileSync(path.join(importReadyDir, 'Collection.json'), 'utf8'));
   
   const userTableName = `User-${gen2Config.tablePrefix}-${env}`;
   
   const results = {
      seedUserConflicts: await verifySeedUsers(
         SEED_EMAILS,
         (email) => getCognitoUser(email, config.userPoolId, cognitoClient),
         (email) => getDynamoUser(email, userTableName, dynamoClient),
         (email) => isInGroup(email, 'WebAppAdmin', config.userPoolId, cognitoClient)
      ),
      adminGroups: await verifyAdminGroups(
         gen2Users,
         (email) => isInGroup(email, 'WebAppAdmin', config.userPoolId, cognitoClient)
      ),
      oauthLinks: await verifyOAuthLinks(
         gen2Users,
         mapping,
         (email) => getCognitoUser(email, config.userPoolId, cognitoClient)
      ),
      foreignKeys: await verifyForeignKeys(gen2Users, documents, boxes, boxUsers, collections),
      userCounts: await verifyUserCounts(gen1Users, gen2Users, mapping)
   };
   
   return results;
}

async function main()
{
   console.log(`Verifying migration for ${ENV.toUpperCase()}...`);
   
   const config = GEN2_CONFIG[ENV];
   const cognitoClient = new CognitoIdentityProviderClient({ region: config.region });
   
   const dynamoClient = DynamoDBDocumentClient.from(
      new DynamoDBClient({ region: config.region })
   );
   
   const results = await verifyMigration(ENV, cognitoClient, dynamoClient);
   
   generateReport(results, ENV);
}

if (import.meta.url === `file://${process.argv[1]}`)
{ main(); }
