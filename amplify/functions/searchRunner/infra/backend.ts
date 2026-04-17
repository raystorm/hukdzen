import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

export function configureSearchRunner(backend: any, opensearchEndpoint?: string, indexName?: string)
{
   const dataResources = backend.data.resources as any;
   const userTable = dataResources.tables['User'];
   const boxUserTable = dataResources.tables['BoxUser'];

   const runnerResources = backend.searchRunner.resources as any;
   runnerResources.lambda.addEnvironment('USER_TABLE_NAME', userTable.tableName);
   runnerResources.lambda.addEnvironment('BOX_USER_TABLE_NAME', boxUserTable.tableName);
   if (opensearchEndpoint)
   { runnerResources.lambda.addEnvironment('OPENSEARCH_ENDPOINT', opensearchEndpoint); }
   if (indexName)
   { runnerResources.lambda.addEnvironment('INDEX_NAME', indexName); }

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
   dataBackend.addLambdaDataSource('sRDS', runnerResources.lambda);
   
   // TODO: The @auth directive creates a resolver pointing to NONE_DS
   // After deployment, manually update the resolver to use sRDS data source
   // Or find a way to override the auto-generated resolver
   new CfnResolver(backend.stack, 'SearchQueryResolver', {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Query',
      fieldName: 'search',
      dataSourceName: 'sRDS',
      kind: 'UNIT',
   });

}
