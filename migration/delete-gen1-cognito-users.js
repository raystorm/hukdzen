#!/usr/bin/env node

/**
 * Delete Gen1 Cognito Users Script (Optional Cleanup)
 * 
 * Deletes all users from Gen1 Cognito User Pool after migration verification
 * Run ONLY after verification period (e.g., 30 days)
 */

import {
   CognitoIdentityProviderClient,
   ListUsersCommand,
   AdminDeleteUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { GEN1_COGNITO_CONFIG } from './config.js';

const ENV = process.argv[2];

if (!['dev', 'prod'].includes(ENV))
{
   console.error('Usage: node delete-gen1-cognito-users.js [dev|prod]');
   process.exit(1);
}

/**
 * Sleep utility
 */
function sleep(ms)
{
   return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * List all users in Cognito User Pool
 */
async function listAllCognitoUsers(userPoolId, cognitoClient)
{
   const users = [];
   let paginationToken = null;
   
   do
   {
      const response = await cognitoClient.send(
         new ListUsersCommand({
            UserPoolId: userPoolId,
            PaginationToken: paginationToken
         })
      );
      
      users.push(...response.Users);
      paginationToken = response.PaginationToken;
   }
   while (paginationToken);
   
   return users;
}

/**
 * Delete all Gen1 Cognito users
 */
async function deleteGen1CognitoUsers(env)
{
   const config = GEN1_COGNITO_CONFIG[env];
   
   console.log('⚠️  WARNING: This will delete all Gen1 Cognito users');
   console.log(`Environment: ${env.toUpperCase()}`);
   console.log(`User Pool: ${config.userPoolId}`);
   console.log('\\nPress Ctrl+C to cancel, or wait 10 seconds to proceed...\\n');
   
   await sleep(10000);
   
   const cognitoClient = new CognitoIdentityProviderClient({ region: config.region });
   
   console.log('Listing all Gen1 Cognito users...');
   const users = await listAllCognitoUsers(config.userPoolId, cognitoClient);
   
   console.log(`Found ${users.length} users to delete\\n`);
   
   let deleted = 0;
   let failed = 0;
   
   for (const user of users)
   {
      try
      {
         await cognitoClient.send(
            new AdminDeleteUserCommand({
               UserPoolId: config.userPoolId,
               Username: user.Username
            })
         );
         console.log(`✓ Deleted: ${user.Username}`);
         deleted++;
      }
      catch (error)
      {
         console.error(`✗ Failed to delete ${user.Username}:`, error.message);
         failed++;
      }
   }
   
   console.log(`\\n=== Results ===`);
   console.log(`Deleted: ${deleted} users`);
   console.log(`Failed: ${failed} users`);
   console.log(`\\nGen1 Cognito cleanup complete`);
}

deleteGen1CognitoUsers(ENV);
