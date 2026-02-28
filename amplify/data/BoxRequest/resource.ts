import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function wireBoxRequestResolvers(data: any) {
   const dataResources = data.resources as any;
   const boxRequestTable = dataResources.tables['BoxRequest'];

   const boxRequestDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'BoxRequestTableDS',
      boxRequestTable
   );

   boxRequestDS.node.addDependency(boxRequestTable);

   const createResolverCode = readFileSync(
      join(__dirname, 'createBoxRequestGuarded.js'),
      'utf-8'
   );

   const createResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateBoxRequestGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createBoxRequestGuarded',
      dataSourceName: boxRequestDS.name,
      kind:           'UNIT',
      code:           createResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   createResolver.addDependency(boxRequestDS.ds);

   const updateResolverCode = readFileSync(
      join(__dirname, 'updateBoxRequestGuarded.js'),
      'utf-8'
   );

   const updateResolver = new CfnResolver(dataResources.graphqlApi.stack,
                                          'UpdateBoxRequestGuardedResolver',
   {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateBoxRequestGuarded',
      dataSourceName: boxRequestDS.name,
      kind:           'UNIT',
      code:           updateResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   updateResolver.addDependency(boxRequestDS.ds);
}
