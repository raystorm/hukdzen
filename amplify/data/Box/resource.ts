import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function wireBoxResolvers(data: any) {
   const dataResources = data.resources as any;
   const boxTable = dataResources.tables['Box'];

   // Create DynamoDB data source for Box table
   const boxDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'BoxTableDS',
      boxTable
   );

   // Ensure data source is created before resolvers
   boxDS.node.addDependency(boxTable);

   const createResolverCode = readFileSync(
      join(__dirname, 'createBoxGuarded.js'),
      'utf-8'
   );

   const createResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateBoxGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createBoxGuarded',
      dataSourceName: boxDS.name,
      kind:           'UNIT',
      code:           createResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   createResolver.addDependency(boxDS.ds);

   const updateResolverCode = readFileSync(
      join(__dirname, 'updateBoxGuarded.js'),
      'utf-8'
   );

   const updateResolver = new CfnResolver(dataResources.graphqlApi.stack,
                                          'UpdateBoxGuardedResolver',
   {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateBoxGuarded',
      dataSourceName: boxDS.name,
      kind:           'UNIT',
      code:           updateResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   updateResolver.addDependency(boxDS.ds);
}
