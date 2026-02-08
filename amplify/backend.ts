import { defineBackend } from '@aws-amplify/backend';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

import { MonitoringStack } from './monitoring-stack';
import { configureStorage } from './storage/backend';
import { configureSeedLoader } from './functions/seedLoader/backend';
// import { configureSearchRunner } from './functions/searchRunner/backend';
import { configureEmailPreferenceManager } from './functions/emailPreferenceManager/backend';

// Import resources
import { auth } from './auth/resource';
import { data } from './data/resource';
import { seedLoader } from './functions/seedLoader/resource';
import { storage } from './storage/resource';
// import { ingestTrigger } from './functions/ingestTrigger/resource';
// import { emailNotifier } from './functions/email-notifier/resource';
import { emailPreferenceManager } from './functions/emailPreferenceManager/resource';
// import { searchRunner } from './functions/searchRunner/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
// Get environment - defaults to dev for safety and simplicity
const env = process.env.AMPLIFY_ENV || 'dev';
const region = env === 'dev' ? 'us-east-1' : 'us-west-2';

const backend = defineBackend({ auth, data, seedLoader, storage,
                                // emailPreferenceManager,
                                // ingestTrigger,
                                // searchRunner,
                                // emailNotifier,
});

// Configure storage
configureStorage(backend, env);

// Configure seed loader
configureSeedLoader(backend);

/* ===== SEARCH RUNNER =====
configureSearchRunner(backend, monitoringStack.opensearchCollectionEndpoint);
===== END SEARCH RUNNER ===== */

/* ===== EMAIL PREFERENCE MANAGER =====
configureEmailPreferenceManager(backend);
===== END EMAIL PREFERENCE MANAGER ===== */

/* ===== CUSTOM RESOLVERS =====
 * TODO: Add custom resolvers for required relationship validation
 * Gen 2 requires using CDK L1 constructs (CfnResolver) to add custom resolvers
 * Resolvers are ready in amplify/data/resolvers/ but need CDK integration
 * See: https://docs.amplify.aws/gen2/build-a-backend/data/custom-business-logic/
===== END CUSTOM RESOLVERS ===== */

const FROM_EMAIL_ADDRESS = 'noreply@smalgyax-files.org';

/* ===== MONITORING STACK =====
const monitoringStack = new MonitoringStack(
   backend.createStack('monitoring-stack'),
   'MonitoringStack',
   {
      env: env as 'dev' | 'prod',
      region: region,
      alertEmail: process.env.ALERT_EMAIL || 'Tom.Burton@Outlook.com',
      costThreshold: env === 'prod' ? 35 : 18,
      storageBucketName: backend.storage.resources.bucket.bucketName,
      searchRunnerArn: backend.searchRunner.resources.lambda.functionArn,
      // emailOptOutHandlerArn: backend.emailOptOutHandler.resources.lambda.functionArn,
   }
);
===== END MONITORING STACK ===== */

/* ===== OPENSEARCH POLICY =====
const opensearchPolicy = {
   Effect: 'Allow',
   Action: [ 'aoss:APIAccessAll', 'aoss:ReadDocument', 'aoss:WriteDocument', ],
   Resource: monitoringStack.opensearchCollectionArn,
};

backend.searchRunner.resources.lambda.addToRolePolicy(opensearchPolicy);
// backend.ingestTrigger.resources.lambda.addToRolePolicy(opensearchPolicy);
===== END OPENSEARCH POLICY ===== */

/* ===== SES POLICY =====
const sesPolicy = {
   Effect: 'Allow',
   Action: [ 'ses:SendEmail', 'ses:SendTemplatedEmail', 'ses:SendRawEmail',
   ],
   Resource: '*',
   Condition: {
      StringEquals: {
         'ses:FromAddress': process.env.SES_FROM_EMAIL || FROM_EMAIL_ADDRESS,
      },
   },
};

backend.emailNotifier.resources.lambda.addToRolePolicy(sesPolicy);
===== END SES POLICY ===== */

/* ===== LAMBDA ENVIRONMENT VARIABLES =====
backend.ingestTrigger.addEnvironment('OPENSEARCH_ENDPOINT',
                                     monitoringStack.opensearchCollectionEndpoint);
backend.ingestTrigger.addEnvironment('OPENSEARCH_REGION', region);
backend.ingestTrigger.addEnvironment('ENV', env);

backend.searchDocuments.addEnvironment('OPENSEARCH_ENDPOINT',
                                       monitoringStack.opensearchCollectionEndpoint);
backend.searchDocuments.addEnvironment('OPENSEARCH_REGION', region);

backend.emailNotifier.addEnvironment('SES_REGION', 'us-west-2');
backend.emailNotifier.addEnvironment('SES_FROM_EMAIL',
                                     process.env.SES_FROM_EMAIL || FROM_EMAIL_ADDRESS);
backend.emailNotifier.addEnvironment('SES_CONFIGURATION_SET', `hukdzen-${env}`);

backend.emailOptOutHandler.addEnvironment('USER_TABLE',
                                          backend.data.resources.tables['User'].tableName);
backend.emailOptOutHandler.addEnvironment('ENV', env);
===== END LAMBDA ENVIRONMENT VARIABLES ===== */

/* ===== JWT SECRETS =====
const jwtSecret = new Secret(stack, 'JWTSecret', {
   secretName: `hukdzen-${env}-jwt-secret`,
   description: 'JWT secret for email unsubscribe tokens',
   generateSecretString: {
      secretStringTemplate: JSON.stringify({ purpose: 'email-unsubscribe' }),
      generateStringKey: 'secret',
      excludePunctuation: true,
      passwordLength: 64,
   },
});

// Grant Lambda functions access to secret
backend.emailNotifier.resources.lambda.addEnvironment(
   'JWT_SECRET_ARN',
   jwtSecret.secretArn
);
jwtSecret.grantRead(backend.emailNotifier.resources.lambda);

backend.emailOptOutHandler.resources.lambda.addEnvironment(
   'JWT_SECRET_ARN',
   jwtSecret.secretArn
);
jwtSecret.grantRead(backend.emailOptOutHandler.resources.lambda);

// Export secret ARN for reference
new StringParameter(stack, 'JWTSecretParam', {
   parameterName: `/amplify/${env}/jwt-secret-arn`,
   stringValue: jwtSecret.secretArn,
   description: 'ARN of JWT secret for email unsubscribe',
});
===== END JWT SECRETS ===== */

// Export outputs
export const outputs = {
   // opensearchEndpoint: monitoringStack.opensearchCollectionEndpoint,
   region: region,
   env: env,
};
