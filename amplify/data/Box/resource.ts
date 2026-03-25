import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function wireBoxResolvers(data: any) {
   const dataResources = data.resources as any;
   const boxTable = dataResources.tables['Xbiis'];

   // Create DynamoDB data source for Box table
   const boxDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'BoxTableDS',
      boxTable
   );

   // Ensure data source is created before resolvers
   boxDS.node.addDependency(boxTable);

   const createResolverCode = readFileSync(
      join(__dirname, 'createXbiisGuarded.js'),
      'utf-8'
   );

   const createResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateXbiisGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createXbiisGuarded',
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
      join(__dirname, 'updateXbiisGuarded.js'),
      'utf-8'
   );

   const updateResolver = new CfnResolver(dataResources.graphqlApi.stack,
                                          'UpdateXbiisGuardedResolver',
   {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateXbiisGuarded',
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
