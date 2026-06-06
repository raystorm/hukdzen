import { defineBackend } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnUserPoolGroup } from 'aws-cdk-lib/aws-cognito';
import { Fn } from 'aws-cdk-lib';

import { MonitoringStack } from './monitoring-stack';
import { configureStorage } from './storage/backend';

import { configureSeedLoader } from './functions/seedLoader/infra/backend';
import { configureIndexInit } from './functions/indexInit/infra/backend';
import { configureIngestTrigger } from './functions/ingestTrigger/infra/backend';
import { configureSearchRunner } from './functions/searchRunner/infra/backend';
import { configureEmailNotifier } from './functions/emailNotifier/infra/backend';
import { configureEmailPreferenceManager } from './functions/emailPreferenceManager/infra/backend';
import { emailNotifier } from './functions/emailNotifier/infra/resource';
import { emailPreferenceManager } from './functions/emailPreferenceManager/infra/resource';

import { configureBoxUserHydrator } from './functions/data/BoxUserHydrator/infra/backend';
import { configureBoxRequestHydrator } from './functions/data/BoxRequestHydrator/infra/backend';
import { wireAuthorResolvers } from './data/Author/resource';
import { wireBoxResolvers } from './data/Box/resource';
import { wireDocumentResolvers } from './data/Document/resource';
import { wireBoxUserResolvers } from './data/BoxUser/resource';
import { wireUserResolvers } from './data/User/resource';
import { wireBoxRequestResolvers } from './data/BoxRequest/resource';
import { wireCollectionResolvers } from './data/Collection/resource';

// Import resources
//core AWS services
import { auth    } from './auth/resource';
import { data    } from './data/resource';
import { storage } from './storage/resource';

//lambda functions
import { seedLoader    } from './functions/seedLoader/infra/resource';
import { indexInit     } from './functions/indexInit/infra/resource';
import { ingestTrigger } from './functions/ingestTrigger/infra/resource';
import { searchRunner } from './functions/searchRunner/infra/resource';

import { boxUserHydrator } from './functions/data/BoxUserHydrator/infra/resource';
import { boxRequestHydrator } from './functions/data/BoxRequestHydrator/infra/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
// Get environment - defaults to dev for safety and simplicity
const env = process.env.AMPLIFY_ENV || 'dev';
const region = env === 'dev' ? 'us-east-1' : 'us-west-2';

/**
 * OpenSearch Configuration
 * 
 * Controls whether OpenSearch infrastructure is deployed.
 * 
 * Default behavior:
 * - Sandbox (no AMPLIFY_ENV or AMPLIFY_ENV=sandbox): OFF (fast deployment, low cost)
 * - Dev/Prod (AMPLIFY_ENV=dev or prod): ON (full search functionality)
 * 
 * Override with ENABLE_OPENSEARCH environment variable:
 * - ENABLE_OPENSEARCH=true: Force ON (any environment)
 * - ENABLE_OPENSEARCH=false: Force OFF (any environment)
 * 
 * When disabled:
 * - No OpenSearch collection created
 * - No search Lambdas deployed (indexInit, ingestTrigger, searchRunner)
 * - Search requests fail gracefully in frontend
 * - All other functionality works normally
 * 
 * Cost implications:
 * - OpenSearch Serverless: ~$4-$8/day minimum (even when idle)
 * - Disabling in sandbox saves ~$120-$240/month
 * 
 * See: docs/dev/sandbox-development.md for full documentation
 */
const isSandbox = !process.env.AMPLIFY_ENV || process.env.AMPLIFY_ENV === 'sandbox';
const enableOpenSearch = process.env.ENABLE_OPENSEARCH 
  ? process.env.ENABLE_OPENSEARCH === 'true'
  : !isSandbox;

export const backend = defineBackend({
  auth,
  data,
  storage,
  seedLoader,
  ...(enableOpenSearch ? { indexInit, ingestTrigger, searchRunner } : {}),
  boxUserHydrator,
  boxRequestHydrator,
  emailNotifier,
  emailPreferenceManager,
});

// Create WebAppAdmin group without role mapping so users use authenticated role
new CfnUserPoolGroup(backend.auth.resources.userPool.stack, 'WebAppAdminGroup', {
  groupName: 'WebAppAdmin',
  userPoolId: backend.auth.resources.cfnResources.cfnUserPool.ref,
});

// Configure SES for Cognito emails
const isProd = process.env.AWS_BRANCH === 'main' || process.env.NODE_ENV === 'production';
if (isProd || isSandbox) {
  const cfnUserPool = backend.auth.resources.cfnResources.cfnUserPool;
  const accountId = Fn.ref('AWS::AccountId');
  
  cfnUserPool.emailConfiguration = {
    emailSendingAccount: 'DEVELOPER',
    sourceArn: `arn:aws:ses:${region}:${accountId}:identity/smalgyax-files.org`,
    from: 'no-reply@smalgyax-files.org',
  };
}

// Configure storage
configureStorage(backend, env);

// Configure seed loader
configureSeedLoader(backend);

/* ===== CUSTOM RESOLVERS =====
 * TODO: Add custom resolvers for required relationship validation
 * Gen 2 requires using CDK L1 constructs (CfnResolver) to add custom resolvers
 * Resolvers are ready in amplify/data/resolvers/ but need CDK integration
 * See: https://docs.amplify.aws/gen2/build-a-backend/data/custom-business-logic/
 // ===== END CUSTOM RESOLVERS ===== */

/* ===== MONITORING STACK ===== */
const monitoringStack = new MonitoringStack(
   backend.createStack('monitoring-stack'),
   'MonitoringStack',
   {
      env: env as 'dev' | 'prod',
      region: region,
      alertEmail: process.env.ALERT_EMAIL || 'Tom.Burton@Outlook.com',
      costThreshold: env === 'prod' ? 35 : 18,
      enableOpenSearch: enableOpenSearch,
      storageBucketName: backend.storage.resources.bucket.bucketName,
      ingestTriggerArn: backend.ingestTrigger?.resources.lambda.functionArn,
      searchRunnerArn: backend.searchRunner?.resources.lambda.functionArn,
      emailNotifierArn: backend.emailNotifier.resources.lambda.functionArn,
      emailPreferenceManagerArn: backend.emailPreferenceManager.resources.lambda.functionArn,
   }
);
//===== END MONITORING STACK ===== */

if (enableOpenSearch)
{
   /* ===== INDEX INIT ===== */
   const INDEX_NAME = 'treasures-index';
   configureIndexInit(
      backend,
      monitoringStack.opensearchCollectionEndpoint!,
      monitoringStack.opensearchCollectionArn!,
      INDEX_NAME
   );
   //===== END INDEX INIT ===== */

   /* ===== INGEST TRIGGER ===== */
   configureIngestTrigger(backend, INDEX_NAME);
   //===== END INGEST TRIGGER ===== */

   /* ===== SEARCH RUNNER ===== */
   configureSearchRunner(backend, monitoringStack.opensearchCollectionEndpoint!, INDEX_NAME);
   //===== END SEARCH RUNNER ===== */

   /* ===== OPENSEARCH POLICY ===== */
   const opensearchPolicy = new PolicyStatement({
      effect:    Effect.ALLOW,
      actions:   [ 'aoss:APIAccessAll', 'aoss:ReadDocument', 'aoss:WriteDocument', ],
      resources: [monitoringStack.opensearchCollectionArn!],
   });

   backend.ingestTrigger!.resources.lambda.addToRolePolicy(opensearchPolicy);
   backend.searchRunner!.resources.lambda.addToRolePolicy(opensearchPolicy);
   //===== END OPENSEARCH POLICY ===== */

   /* ===== LAMBDA ENVIRONMENT VARIABLES ===== */
   backend.ingestTrigger!.addEnvironment('OPENSEARCH_ENDPOINT',
                                        monitoringStack.opensearchCollectionEndpoint!);
   backend.ingestTrigger!.addEnvironment('OPENSEARCH_REGION', region);
   backend.ingestTrigger!.addEnvironment('ENV', env);

   backend.searchRunner!.addEnvironment('OPENSEARCH_ENDPOINT',
                                       monitoringStack.opensearchCollectionEndpoint!);
   backend.searchRunner!.addEnvironment('OPENSEARCH_REGION', region);
   //===== END LAMBDA ENVIRONMENT VARIABLES ===== */
}

/* ===== EMAIL NOTIFIER ===== */
configureEmailNotifier(backend);
//===== END EMAIL NOTIFIER ===== */

/* ===== EMAIL PREFERENCE MANAGER ===== */
configureEmailPreferenceManager(backend);
//===== END EMAIL PREFERENCE MANAGER ===== */

/* ===== Model Data Source Functions ===== */
configureBoxUserHydrator(backend);
configureBoxRequestHydrator(backend);
wireAuthorResolvers(backend.data);
wireBoxResolvers(backend.data);
wireDocumentResolvers(backend.data);
wireBoxUserResolvers(backend.data);
wireUserResolvers(backend.data);
wireBoxRequestResolvers(backend.data);
wireCollectionResolvers(backend.data);
//===== END Model Data Source Functions ===== */

const FROM_EMAIL_ADDRESS = 'noreply@smalgyax-files.org';

/* ===== SES POLICY ===== */
const sesPolicy = new PolicyStatement({
   effect: Effect.ALLOW,
   actions: [ 'ses:SendEmail', 'ses:SendTemplatedEmail', 'ses:SendRawEmail', ],
   resources: ['*'],
   conditions: {
      StringEquals: {
         'ses:FromAddress': process.env.SES_FROM_EMAIL || FROM_EMAIL_ADDRESS,
      },
   },
});

backend.emailNotifier.resources.lambda.addToRolePolicy(sesPolicy);
//===== END SES POLICY ===== */

/* ===== EMAIL LAMBDA ENVIRONMENT VARIABLES ===== */
backend.emailNotifier.addEnvironment('SES_REGION', 'us-west-2');
backend.emailNotifier.addEnvironment('SES_FROM_EMAIL',
                                     process.env.SES_FROM_EMAIL || FROM_EMAIL_ADDRESS);
backend.emailNotifier.addEnvironment('SES_CONFIGURATION_SET', `hukdzen-${env}`);
//===== END EMAIL LAMBDA ENVIRONMENT VARIABLES ===== */

// Export outputs
export const outputs = {
   // opensearchEndpoint: monitoringStack.opensearchCollectionEndpoint,
   region: region,
   env:    env,
};
