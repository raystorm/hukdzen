import { defineBackend } from '@aws-amplify/backend';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

import { MonitoringStack } from './monitoring-stack';
import { configureStorage } from './storage/backend';

import { configureSeedLoader } from './functions/seedLoader/infra/backend';
import { configureIndexInit } from './functions/indexInit/infra/backend';
import { configureIngestTrigger } from './functions/ingestTrigger/infra/backend';
import { configureSearchRunner } from './functions/searchRunner/infra/backend';
// import { configureEmailPreferenceManager } from './functions/emailPreferenceManager/infra/backend';

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

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
// Get environment - defaults to dev for safety and simplicity
const env = process.env.AMPLIFY_ENV || 'dev';
const region = env === 'dev' ? 'us-east-1' : 'us-west-2';

const backend = defineBackend({ auth, data, storage,
                                seedLoader, indexInit,
                                ingestTrigger, searchRunner,
                                // emailNotifier, emailPreferenceManager,
});

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
      storageBucketName: backend.storage.resources.bucket.bucketName,
      // searchRunnerArn: backend.searchRunner.resources.lambda.functionArn,
      // emailOptOutHandlerArn: backend.emailOptOutHandler.resources.lambda.functionArn,
   }
);
//===== END MONITORING STACK ===== */

/* ===== INDEX INIT ===== */
const INDEX_NAME = 'treasures-index';
configureIndexInit(
   backend,
   monitoringStack.opensearchCollectionEndpoint,
   monitoringStack.opensearchCollectionArn,
   INDEX_NAME
);
//===== END INDEX INIT ===== */

/* ===== INGEST TRIGGER ===== */
configureIngestTrigger(backend, INDEX_NAME);
//===== END INGEST TRIGGER ===== */

/* ===== SEARCH RUNNER ===== */
configureSearchRunner(backend, monitoringStack.opensearchCollectionEndpoint, INDEX_NAME);
//===== END SEARCH RUNNER ===== */

/* ===== EMAIL PREFERENCE MANAGER =====
configureEmailPreferenceManager(backend);
//===== END EMAIL PREFERENCE MANAGER ===== */

/* ===== OPENSEARCH POLICY ===== */
const opensearchPolicy = new PolicyStatement({
   effect:    Effect.ALLOW,
   actions:   [ 'aoss:APIAccessAll', 'aoss:ReadDocument', 'aoss:WriteDocument', ],
   resources: [monitoringStack.opensearchCollectionArn],
});

backend.ingestTrigger.resources.lambda.addToRolePolicy(opensearchPolicy);
backend.searchRunner.resources.lambda.addToRolePolicy(opensearchPolicy);
//===== END OPENSEARCH POLICY ===== */

/* ===== LAMBDA ENVIRONMENT VARIABLES ===== */
backend.ingestTrigger.addEnvironment('OPENSEARCH_ENDPOINT',
                                     monitoringStack.opensearchCollectionEndpoint);
backend.ingestTrigger.addEnvironment('OPENSEARCH_REGION', region);
backend.ingestTrigger.addEnvironment('ENV', env);

backend.searchRunner.addEnvironment('OPENSEARCH_ENDPOINT',
                                    monitoringStack.opensearchCollectionEndpoint);
backend.searchRunner.addEnvironment('OPENSEARCH_REGION', region);
//===== END LAMBDA ENVIRONMENT VARIABLES ===== */

const FROM_EMAIL_ADDRESS = 'noreply@smalgyax-files.org';

/* ===== SES POLICY =====
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

/* ===== EMAIL LAMBDA ENVIRONMENT VARIABLES =====
backend.emailNotifier.addEnvironment('SES_REGION', 'us-west-2');
backend.emailNotifier.addEnvironment('SES_FROM_EMAIL',
                                     process.env.SES_FROM_EMAIL || FROM_EMAIL_ADDRESS);
backend.emailNotifier.addEnvironment('SES_CONFIGURATION_SET', `hukdzen-${env}`);

backend.emailPreferenceManager.addEnvironment('USER_TABLE',
                                              backend.data.resources.tables['User'].tableName);
backend.emailPreferenceManager.addEnvironment('ENV', env);
//===== END EMAIL LAMBDA ENVIRONMENT VARIABLES ===== */

// Export outputs
export const outputs = {
   // opensearchEndpoint: monitoringStack.opensearchCollectionEndpoint,
   region: region,
   env:    env,
};
