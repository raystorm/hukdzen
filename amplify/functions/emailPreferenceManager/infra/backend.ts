import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function configureEmailPreferenceManager(backend: any)
{
   const dataResources = backend.data.resources as any;
   const userTable = dataResources.tables['User'];
   
   const emailPrefResources = backend.emailPreferenceManager.resources as any;
   emailPrefResources.lambda.addEnvironment('USER_TABLE_NAME', userTable.tableName);
   emailPrefResources.lambda.addEnvironment('JWT_SECRET', process.env.JWT_SECRET || '');

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
      'emailPreferenceManagerDataSource',
      emailPrefResources.lambda
   );

   dataBackend.addResolver('Query', 'getPublicUserEmailPreferences',
                           { dataSource: 'emailPreferenceManagerDataSource', });

   dataBackend.addResolver('Mutation', 'updateUserEmailPreferences',
                           { dataSource: 'emailPreferenceManagerDataSource', });

   backend.addOutput({
      custom: { emailPreferenceManagerArn: emailPrefResources.lambda.functionArn, },
   });
}
