import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

export function configureEmailNotifier(backend: any)
{
   const dataResources = backend.data.resources as any;
   const emailResources = backend.emailNotifier.resources as any;

   // Use prod-specific parameter for prod, shared for dev/sandbox
   const env = process.env.AWS_BRANCH === 'prod' ? 'prod' : 'dev';
   const parameterName = `/hukdzen/${env}/jwt-secret`;

   // Set frontend URL based on environment
   let frontendUrl = 'https://dev.smalgyax-files.org';  // Default: deployed dev
   if (process.env.AWS_BRANCH === 'prod') {
      frontendUrl = 'https://smalgyax-files.org';
   } else if (!process.env.AWS_BRANCH) {
      frontendUrl = 'http://localhost:3000';  // Sandbox
   }

   // Pass parameter name to Lambda, it will read the value at runtime
   emailResources.lambda.addEnvironment('JWT_SECRET_PARAMETER_NAME', parameterName);
   emailResources.lambda.addEnvironment('FRONTEND_URL', frontendUrl);
   
   // Grant Lambda permission to read the SSM parameter
   emailResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['ssm:GetParameter'],
         resources: [`arn:aws:ssm:*:*:parameter${parameterName}`],
      })
   );
   
   // Grant SES send email permissions
   emailResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['ses:SendEmail', 'ses:SendRawEmail'],
         resources: ['*'],
      })
   );

   // Wire sendTemplatedEmail mutation to this Lambda
   const dataBackend = backend.data as any;
   dataBackend.addLambdaDataSource('emailNotifierDS', emailResources.lambda);

   new CfnResolver(backend.stack, 'SendTemplatedEmailResolver', {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Mutation',
      fieldName: 'sendTemplatedEmail',
      dataSourceName: 'emailNotifierDS',
      kind: 'UNIT',
   });

   return backend.emailNotifier;
}
