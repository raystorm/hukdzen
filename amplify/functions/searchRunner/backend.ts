import { defineBackend } from '@aws-amplify/backend';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function configureSearchRunner(backend: any, opensearchEndpoint?: string)
{
   const dataResources = backend.data.resources as any;
   const userTable = dataResources.tables['User'];
   const boxUserTable = dataResources.tables['BoxUser'];

   const runnerResources = backend.searchRunner.resources as any;
   runnerResources.lambda.addEnvironment('USER_TABLE_NAME', userTable.tableName);
   runnerResources.lambda.addEnvironment('BOX_USER_TABLE_NAME', boxUserTable.tableName);
   if (opensearchEndpoint)
   { runnerResources.lambda.addEnvironment('OPENSEARCH_ENDPOINT', opensearchEndpoint); }

   runnerResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['dynamodb:GetItem'],
         resources: [userTable.tableArn],
      })
   );

   runnerResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['dynamodb:Query'],
         resources: [
            boxUserTable.tableArn,
            `${boxUserTable.tableArn}/index/*`,
         ],
      })
   );

   runnerResources.lambda.addToRolePolicy(
      new PolicyStatement({
         actions: ['aoss:APIAccessAll'],
         resources: [`arn:aws:aoss:${backend.stack.region}:${backend.stack.account}:collection/*`],
      })
   );

   const dataBackend = backend.data as any;
   dataBackend.addLambdaDataSource('searchRunnerDataSource', runnerResources.lambda);
   dataBackend.addResolver('Query', 'searchDocuments',
                           { dataSource: 'searchRunnerDataSource' });
}
