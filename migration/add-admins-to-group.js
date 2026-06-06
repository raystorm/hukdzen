#!/usr/bin/env node

/**
 * Add Admins to Group Script (Phase 4)
 * 
 * Adds all admin users to WebAppAdmin Cognito group
 * Creates group if it doesn't exist
 */

import {
   CognitoIdentityProviderClient,
   AdminAddUserToGroupCommand,
   CreateGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
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
   console.error('Usage: node add-admins-to-group.js [sbx|dev|prod]');
   process.exit(1);
}

/**
 * Ensure WebAppAdmin group exists
 */
export async function ensureGroupExists(userPoolId, cognitoClient)
{
   try
   {
      await cognitoClient.send(
         new CreateGroupCommand({
            UserPoolId: userPoolId,
            GroupName: 'WebAppAdmin',
            Description: 'Application administrators'
         })
      );
      console.log(`Created group: WebAppAdmin`);
   }
   catch (error)
   {
      if (error.name === 'GroupExistsException')
      {
         console.log(`Group WebAppAdmin already exists`);
      }
      else
      {
         throw error;
      }
   }
}

/**
 * Add admin users to WebAppAdmin group
 */
export async function addAdminsToGroup(users, userPoolId, cognitoClient)
{
   const adminUsers = users.filter(u => u.isAdmin === true);
   
   console.log(`Adding ${adminUsers.length} admin users to WebAppAdmin group...\\n`);
   
   let added = 0;
   let failed = 0;
   const failures = [];
   
   for (const user of adminUsers)
   {
      try
      {
         await cognitoClient.send(
            new AdminAddUserToGroupCommand({
               UserPoolId: userPoolId,
               Username: user.email,
               GroupName: 'WebAppAdmin'
            })
         );
         console.log(`  ✓ Added ${user.email} to WebAppAdmin`);
         added++;
      }
      catch (error)
      {
         console.error(`  ✗ Failed to add ${user.email}:`, error.message);
         failures.push({ email: user.email, error: error.message });
         failed++;
      }
   }
   
   return { added, failed, failures };
}

/**
 * Main execution
 */
async function main()
{
   console.log(`Adding admin users to WebAppAdmin group for ${ENV.toUpperCase()}...\\n`);
   
   const config = GEN2_CONFIG[ENV];
   const gen2Config = GEN2_CONFIG[ENV];
   const sourceEnv = gen2Config.gen1Source || ENV;
   
   const inputFile = path.join(__dirname, 'import-ready', ENV, 'User.json');
   
   if (!fs.existsSync(inputFile))
   {
      console.error(`ERROR: User data not found: ${inputFile}`);
      console.error('Run update-foreign-keys.js first');
      process.exit(1);
   }
   
   const users = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
   
   const cognitoClient = new CognitoIdentityProviderClient({ region: config.region });
   
   await ensureGroupExists(config.userPoolId, cognitoClient);
   
   const result = await addAdminsToGroup(users, config.userPoolId, cognitoClient);
   
   console.log(`\\n=== Results ===`);
   console.log(`Added: ${result.added} admins`);
   console.log(`Failed: ${result.failed} admins`);
   
   if (result.failures.length > 0)
   {
      console.log(`\\nFailed admins:`);
      result.failures.forEach(f => console.log(`  - ${f.email}: ${f.error}`));
   }
   
   console.log(`\\nNext step: node verify-migration.js ${ENV}`);
}

if (import.meta.url === `file://${process.argv[1]}`)
{ main(); }
