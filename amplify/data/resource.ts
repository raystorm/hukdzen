import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { readFileSync } from 'fs';
import { join } from 'path';

const schemaFile = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

export const data = defineData({
   schema: schemaFile,
   authorizationModes: {
      defaultAuthorizationMode: 'userPool',
   },
});

/* Cannot addResolver to default mutation, only custom ones. comment for reference
// Add custom resolvers for required relationship validation
data.addResolver('Mutation', 'createDocumentDetails', {
   dataSource: data.resources.tables['DocumentDetails'],
   code: readFileSync(join(__dirname, 'resolvers', 'createDocumentDetails.js'), 'utf-8'),
});

data.addResolver('Mutation', 'createXbiis', {
   dataSource: data.resources.tables['Xbiis'],
   code: readFileSync(join(__dirname, 'resolvers', 'createXbiis.js'), 'utf-8'),
});

data.addResolver('Mutation', 'createBoxRequest', {
   dataSource: data.resources.tables['BoxRequest'],
   code: readFileSync(join(__dirname, 'resolvers', 'createBoxRequest.js'), 'utf-8'),
});

data.addResolver('Mutation', 'createCollection', {
   dataSource: data.resources.tables['Collection'],
   code: readFileSync(join(__dirname, 'resolvers', 'createCollection.js'), 'utf-8'),
});

data.addResolver('Mutation', 'updateBoxRequest', {
   dataSource: data.resources.tables['BoxRequest'],
   code: readFileSync(join(__dirname, 'resolvers', 'updateBoxRequest.js'), 'utf-8'),
});

data.addResolver('Mutation', 'createCollectionItem', {
   dataSource: data.resources.tables['CollectionItem'],
   code: readFileSync(join(__dirname, 'resolvers', 'createCollectionItem.js'), 'utf-8'),
});

data.addResolver('Mutation', 'createBoxUser', {
   dataSource: data.resources.tables['BoxUser'],
   code: readFileSync(join(__dirname, 'resolvers', 'createBoxUser.js'), 'utf-8'),
});
*/

//export type Schema = ClientSchema<typeof schemaFile>;
