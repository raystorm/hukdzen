#!/usr/bin/env node

/**
 * Validate Transformation Script
 * 
 * Validates Gen1 to Gen2 data transformations
 * Run AFTER transform-data.js and BEFORE import-dynamodb.js
 */

import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function validateDocumentSchema(doc, index, errors)
{
   if ('Document' !== doc.__typename)
   {
      errors.schema.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    '__typename',
         message:  `Expected "Document", got "${doc.__typename}"`
      });
   }

   if (!doc.eng || 'object' !== typeof doc.eng)
   {
      errors.schema.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'eng',
         message:  'Missing or invalid nested Summary object',
      });
   }
   else
   {
      if (!('title' in doc.eng))
      {
         errors.schema.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'eng.title',
            message:  'Missing title field',
         });
      }
      if (!('description' in doc.eng))
      {
         errors.schema.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'eng.description',
            message:  'Missing description field',
         });
      }
   }

   if (!doc.bc || 'object' !== typeof doc.bc)
   {
      errors.schema.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'bc',
         message:  'Missing or invalid nested Summary object',
      });
   }
   else
   {
      if (!('title' in doc.bc))
      {
         errors.schema.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'bc.title',
            message:  'Missing title field',
         });
      }
      if (!('description' in doc.bc))
      {
         errors.schema.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'bc.description',
            message:  'Missing description field',
         });
      }
   }

   if (!doc.ak || 'object' !== typeof doc.ak)
   {
      errors.schema.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'ak',
         message:  'Missing or invalid nested Summary object',
      });
   }
   else
   {
      if (!('title' in doc.ak))
      {
         errors.schema.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'ak.title',
            message:  'Missing title field',
         });
      }
      if (!('description' in doc.ak))
      {
         errors.schema.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'ak.description',
            message:  'Missing description field',
         });
      }
   }

   if (!doc.fileKey)
   {
      errors.missingField.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'fileKey',
         message:  'Missing required field',
      });
   }

   if (!doc.documentAuthorId)
   {
      errors.missingField.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'documentAuthorId',
         message:  'Missing required field',
      });
   }

   if (!doc.documentContentOwnerUserId)
   {
      errors.missingField.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'documentContentOwnerUserId',
         message:  'Missing required field',
      });
   }

   if (!doc.documentBoxBoxId)
   {
      errors.missingField.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'documentBoxBoxId',
         message:  'Missing required field',
      });
   }

   if ('documentDetailsAuthorId' in doc)
   {
      errors.schema.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'documentDetailsAuthorId',
         message:  'Old field name not renamed',
      });
   }

   if ('documentDetailsDocOwnerId' in doc)
   {
      errors.schema.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'documentDetailsDocOwnerId',
         message:  'Old field name not renamed',
      });
   }

   if ('documentDetailsBoxId' in doc)
   {
      errors.schema.push({
         file:     'Document.json',
         recordId: doc.id,
         field:    'documentDetailsBoxId',
         message:  'Old field name not renamed',
      });
   }
}

export function validateBoxSchema(box, index, errors)
{
   if ('Box' !== box.__typename)
   {
      errors.schema.push({
         file:     'Box.json',
         recordId: box.id,
         field:    '__typename',
         message:  `Expected "Box", got "${box.__typename}"`
      });
   }

   if (!box.ownerUserId)
   {
      errors.missingField.push({
         file:     'Box.json',
         recordId: box.id,
         field:    'ownerUserId',
         message:  'Missing required field',
      });
   }

   if ('xbiisOwnerId' in box)
   {
      errors.schema.push({
         file:     'Box.json',
         recordId: box.id,
         field:    'xbiisOwnerId',
         message:  'Old field name not renamed',
      });
   }
}

export function validateCollectionSchema(collection, index, errors)
{
   if ('Collection' !== collection.__typename)
   {
      errors.schema.push({
         file:     'Collection.json',
         recordId: collection.id,
         field:    '__typename',
         message:  `Expected "Collection", got "${collection.__typename}"`
      });
   }

   if (!collection.eng || 'object' !== typeof collection.eng)
   {
      errors.schema.push({
         file:     'Collection.json',
         recordId: collection.id,
         field:    'eng',
         message:  'Missing or invalid nested Summary object',
      });
   }

   if (!collection.bc || 'object' !== typeof collection.bc)
   {
      errors.schema.push({
         file:     'Collection.json',
         recordId: collection.id,
         field:    'bc',
         message:  'Missing or invalid nested Summary object',
      });
   }

   if (!collection.ak || 'object' !== typeof collection.ak)
   {
      errors.schema.push({
         file:     'Collection.json',
         recordId: collection.id,
         field:    'ak',
         message:  'Missing or invalid nested Summary object',
      });
   }

   if (!collection.collectionContentOwnerUserId)
   {
      errors.missingField.push({
         file:     'Collection.json',
         recordId: collection.id,
         field:    'collectionContentOwnerUserId',
         message:  'Missing required field',
      });
   }

   if ('collectionCollectionOwnerId' in collection)
   {
      errors.schema.push({
         file:     'Collection.json',
         recordId: collection.id,
         field:    'collectionCollectionOwnerId',
         message:  'Old field name not renamed',
      });
   }
}

export function validateBoxUserSchema(boxUser, index, errors)
{
   if ('BoxUser' !== boxUser.__typename)
   {
      errors.schema.push({
         file:     'BoxUser.json',
         recordId: boxUser.id,
         field:    '__typename',
         message:  `Expected "BoxUser", got "${boxUser.__typename}"`
      });
   }

   if (!boxUser.userUserId)
   {
      errors.missingField.push({
         file:     'BoxUser.json',
         recordId: boxUser.id,
         field:    'userUserId',
         message:  'Missing required field',
      });
   }

   if (!boxUser.boxUserUserId)
   {
      errors.missingField.push({
         file:     'BoxUser.json',
         recordId: boxUser.id,
         field:    'boxUserUserId',
         message:  'Missing required field',
      });
   }

   if (!boxUser.boxUserBoxId)
   {
      errors.missingField.push({
         file:     'BoxUser.json',
         recordId: boxUser.id,
         field:    'boxUserBoxId',
         message:  'Missing required field',
      });
   }
}

export function validateCollectionItemSchema(item, index, errors)
{
   if ('CollectionItem' !== item.__typename)
   {
      errors.schema.push({
         file:     'CollectionItem.json',
         recordId: item.id,
         field:    '__typename',
         message:  `Expected "CollectionItem", got "${item.__typename}"`
      });
   }

   if (!item.collectionCollectionId)
   {
      errors.missingField.push({
         file:     'CollectionItem.json',
         recordId: item.id,
         field:    'collectionCollectionId',
         message:  'Missing required field',
      });
   }

   if ('collectionID' in item)
   {
      errors.schema.push({
         file:     'CollectionItem.json',
         recordId: item.id,
         field:    'collectionID',
         message:  'Old field name not renamed',
      });
   }

   if ('documentID' in item)
   {
      errors.schema.push({
         file:     'CollectionItem.json',
         recordId: item.id,
         field:    'documentID',
         message:  'Old field name not renamed',
      });
   }
}

export function validateForeignKeys(documents, authors, users, boxes, boxUsers, errors)
{
   const authorIds = new Set(authors.map(a => a.id));
   const userIds = new Set(users.map(u => u.id));
   const boxIds = new Set(boxes.map(b => b.id));

   documents.forEach(doc => {
      if (doc.documentAuthorId && !authorIds.has(doc.documentAuthorId))
      {
         errors.foreignKey.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'documentAuthorId',
            message:  `Orphaned reference: ${doc.documentAuthorId}`,
         });
      }

      if (doc.documentContentOwnerUserId
          && !userIds.has(doc.documentContentOwnerUserId))
      {
         errors.foreignKey.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'documentContentOwnerUserId',
            message:  `Orphaned reference: ${doc.documentContentOwnerUserId}`,
         });
      }

      if (doc.documentBoxBoxId && !boxIds.has(doc.documentBoxBoxId))
      {
         errors.foreignKey.push({
            file:     'Document.json',
            recordId: doc.id,
            field:    'documentBoxBoxId',
            message:  `Orphaned reference: ${doc.documentBoxBoxId}`,
         });
      }
   });

   boxUsers.forEach(bu => {
      if (bu.boxUserBoxId && !boxIds.has(bu.boxUserBoxId))
      {
         errors.foreignKey.push({
            file:     'BoxUser.json',
            recordId: bu.id,
            field:    'boxUserBoxId',
            message:  `Orphaned reference: ${bu.boxUserBoxId}`,
         });
      }
   });
}

export function validateCounts(gen1Count, transformedCount, filename)
{
   if (gen1Count !== transformedCount)
   {
      return {
         hasError: true,
         error:    {
            file:     filename,
            recordId: 'N/A',
            field:    'count',
            message:  `Count mismatch: Gen1=${gen1Count}, ` +
                      `Transformed=${transformedCount}`,
         }
      };
   }

   return { hasError: false };
}

function loadData(dir, filename)
{
   const filePath = path.join(dir, filename);
   if (!fs.existsSync(filePath))
   { return []; }
   return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function reportErrors(errors)
{
   const totalErrors = errors.schema.length + errors.foreignKey.length + errors.missingField.length;

   if (0 === totalErrors)
   {
      console.log('\n✅ VALIDATION PASSED - All transformations valid');
      return false;
   }

   console.log('\n❌ VALIDATION FAILED\n');

   if (errors.schema.length > 0)
   {
      console.log('Schema Errors:');
      errors.schema.forEach(err => {
         console.log(`  ${err.file} [${err.recordId}] ${err.field}: ${err.message}`);
      });
      console.log('');
   }

   if (errors.foreignKey.length > 0)
   {
      console.log('Foreign Key Errors:');
      errors.foreignKey.forEach(err => {
         console.log(`  ${err.file} [${err.recordId}] ${err.field}: ${err.message}`);
      });
      console.log('');
   }

   if (errors.missingField.length > 0)
   {
      console.log('Missing Field Errors:');
      errors.missingField.forEach(err => {
         console.log(`  ${err.file} [${err.recordId}] ${err.field}: ${err.message}`);
      });
      console.log('');
   }

   console.log(`Total Errors: ${totalErrors}`);
   return true;
}

function main()
{
   const ENV = process.argv[2] || 'dev';

   if (!['dev', 'prod'].includes(ENV))
   {
      console.error('Usage: node validate-transformation.js [dev|prod]');
      process.exit(1);
   }

   const EXPORT_DIR = path.join(__dirname, 'exports', ENV);
   const TRANSFORMED_DIR = path.join(__dirname, 'transformed', ENV);

   console.log(`Validating transformations for ${ENV.toUpperCase()}...\n`);

   if (!fs.existsSync(EXPORT_DIR))
   {
      console.error(`ERROR: Export directory not found: ${EXPORT_DIR}`);
      process.exit(1);
   }

   if (!fs.existsSync(TRANSFORMED_DIR))
   {
      console.error(`ERROR: Transformed directory not found: ${TRANSFORMED_DIR}`);
      process.exit(1);
   }

   const errors = { schema: [], foreignKey: [], missingField: [] };

   console.log('Validating counts...');
   const gen1Docs = loadData(EXPORT_DIR, 'DocumentDetails.json');
   const gen1Boxes = loadData(EXPORT_DIR, 'Xbiis.json');
   const gen1Collections = loadData(EXPORT_DIR, 'Collection.json');
   const gen1BoxUsers = loadData(EXPORT_DIR, 'BoxUser.json');
   const gen1CollectionItems = loadData(EXPORT_DIR, 'CollectionItem.json');

   const documents = loadData(TRANSFORMED_DIR, 'Document.json');
   const boxes = loadData(TRANSFORMED_DIR, 'Box.json');
   const collections = loadData(TRANSFORMED_DIR, 'Collection.json');
   const boxUsers = loadData(TRANSFORMED_DIR, 'BoxUser.json');
   const collectionItems = loadData(TRANSFORMED_DIR, 'CollectionItem.json');
   const authors = loadData(TRANSFORMED_DIR, 'Author.json');
   const users = loadData(TRANSFORMED_DIR, 'User.json');

   const docCountResult = validateCounts(gen1Docs.length, documents.length, 'Document.json');
   const boxCountResult = validateCounts(gen1Boxes.length, boxes.length, 'Box.json');
   const collCountResult = validateCounts(gen1Collections.length, collections.length, 'Collection.json');
   const buCountResult = validateCounts(gen1BoxUsers.length, boxUsers.length, 'BoxUser.json');
   const ciCountResult = validateCounts(gen1CollectionItems.length, collectionItems.length, 'CollectionItem.json');

   if (docCountResult.hasError) { errors.schema.push(docCountResult.error); }
   if (boxCountResult.hasError) { errors.schema.push(boxCountResult.error); }
   if (collCountResult.hasError) { errors.schema.push(collCountResult.error); }
   if (buCountResult.hasError) { errors.schema.push(buCountResult.error); }
   if (ciCountResult.hasError) { errors.schema.push(ciCountResult.error); }

   console.log(`  Documents: ${gen1Docs.length} → ${documents.length}`);
   console.log(`  Boxes: ${gen1Boxes.length} → ${boxes.length}`);
   console.log(`  Collections: ${gen1Collections.length} → ${collections.length}`);
   console.log(`  BoxUsers: ${gen1BoxUsers.length} → ${boxUsers.length}`);
   console.log(`  CollectionItems: ${gen1CollectionItems.length} → ${collectionItems.length}`);

   console.log('\nValidating schemas...');
   documents.forEach((doc, i) => validateDocumentSchema(doc, i, errors));
   boxes.forEach((box, i) => validateBoxSchema(box, i, errors));
   collections.forEach((coll, i) => validateCollectionSchema(coll, i, errors));
   boxUsers.forEach((bu, i) => validateBoxUserSchema(bu, i, errors));
   collectionItems.forEach((ci, i) => validateCollectionItemSchema(ci, i, errors));

   console.log('\nValidating foreign keys...');
   validateForeignKeys(documents, authors, users, boxes, boxUsers, errors);

   const hasErrors = reportErrors(errors);

   if (hasErrors) { process.exit(1); }
   else { process.exit(0); }
}

if (import.meta.url === `file://${process.argv[1]}`) { main(); }
