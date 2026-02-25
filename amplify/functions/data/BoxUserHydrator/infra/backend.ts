import { CfnResolver } from 'aws-cdk-lib/aws-appsync';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function configureBoxUserHydrator(backend: any)
{
   const dataResources = backend.data.resources as any;
   const hydratorResources = backend.boxUserHydrator.resources as any;
   const lambda = hydratorResources.lambda;

   // Add environment variable - use the L2 construct's graphqlUrl property
   hydratorResources.lambda.addEnvironment('AMPLIFY_DATA_GRAPHQL_ENDPOINT',
      dataResources.cfnResources.cfnGraphqlApi.attrGraphQlUrl);

   // Grant permissions
   dataResources.graphqlApi.grantQuery(lambda);
   dataResources.graphqlApi.grantMutation(lambda);

   // 1. Create the data source
   const dataSource = dataResources.graphqlApi.addLambdaDataSource(
      'BoxUserHydratorDS', lambda
   );

   // 2. Wire the resolver with code
   const resolverCode = readFileSync(
      join(__dirname, 'listBoxUserDetailed.js'), 'utf-8'
   );

   new CfnResolver(dataResources.graphqlApi.stack,
                   'ListBoxUserDetailedResolver',
   {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Query',
      fieldName: 'listBoxUserDetailed',
      dataSourceName: dataSource.name,
      kind: 'UNIT',
      code: resolverCode,
      runtime: {
         name: 'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   }).node.addDependency(dataSource);
}
