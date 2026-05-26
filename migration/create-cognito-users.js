#!/usr/bin/env node

/**
 * Create Cognito Users Script (Phase 1)
 * 
 * Creates all Gen1 users in Gen2 Cognito User Pool
 * Handles native and OAuth users with provider linking
 * Builds ID mapping: Gen1 ID → Gen2 Cognito sub
 */

import {
   CognitoIdentityProviderClient,
   AdminCreateUserCommand,
   AdminLinkProviderForUserCommand,
   AdminGetUserCommand
} from '@aws-sdk/client-cognito-identity-provider';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { COGNITO_CONFIG, OAUTH_PROVIDERS, GEN2_CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.argv[2] || 'sbx';

if (!['sbx', 'dev', 'prod'].includes(ENV))
{
   console.error('Usage: node create-cognito-users.js [sbx|dev|prod]');
   process.exit(1);
}

/**
 * Detect OAuth provider from Gen1 user ID
 */
export function detectProvider(userId)
{
   if (userId.startsWith('google_')) return 'Google';
   if (userId.startsWith('facebook_')) return 'Facebook';
   if (userId.startsWith('loginwithamazon_')) return 'LoginWithAmazon';
   return null;
}

/**
 * Extract provider subject from Gen1 user ID
 */
export function extractProviderSubject(userId)
{
   return userId.replace(/^(google|facebook|loginwithamazon)_/, '');
}

/**
 * Generate secure temporary password
 */
function generateSecurePassword()
{
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
   let password = '';
   for (let i = 0; i < 16; i++)
   { password += chars.charAt(Math.floor(Math.random() * chars.length)); }
   return password;
}

/**
 * Sleep for retry logic
 */
function sleep(ms)
{
   return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create single user in Cognito with retry logic
 */
export async function createUserInCognito(user, userPoolId, cognitoClient, maxRetries = 3)
{
   const provider = detectProvider(user.id);
   
   for (let attempt = 1; attempt <= maxRetries; attempt++)
   {
      try
      {
         // Step 1: Create base user
         const params = {
            UserPoolId: userPoolId,
            Username: user.email,
            UserAttributes: [
               { Name: 'email', Value: user.email },
               { Name: 'email_verified', Value: 'true' },
               { Name: 'name', Value: user.name }
            ],
            TemporaryPassword: generateSecurePassword(),
            MessageAction: 'SUPPRESS'
         };
         
         const response = await cognitoClient.send(new AdminCreateUserCommand(params));
         
         const sub = response.User.Attributes.find(a => a.Name === 'sub').Value;
         const username = response.User.Username;
         
         // Step 2: Link OAuth provider if needed
         if (provider)
         {
            const linkParams = {
               UserPoolId: userPoolId,
               DestinationUser: {
                  ProviderName: 'Cognito',
                  ProviderAttributeValue: username
               },
               SourceUser: {
                  ProviderName: provider,
                  ProviderAttributeName: 'Cognito_Subject',
                  ProviderAttributeValue: extractProviderSubject(user.id)
               }
            };
            
            await cognitoClient.send(new AdminLinkProviderForUserCommand(linkParams));
         }
         
         return { sub, username };
      }
      catch (error)
      {
         if (error.name === 'UsernameExistsException')
         {
            console.log(`User ${user.email} already exists - querying for sub`);
            
            const existingUser = await cognitoClient.send(
               new AdminGetUserCommand({
                  UserPoolId: userPoolId,
                  Username: user.email
               })
            );
            
            const sub = existingUser.UserAttributes.find(a => a.Name === 'sub').Value;
            return { sub, username: existingUser.Username };
         }
         
         if (error.name === 'LimitExceededException' && attempt < maxRetries)
         {
            console.log(`Rate limit hit, retrying in ${attempt}s...`);
            await sleep(1000 * attempt);
            continue;
         }
         
         throw error;
      }
   }
}

/**
 * Create all users in Cognito
 */
export async function createCognitoUsers(users, userPoolId, cognitoClient)
{
   const mapping = new Map();
   const failures = [];
   
   for (const user of users)
   {
      try
      {
         const result = await createUserInCognito(user, userPoolId, cognitoClient);
         mapping.set(user.id, result.sub);
         console.log(`✓ Created ${user.email} (${user.id} → ${result.sub})`);
      }
      catch (error)
      {
         failures.push({ userId: user.id, email: user.email, error });
         console.error(`✗ Failed to create ${user.email}:`, error.message);
      }
   }
   
   return { mapping, failures };
}

/**
 * Main execution
 */
async function main()
{
   console.log(`Creating Cognito users for ${ENV.toUpperCase()}...\\n`);
   
   const config = COGNITO_CONFIG[ENV];
   const gen2Config = GEN2_CONFIG[ENV];
   const sourceEnv = gen2Config.gen1Source || ENV;
   
   const inputFile = path.join(__dirname, 'transformed', sourceEnv, 'User.json');
   
   if (!fs.existsSync(inputFile))
   {
      console.error(`ERROR: User data not found: ${inputFile}`);
      console.error('Run transform-data.js first');
      process.exit(1);
   }
   
   const users = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
   
   console.log(`Loaded ${users.length} users from ${inputFile}\\n`);
   
   const cognitoClient = new CognitoIdentityProviderClient({ region: config.region });
   
   const { mapping, failures } = await createCognitoUsers(users, config.userPoolId, cognitoClient);
   
   console.log(`\\n=== Results ===`);
   console.log(`Created: ${mapping.size} users`);
   console.log(`Failed: ${failures.length} users`);
   
   if (failures.length > 0)
   {
      console.log(`\\nFailed users:`);
      failures.forEach(f => console.log(`  - ${f.email} (${f.userId}): ${f.error.message}`));
   }
   
   const outputDir = path.join(__dirname, 'mappings', ENV);
   if (!fs.existsSync(outputDir))
   { fs.mkdirSync(outputDir, { recursive: true }); }
   
   const mappingFile = path.join(outputDir, 'id-mapping.json');
   const mappingObj = Object.fromEntries(mapping);
   fs.writeFileSync(mappingFile, JSON.stringify(mappingObj, null, 2));
   
   console.log(`\\nMapping saved to: ${mappingFile}`);
   
   if (failures.length > 0)
   {
      const failuresFile = path.join(outputDir, 'failures.json');
      fs.writeFileSync(failuresFile, JSON.stringify(failures, null, 2));
      console.log(`Failures saved to: ${failuresFile}`);
   }
   
   console.log(`\\nNext step: node update-foreign-keys.js ${ENV}`);
}

if (import.meta.url === `file://${process.argv[1]}`)
{ main(); }
