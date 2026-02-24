import { CfnResolver } from 'aws-cdk-lib/aws-appsync';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function configureBoxRequestHydrator(backend: any)
{
   const dataResources = backend.data.resources as any;
   const hydratorResources = backend.boxRequestHydrator.resources as any;
   const lambda = hydratorResources.lambda;

   hydratorResources.lambda.addEnvironment('AMPLIFY_DATA_GRAPHQL_ENDPOINT',
      dataResources.cfnResources.cfnGraphqlApi.attrGraphQlUrl);

   dataResources.graphqlApi.grantQuery(lambda);
   dataResources.graphqlApi.grantMutation(lambda);

   const dataSource = dataResources.graphqlApi.addLambdaDataSource(
      'BoxRequestHydratorDS', lambda
   );

   const getResolverCode = readFileSync(
      join(__dirname, 'getBoxRequestDetailed.js'), 'utf-8'
   );

   new CfnResolver(dataResources.graphqlApi.stack,
                   'GetBoxRequestDetailedResolver',
   {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Query',
      fieldName: 'getBoxRequestDetailed',
      dataSourceName: dataSource.name,
      kind: 'UNIT',
      code: getResolverCode,
      runtime: {
         name: 'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   }).node.addDependency(dataSource);

   const listResolverCode = readFileSync(
      join(__dirname, 'listBoxRequestDetailed.js'), 'utf-8'
   );

   new CfnResolver(dataResources.graphqlApi.stack,
                   'ListBoxRequestDetailedResolver',
   {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Query',
      fieldName: 'listBoxRequestDetailed',
      dataSourceName: dataSource.name,
      kind: 'UNIT',
      code: listResolverCode,
      runtime: {
         name: 'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   }).node.addDependency(dataSource);
}
