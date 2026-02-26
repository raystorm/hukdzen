import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function wireAuthorResolvers(data: any) {
   const dataResources = data.resources as any;
   const authorTable = dataResources.tables['Author'];

   // Create DynamoDB data source for Author table
   const authorDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'AuthorTableDS',
      authorTable
   );

   // Ensure data source is created before resolvers
   authorDS.node.addDependency(authorTable);

   const createResolverCode = readFileSync(
      join(__dirname, 'createAuthorGuarded.js'),
      'utf-8'
   );

   const createResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateAuthorGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createAuthorGuarded',
      dataSourceName: authorDS.name,
      kind:           'UNIT',
      code:           createResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   createResolver.addDependency(authorDS.ds);

   const updateResolverCode = readFileSync(
      join(__dirname, 'updateAuthorGuarded.js'),
      'utf-8'
   );

   const updateResolver = new CfnResolver(dataResources.graphqlApi.stack,
                                          'UpdateAuthorGuardedResolver',
   {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateAuthorGuarded',
      dataSourceName: authorDS.name,
      kind:           'UNIT',
      code:           updateResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   updateResolver.addDependency(authorDS.ds);
}
