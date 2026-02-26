import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function wireUserResolvers(data: any)
{
   const dataResources = data.resources as any;
   const userTable     = dataResources.tables['User'];

   const userDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'UserTableDS',
      userTable
   );

   userDS.node.addDependency(userTable);

   const createResolverCode = readFileSync(
      join(__dirname, 'createUserGuarded.js'),
      'utf-8'
   );

   const createResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateUserGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createUserGuarded',
      dataSourceName: userDS.name,
      kind:           'UNIT',
      code:           createResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   createResolver.addDependency(userDS.ds);

   const updateResolverCode = readFileSync(
      join(__dirname, 'updateUserGuarded.js'),
      'utf-8'
   );

   const updateResolver = new CfnResolver(dataResources.graphqlApi.stack, 'UpdateUserGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateUserGuarded',
      dataSourceName: userDS.name,
      kind:           'UNIT',
      code:           updateResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   updateResolver.addDependency(userDS.ds);
}
