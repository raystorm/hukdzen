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

   // Wire getAuthorDetailed resolver
   const getResolverCode = readFileSync(
      join(__dirname, 'getAuthorDetailed.js'),
      'utf-8'
   );

   const getResolver = new CfnResolver(dataResources.graphqlApi.stack, 'GetAuthorDetailedResolver', {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Query',
      fieldName: 'getAuthorDetailed',
      dataSourceName: authorDS.name,
      kind: 'UNIT',
      code: getResolverCode,
      runtime: {
         name: 'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   getResolver.addDependency(authorDS.ds);

   // Wire listAuthorDetailed resolver
   const listResolverCode = readFileSync(
      join(__dirname, 'listAuthorDetailed.js'),
      'utf-8'
   );

   const listResolver = new CfnResolver(dataResources.graphqlApi.stack, 'ListAuthorDetailedResolver', {
      apiId: dataResources.graphqlApi.apiId,
      typeName: 'Query',
      fieldName: 'listAuthorDetailed',
      dataSourceName: authorDS.name,
      kind: 'UNIT',
      code: listResolverCode,
      runtime: {
         name: 'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   listResolver.addDependency(authorDS.ds);
}
