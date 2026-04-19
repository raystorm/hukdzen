import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';
import { Duration } from 'aws-cdk-lib';

export function configureEmailPreferenceManager(backend: any)
{
   const dataResources = backend.data.resources as any;
   const userTable = dataResources.tables['User'];
   
   // Use prod-specific parameter for prod, shared for dev/sandbox
   const env = process.env.AWS_BRANCH === 'prod' ? 'prod' : 'dev';
   const parameterName = `/hukdzen/${env}/jwt-secret`;

   const emailPrefResources = backend.emailPreferenceManager.resources as any;
   emailPrefResources.lambda.addEnvironment('USER_TABLE_NAME', userTable.tableName);
   
   // Pass parameter name to Lambda, it will read the value at runtime
   emailPrefResources.lambda.addEnvironment('JWT_SECRET_PARAMETER_NAME', parameterName);
   
   // Grant Lambda permission to read the SSM parameter
   emailPrefResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['ssm:GetParameter'],
         resources: [`arn:aws:ssm:*:*:parameter${parameterName}`],
      })
   );

   emailPrefResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
         resources: [userTable.tableArn],
      })
   );

   emailPrefResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['dynamodb:Query'],
         resources: [`${userTable.tableArn}/index/*`],
      })
   );

   const dataBackend = backend.data as any;
   dataBackend.addLambdaDataSource(
      'emailPreferenceManagerDS',
      emailPrefResources.lambda
   );

   new CfnResolver(backend.stack, 'GetPublicUserEmailPreferencesResolver', {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Query',
      fieldName: 'getPublicUserEmailPreferences',
      dataSourceName: 'emailPreferenceManagerDS',
      kind: 'UNIT',
   });

   new CfnResolver(backend.stack, 'UpdateUserEmailPreferencesResolver', {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Mutation',
      fieldName: 'updateUserEmailPreferences',
      dataSourceName: 'emailPreferenceManagerDS',
      kind: 'UNIT',
   });

   // Enable Function URL for public access with CORS
   const functionUrl = emailPrefResources.lambda.addFunctionUrl({
      authType: 'NONE',
      cors: {
         allowedOrigins: ['*'],
         allowedMethods: ['GET', 'PUT'],
         allowedHeaders: ['*'],
      },
   });

   backend.addOutput({
      custom: {
         emailPreferenceManagerArn: emailPrefResources.lambda.functionArn,
         emailPreferenceManagerUrl: functionUrl.url,
      },
   });
}
