#!/usr/bin/env node

/**
 * Create Cognito Users Script (Phase 1)
 * 
 * Creates all Gen1 users in Gen2 Cognito User Pool
 * Handles native and OAuth users with provider linking
 * Builds ID mapping: Gen1 ID → Gen2 Cognito sub
 */

import {
   AdminCreateUserCommand,
   AdminGetUserCommand,
   AdminLinkProviderForUserCommand,
   CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider';
import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {GEN2_CONFIG, SYSTEM_USER_ID} from './config.js';

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
 * Sleep for retry logic
 */
function sleep(ms)
{
   return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build the AdminLinkProviderForUser params that attach a Gen1 OAuth identity
 * to an existing native Cognito user
 */
function buildLinkParams(userPoolId, username, provider, gen1Id)
{
   return {
      UserPoolId: userPoolId,
      DestinationUser: {
         ProviderName: 'Cognito',
         ProviderAttributeValue: username
      },
      SourceUser: {
         ProviderName: provider,
         ProviderAttributeName: 'Cognito_Subject',
         ProviderAttributeValue: extractProviderSubject(gen1Id)
      }
   };
}

/**
 * True when the Cognito user already has an identity from this provider
 */
function isProviderLinked(cognitoUserAttributes, provider)
{
   const identities = cognitoUserAttributes.find(a => a.Name === 'identities');
   if (!identities) { return false; }
   
   return JSON.parse(identities.Value).some(i => i.providerName === provider);
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
            ]
            // AWS generates password and emails user automatically
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
            
            // A Gen1 OAuth account whose email already exists (a seed user, or an earlier
            // duplicate account) still needs its provider identity linked
            if (provider && !isProviderLinked(existingUser.UserAttributes, provider))
            {
               await cognitoClient.send(new AdminLinkProviderForUserCommand(
                  buildLinkParams(userPoolId, existingUser.Username, provider, user.id)
               ));
            }
            
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
      // The System User is not a person. It keeps its fixed id and gets no Cognito account.
      if (SYSTEM_USER_ID === user.id)
      {
         console.log(`- Skipped ${user.email} (${user.id}): System User has no Cognito account`);
         continue;
      }
      
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
   
   const config = GEN2_CONFIG[ENV];
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
