import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CfnResolver } from 'aws-cdk-lib/aws-appsync';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function wireCollectionResolvers(data: any) {
   const dataResources = data.resources as any;
   const collectionTable = dataResources.tables['Collection'];
   const collectionItemTable = dataResources.tables['CollectionItem'];

   // Create DynamoDB data source for Collection table
   const collectionDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'CollectionTableDS',
      collectionTable
   );
   collectionDS.node.addDependency(collectionTable);

   // Create DynamoDB data source for CollectionItem table
   const collectionItemDS = dataResources.graphqlApi.addDynamoDbDataSource(
      'CollectionItemTableDS',
      collectionItemTable
   );
   collectionItemDS.node.addDependency(collectionItemTable);

   // Wire createCollectionGuarded
   const createCollectionCode = readFileSync(
      join(__dirname, 'createCollectionGuarded.js'),
      'utf-8'
   );

   const createCollectionResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateCollectionGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createCollectionGuarded',
      dataSourceName: collectionDS.name,
      kind:           'UNIT',
      code:           createCollectionCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   createCollectionResolver.addDependency(collectionDS.ds);

   // Wire updateCollectionGuarded
   const updateCollectionCode = readFileSync(
      join(__dirname, 'updateCollectionGuarded.js'),
      'utf-8'
   );

   const updateCollectionResolver = new CfnResolver(dataResources.graphqlApi.stack, 'UpdateCollectionGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateCollectionGuarded',
      dataSourceName: collectionDS.name,
      kind:           'UNIT',
      code:           updateCollectionCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   updateCollectionResolver.addDependency(collectionDS.ds);

   // Wire createCollectionItemGuarded
   const createCollectionItemCode = readFileSync(
      join(__dirname, 'createCollectionItemGuarded.js'),
      'utf-8'
   );

   const createCollectionItemResolver = new CfnResolver(dataResources.graphqlApi.stack, 'CreateCollectionItemGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'createCollectionItemGuarded',
      dataSourceName: collectionItemDS.name,
      kind:           'UNIT',
      code:           createCollectionItemCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   createCollectionItemResolver.addDependency(collectionItemDS.ds);

   // Wire updateCollectionItemGuarded
   const updateCollectionItemCode = readFileSync(
      join(__dirname, 'updateCollectionItemGuarded.js'),
      'utf-8'
   );

   const updateCollectionItemResolver = new CfnResolver(dataResources.graphqlApi.stack, 'UpdateCollectionItemGuardedResolver', {
      apiId:          dataResources.graphqlApi.apiId,
      typeName:       'Mutation',
      fieldName:      'updateCollectionItemGuarded',
      dataSourceName: collectionItemDS.name,
      kind:           'UNIT',
      code:           updateCollectionItemCode,
      runtime: {
         name:           'APPSYNC_JS',
         runtimeVersion: '1.0.0',
      },
   });
   updateCollectionItemResolver.addDependency(collectionItemDS.ds);
}
