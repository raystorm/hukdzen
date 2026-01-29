// Automated JWT Secret Management for Gen 2
// No more manual secret entry!

import { defineBackend } from '@aws-amplify/backend';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

const backend = defineBackend({ auth, data, storage,
                                emailNotifier, emailOptOutHandler,
});

const stack = backend.createStack('secrets-stack');

// Auto-generate JWT secret (or import existing)
const jwtSecret = new Secret(stack, 'JWTSecret', {
   secretName: `hukdzen-${process.env.ENV}-jwt-secret`,
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
   parameterName: `/amplify/${process.env.ENV}/jwt-secret-arn`,
   stringValue: jwtSecret.secretArn,
   description: 'ARN of JWT secret for email unsubscribe',
});
