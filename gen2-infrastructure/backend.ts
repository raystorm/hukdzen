// Amplify Gen 2 Backend Configuration
// Automated infrastructure deployment

import { defineBackend } from '@aws-amplify/backend';
import { MonitoringStack } from './monitoring-stack';

// Import resources
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { ingestTrigger } from './functions/ingest-trigger/resource';
import { emailNotifier } from './functions/email-notifier/resource';
import { emailOptOutHandler } from './functions/email-opt-out-handler/resource';
import { searchDocuments } from './functions/search-documents/resource';

const backend = defineBackend({
   auth,
   data,
   storage,
   ingestTrigger,
   emailNotifier,
   emailOptOutHandler,
   searchDocuments,
});

// Get environment
const env = process.env.AMPLIFY_ENV || 'dev';
const region = process.env.AWS_REGION || 'us-west-2';

// Create monitoring stack with cost alarms
const monitoringStack = new MonitoringStack(
   backend.createStack('monitoring-stack'),
   'MonitoringStack',
   {
      env: env as 'dev' | 'prod',
      region: region,
      alertEmail: process.env.ALERT_EMAIL || 'admin@hukdzen.com',
      costThreshold: env === 'prod' ? 40 : 20,
      emailOptOutHandlerArn: backend.emailOptOutHandler.resources.lambda.functionArn,
   }
);

// Grant Lambda functions access to OpenSearch Serverless
const opensearchPolicy = {
   Effect: 'Allow',
   Action: [
      'aoss:APIAccessAll',
      'aoss:ReadDocument',
      'aoss:WriteDocument',
   ],
   Resource: monitoringStack.opensearchCollectionArn,
};

backend.ingestTrigger.resources.lambda.addToRolePolicy(opensearchPolicy);
backend.searchDocuments.resources.lambda.addToRolePolicy(opensearchPolicy);

// Grant email functions access to SES in us-west-2
const sesPolicy = {
   Effect: 'Allow',
   Action: [
      'ses:SendEmail',
      'ses:SendTemplatedEmail',
      'ses:SendRawEmail',
   ],
   Resource: '*',
   Condition: {
      StringEquals: {
         'ses:FromAddress': process.env.SES_FROM_EMAIL || 'noreply@hukdzen.com',
      },
   },
};

backend.emailNotifier.resources.lambda.addToRolePolicy(sesPolicy);

// Add environment variables to Lambda functions
backend.ingestTrigger.addEnvironment('OPENSEARCH_ENDPOINT', monitoringStack.opensearchCollectionEndpoint);
backend.ingestTrigger.addEnvironment('OPENSEARCH_REGION', region);
backend.ingestTrigger.addEnvironment('ENV', env);

backend.searchDocuments.addEnvironment('OPENSEARCH_ENDPOINT', monitoringStack.opensearchCollectionEndpoint);
backend.searchDocuments.addEnvironment('OPENSEARCH_REGION', region);

backend.emailNotifier.addEnvironment('SES_REGION', 'us-west-2');
backend.emailNotifier.addEnvironment('SES_FROM_EMAIL', process.env.SES_FROM_EMAIL || 'noreply@hukdzen.com');
backend.emailNotifier.addEnvironment('SES_CONFIGURATION_SET', `hukdzen-${env}`);

backend.emailOptOutHandler.addEnvironment('USER_TABLE', backend.data.resources.tables['User'].tableName);
backend.emailOptOutHandler.addEnvironment('ENV', env);

// Export outputs
export const outputs = {
   opensearchEndpoint: monitoringStack.opensearchCollectionEndpoint,
   region: region,
   env: env,
};
