import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function wireDocumentResolvers(data: any) {
   const dataResources = data.resources as any;
   const documentTable = dataResources.tables['Document'];

   const documentDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'DocumentTableDS',
      documentTable
   );

   documentDS.node.addDependency(documentTable);

   const createResolverCode = readFileSync(
      join(__dirname, 'createDocumentGuarded.js'),
      'utf-8'
   );

   const createResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateDocumentGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createDocumentGuarded',
      dataSourceName: documentDS.name,
      kind:           'UNIT',
      code:           createResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   createResolver.addDependency(documentDS.ds);

   const updateResolverCode = readFileSync(
      join(__dirname, 'updateDocumentGuarded.js'),
      'utf-8'
   );

   const updateResolver = new CfnResolver(dataResources.graphqlApi.stack, 'UpdateDocumentGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateDocumentGuarded',
      dataSourceName: documentDS.name,
      kind:           'UNIT',
      code:           updateResolverCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   updateResolver.addDependency(documentDS.ds);
}
