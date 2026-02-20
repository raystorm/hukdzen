import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 *  **NOTE:** This domain wires JS guard resolvers only.
 *  Hydration for BoxUser is handled by the BoxUserHydrator Lambda.
 *  @param data
 */
export function wireBoxUserResolvers(data: any)
{
   const dataResources = data.resources as any;
   const boxUserTable  = dataResources.tables['BoxUser'];

   const boxUserDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'BoxUserTableDS',
      boxUserTable
   );

   boxUserDS.node.addDependency(boxUserTable);

   const createResolverCode = readFileSync(
      join(__dirname, 'createBoxUserGuarded.js'),
      'utf-8'
   );

   const createResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateBoxUserGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createBoxUserGuarded',
      dataSourceName: boxUserDS.name,
      kind:           'UNIT',
      code:           createResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   createResolver.node.addDependency(boxUserDS.ds);

   const updateResolverCode = readFileSync(
      join(__dirname, 'updateBoxUserGuarded.js'),
      'utf-8'
   );

   const updateResolver = new CfnResolver(dataResources.graphqlApi.stack, 'UpdateBoxUserGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateBoxUserGuarded',
      dataSourceName: boxUserDS.name,
      kind:           'UNIT',
      code:           updateResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   updateResolver.node.addDependency(boxUserDS.ds);
}
