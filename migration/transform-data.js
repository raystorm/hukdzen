#!/usr/bin/env node

/**
 * Transform Data Script
 * 
 * Transforms Gen1 exported data to Gen2 schema format
 * Run AFTER export-dynamodb.js and BEFORE import-dynamodb.js
 * 
 * Key transformations:
 * - DocumentDetails → Document (with nested Summary objects)
 * - Xbiis → Box
 * - Foreign key field renames
 * - Preserve createdAt/updatedAt (required by AppSync @model non-nullable fields)
 */

import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.argv[2] || 'dev';

if (!['dev', 'prod'].includes(ENV))
{
   console.error('Usage: node transform-data.js [dev|prod]');
   process.exit(1);
}

const INPUT_DIR = path.join(__dirname, 'exports', ENV);
const OUTPUT_DIR = path.join(__dirname, 'transformed', ENV);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR))
{ fs.mkdirSync(OUTPUT_DIR, { recursive: true }); }

/**
 * Transform DocumentDetails to Document
 */
function transformDocument(item)
{
   return {
      __typename: 'Document',
      id: item.id,
      eng: {
         title: item.eng_title || '',
         description: item.eng_description || ''
      },
      bc: {
         title: item.bc_title || '',
         description: item.bc_description || ''
      },
      ak: {
         title: item.ak_title || '',
         description: item.ak_description || ''
      },
      fileKey: item.fileKey,
      fileHash: item.fileHash || null,
      created: item.created,
      updated: item.updated || null,
      type: item.type || null,
      version: item.version,
      keywords: item.keywords || [],
      documentAuthorId: item.documentDetailsAuthorId,
      documentContentOwnerUserId: item.documentDetailsDocOwnerId,
      documentBoxBoxId: item.documentDetailsBoxId,
      createdAt: item.createdAt || item.created || '1970-01-01T00:00:00.000Z',
      updatedAt: item.updatedAt || item.updated || '1970-01-01T00:00:00.000Z'
   };
}

/**
 * Transform Xbiis to Box
 */
function transformBox(item)
{
   return {
      __typename: 'Box',
      id: item.id,
      name: item.name,
      waa: item.waa || null,
      defaultRole: item.defaultRole || 'NONE',
      purpose: item.purpose || 'GROUP',
      ownerUserId: item.xbiisOwnerId,
      createdAt: item.createdAt || item.created || '1970-01-01T00:00:00.000Z',
      updatedAt: item.updatedAt || item.updated || '1970-01-01T00:00:00.000Z'
   };
}

/**
 * Transform Collection
 */
function transformCollection(item)
{
   return {
      __typename: 'Collection',
      id: item.id,
      eng: {
         title: item.eng_title || '',
         description: item.eng_description || ''
      },
      bc: {
         title: item.bc_title || '',
         description: item.bc_description || ''
      },
      ak: {
         title: item.ak_title || '',
         description: item.ak_description || ''
      },
      created: item.created,
      updated: item.updated || null,
      collectionContentOwnerUserId: item.collectionCollectionOwnerId,
      collectionBoxId: item.collectionBoxId,
      createdAt: item.createdAt || item.created || '1970-01-01T00:00:00.000Z',
      updatedAt: item.updatedAt || item.updated || '1970-01-01T00:00:00.000Z'
   };
}

/**
 * Transform BoxUser
 */
function transformBoxUser(item)
{
   return {
      __typename: 'BoxUser',
      id: item.id,
      role: item.role,
      userUserId: item.boxUserUserId,
      boxUserUserId: item.boxUserUserId,
      boxUserBoxId: item.boxUserBoxId,
      createdAt: item.createdAt || item.created || '1970-01-01T00:00:00.000Z',
      updatedAt: item.updatedAt || item.updated || '1970-01-01T00:00:00.000Z'
   };
}

/**
 * Transform BoxRequest
 */
function transformBoxRequest(item)
{
   return {
      __typename: 'BoxRequest',
      id: item.id,
      requestedName: item.requestedName,
      requestReason: item.requestReason,
      status: item.status,
      denialReason: item.denialReason || null,
      boxRequestCreatedByUserId: item.boxRequestCreatedById,
      boxRequestApprovedByUserId: item.boxRequestApprovedById || null,
      boxRequestCreatedBoxId: item.boxRequestCreatedBoxId || null,
      createdAt: item.createdAt || item.created || '1970-01-01T00:00:00.000Z',
      updatedAt: item.updatedAt || item.updated || '1970-01-01T00:00:00.000Z'
   };
}

/**
 * Transform User (minimal changes)
 */
function transformUser(item)
{
   return {
      __typename: 'User',
      id: item.id,
      name: item.name,
      clan: item.clan || null,
      waa: item.waa || null,
      email: item.email,
      isAdmin: item.isAdmin || false,
      emailPreferences: item.emailPreferences || null,
      createdAt: item.createdAt || item.created || '1970-01-01T00:00:00.000Z',
      updatedAt: item.updatedAt || item.updated || '1970-01-01T00:00:00.000Z'
   };
}

/**
 * Transform Author (minimal changes)
 */
function transformAuthor(item)
{
   return {
      __typename: 'Author',
      id: item.id,
      name: item.name,
      clan: item.clan || null,
      waa: item.waa || null,
      email: item.email || null,
      createdAt: item.createdAt || item.created || '1970-01-01T00:00:00.000Z',
      updatedAt: item.updatedAt || item.updated || '1970-01-01T00:00:00.000Z'
   };
}

/**
 * Transform CollectionItem (minimal changes)
 */
function transformCollectionItem(item)
{
   return {
      __typename: 'CollectionItem',
      id: item.id,
      collectionCollectionId: item.collectionID,
      collectionItemDocumentId: item.documentID || null,
      collectionItemChildCollectionId: item.childCollectionID || null,
      order: item.order || 0,
      created: item.created,
      createdAt: item.createdAt || item.created || '1970-01-01T00:00:00.000Z',
      updatedAt: item.updatedAt || item.updated || '1970-01-01T00:00:00.000Z'
   };
}

const TRANSFORMERS = {
   'DocumentDetails': { transformer: transformDocument, outputName: 'Document' },
   'Xbiis': { transformer: transformBox, outputName: 'Box' },
   'Collection': { transformer: transformCollection, outputName: 'Collection' },
   'BoxUser': { transformer: transformBoxUser, outputName: 'BoxUser' },
   'BoxRequest': { transformer: transformBoxRequest, outputName: 'BoxRequest' },
   'User': { transformer: transformUser, outputName: 'User' },
   'Author': { transformer: transformAuthor, outputName: 'Author' },
   'CollectionItem': { transformer: transformCollectionItem, outputName: 'CollectionItem' }
};

function transformTable(tableName)
{
   const inputFile = path.join(INPUT_DIR, `${tableName}.json`);
   
   if (!fs.existsSync(inputFile))
   {
      console.log(`  Skipping ${tableName} - no export file found`);
      return 0;
   }
   
   const config = TRANSFORMERS[tableName];
   if (!config)
   {
      console.log(`  Skipping ${tableName} - no transformer defined`);
      return 0;
   }
   
   console.log(`Transforming ${tableName} → ${config.outputName}...`);
   
   const items = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
   const transformed = items.map(config.transformer);
   
   const outputFile = path.join(OUTPUT_DIR, `${config.outputName}.json`);
   fs.writeFileSync(outputFile, JSON.stringify(transformed, null, 2));
   
   console.log(`  Transformed ${transformed.length} items to ${outputFile}`);
   return transformed.length;
}

function main()
{
   console.log(`Transforming data for ${ENV.toUpperCase()}...\\n`);
   
   if (!fs.existsSync(INPUT_DIR))
   {
      console.error(`ERROR: Export directory not found: ${INPUT_DIR}`);
      console.error('Run export-dynamodb.js first');
      process.exit(1);
   }
   
   let totalItems = 0;
   
   for (const tableName of Object.keys(TRANSFORMERS))
   {
      const count = transformTable(tableName);
      totalItems += count;
   }
   
   console.log(`\\nTransformation complete! Total items: ${totalItems}`);
   console.log(`Files saved to: ${OUTPUT_DIR}`);
   console.log(`\\nNext step: Update import-dynamodb.js to use transformed data`);
}

main();
