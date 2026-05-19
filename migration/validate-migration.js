#!/usr/bin/env node

/**
 * Validate Migration Script
 * 
 * Validates that Gen2 data matches Gen1 exported data
 * Run AFTER import-dynamodb.js
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { GEN2_CONFIG, TABLE_MAPPINGS } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Module-level variables (will be initialized in main() when run as CLI)
let ENV, REGION, TABLE_PREFIX, EXPORT_DIR, TRANSFORMED_DIR, TABLES, docClient;

export function sampleItems(items, count)
{
   if (0 >= items.length) { return []; }
   const sampleSize = Math.min(count, items.length);
   const sampled = [];
   const indices = new Set();
   
   while (sampled.length < sampleSize)
   {
      const idx = Math.floor(Math.random() * items.length);
      if (!indices.has(idx))
      {
         indices.add(idx);
         sampled.push(items[idx]);
      }
   }
   
   return sampled;
}

export function validateSchema(item, tableName)
{
   const errors = [];
   
   // Check __typename
   if (!item.__typename)
   { errors.push({ itemId: item.id, field: '__typename', expected: 'present', actual: 'missing' }); }
   else if (item.__typename !== tableName)
   { errors.push({ itemId: item.id, field: '__typename', expected: tableName, actual: item.__typename }); }
   
   if ('Document' === tableName)
   {
      // Check required top-level fields
      const required = ['id', 'eng', 'bc', 'ak', 'fileKey', 'version', 'documentAuthorId', 'documentContentOwnerUserId', 'documentBoxBoxId'];
      required.forEach(field => {
         if (!item.hasOwnProperty(field))
         { errors.push({ itemId: item.id, field, expected: 'present', actual: 'missing' }); }
      });
      
      // Check nested Summary objects structure
      ['eng', 'bc', 'ak'].forEach(lang => {
         if (item[lang])
         {
            if (!item[lang].hasOwnProperty('title'))
            { errors.push({ itemId: item.id, field: `${lang}.title`, expected: 'present', actual: 'missing' }); }
            if (!item[lang].hasOwnProperty('description'))
            { errors.push({ itemId: item.id, field: `${lang}.description`, expected: 'present', actual: 'missing' }); }
         }
      });
      
      // Check Gen1 fields are absent
      const gen1Fields = ['eng_title', 'eng_description', 'bc_title', 'bc_description', 'ak_title', 'ak_description', 'documentDetailsAuthorId', 'documentDetailsDocOwnerId', 'documentDetailsBoxId'];
      gen1Fields.forEach(field => {
         if (item.hasOwnProperty(field))
         { errors.push({ itemId: item.id, field, expected: 'absent', actual: 'present (Gen1 field leaked)' }); }
      });
   }
   
   if ('Collection' === tableName)
   {
      // Check nested Summary objects structure
      ['eng', 'bc', 'ak'].forEach(lang => {
         if (!item[lang])
         { errors.push({ itemId: item.id, field: lang, expected: 'present', actual: 'missing' }); }
         else
         {
            if (!item[lang].hasOwnProperty('title'))
            { errors.push({ itemId: item.id, field: `${lang}.title`, expected: 'present', actual: 'missing' }); }
            if (!item[lang].hasOwnProperty('description'))
            { errors.push({ itemId: item.id, field: `${lang}.description`, expected: 'present', actual: 'missing' }); }
         }
      });
   }
   
   if ('Box' === tableName)
   {
      // Check required fields
      if (!item.ownerUserId)
      { errors.push({ itemId: item.id, field: 'ownerUserId', expected: 'present', actual: 'missing' }); }
      
      // Check Gen1 fields are absent
      if (item.hasOwnProperty('xbiisOwnerId'))
      { errors.push({ itemId: item.id, field: 'xbiisOwnerId', expected: 'absent', actual: 'present (Gen1 field leaked)' }); }
   }
   
   return { valid: 0 === errors.length, errors };
}

export function validateDataIntegrity(gen1Item, transformedItem, gen2Item, tableName)
{
   const errors = [];
   
   if ('Document' === tableName)
   {
      if (gen1Item.eng_title !== transformedItem.eng?.title)
      { errors.push({ field: 'eng.title', expected: gen1Item.eng_title, actual: transformedItem.eng?.title }); }
      if (gen1Item.fileKey !== transformedItem.fileKey)
      { errors.push({ field: 'fileKey', expected: gen1Item.fileKey, actual: transformedItem.fileKey }); }
      if (gen1Item.documentDetailsAuthorId !== transformedItem.documentAuthorId)
      { errors.push({ field: 'documentAuthorId', expected: gen1Item.documentDetailsAuthorId, actual: transformedItem.documentAuthorId }); }
      
      if (transformedItem.eng?.title !== gen2Item.eng?.title)
      { errors.push({ field: 'eng.title (Gen2)', expected: transformedItem.eng?.title, actual: gen2Item.eng?.title }); }
   }
   
   if ('Box' === tableName)
   {
      if (gen1Item.name !== transformedItem.name)
      { errors.push({ field: 'name', expected: gen1Item.name, actual: transformedItem.name }); }
      if (gen1Item.xbiisOwnerId !== transformedItem.ownerUserId)
      { errors.push({ field: 'ownerUserId', expected: gen1Item.xbiisOwnerId, actual: transformedItem.ownerUserId }); }
      
      if (transformedItem.name !== gen2Item.name)
      { errors.push({ field: 'name (Gen2)', expected: transformedItem.name, actual: gen2Item.name }); }
   }
   
   if ('User' === tableName)
   {
      if (gen1Item.name !== transformedItem.name)
      { errors.push({ field: 'name', expected: gen1Item.name, actual: transformedItem.name }); }
      if (gen1Item.email !== transformedItem.email)
      { errors.push({ field: 'email', expected: gen1Item.email, actual: transformedItem.email }); }
   }
   
   return { valid: 0 === errors.length, errors };
}

export async function getGen2Count(tableName, client, env, tablePrefix)
{
   const fullTableName = `${tableName}-${tablePrefix}-${env === 'sbx' ? 'NONE' : env}`;
   
   try
   {
      const params = { TableName: fullTableName, Select: 'COUNT' };
      
      let count = 0;
      let lastEvaluatedKey = undefined;
      
      do
      {
         const result = await client.send(new ScanCommand({
            ...params,
            ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
         }));
         
         count += result.Count;
         lastEvaluatedKey = result.LastEvaluatedKey;
      }
      while (lastEvaluatedKey);
      
      return count;
   }
   catch (error)
   {
      console.error(`  Error scanning ${fullTableName}: ${error.message}`);
      return -1;
   }
}

export function getGen1Count(tableName, exportDir)
{
   const exportFile = path.join(exportDir, `${tableName}.json`);
   
   if (!fs.existsSync(exportFile)) { return 0; }
   
   const items = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
   return items.length;
}

export function getTransformedCount(tableName, transformedDir)
{
   const transformedFile = path.join(transformedDir, `${tableName}.json`);
   
   if (!fs.existsSync(transformedFile)) { return 0; }
   
   const items = JSON.parse(fs.readFileSync(transformedFile, 'utf8'));
   return items.length;
}

export async function validateTable(table, config)
{
   const { exportDir, transformedDir, client, env, tablePrefix } = config;
   
   console.log(`\\nValidating ${table.gen2}...`);
   
   const gen1Count        = getGen1Count(table.gen1, exportDir);
   const transformedCount = getTransformedCount(table.gen2, transformedDir);
   const gen2Count        = await getGen2Count(table.gen2, client, env, tablePrefix);
   
   console.log(`  Gen1 Export:    ${gen1Count} items`);
   console.log(`  Transformed:    ${transformedCount} items`);
   console.log(`  Gen2 Imported:  ${gen2Count} items`);
   
   const exportMatch = gen1Count === transformedCount;
   const importMatch = transformedCount <= gen2Count;
   
   if (exportMatch && importMatch)
   { console.log(`  ✅ PASS - All counts valid (Gen2 may have pre-existing data)`); }
   else
   {
      if (!exportMatch) { console.log(`  ❌ FAIL - Export/Transform mismatch`); }
      if (!importMatch) { console.log(`  ❌ FAIL - Transform/Import mismatch (Gen2 has fewer items than transformed)`); }
      return false;
   }
   
   const transformedFile = path.join(transformedDir, `${table.gen2}.json`);
   if (!fs.existsSync(transformedFile)) { return exportMatch && importMatch; }
   
   const transformedItems = JSON.parse(fs.readFileSync(transformedFile, 'utf8'));
   const allErrors = [];
   
   transformedItems.forEach(item => {
      const schemaResult = validateSchema(item, table.gen2);
      if (!schemaResult.valid)
      {
         schemaResult.errors.forEach(err => {
            allErrors.push({ table: table.gen2, ...err });
         });
      }
   });
   
   const sampleCount = 'Document' === table.gen2 ? 5 : 3;
   const sampledTransformed = sampleItems(transformedItems, sampleCount);
   
   const gen1File = path.join(exportDir, `${table.gen1}.json`);
   if (fs.existsSync(gen1File) && 0 < sampledTransformed.length)
   {
      const gen1Items = JSON.parse(fs.readFileSync(gen1File, 'utf8'));
      const gen1Map = Object.fromEntries(gen1Items.map(item => [item.id, item]));
      
      sampledTransformed.forEach(transformedItem => {
         const gen1Item = gen1Map[transformedItem.id];
         if (gen1Item)
         {
            const integrityResult = validateDataIntegrity(gen1Item, transformedItem, transformedItem, table.gen2);
            if (!integrityResult.valid)
            {
               integrityResult.errors.forEach(err => {
                  allErrors.push({ table: table.gen2, itemId: transformedItem.id, ...err });
               });
            }
         }
      });
   }
   
   if (0 < allErrors.length)
   {
      console.log(`  ❌ FAIL - Validation errors found:`);
      allErrors.slice(0, 5).forEach(err => {
         console.log(`    Item ${err.itemId}: ${err.field} - ${err.message || `Expected: ${err.expected}, Actual: ${err.actual}`}`);
      });
      if (5 < allErrors.length)
      { console.log(`    ... and ${allErrors.length - 5} more errors`); }
      return false;
   }
   
   console.log(`  ✅ PASS - All validations passed`);
   return true;
}

async function main()
{
   ENV = process.argv[2] || 'dev';
   
   if (!['sbx', 'dev', 'prod'].includes(ENV))
   {
      console.error('Usage: node validate-migration.js [sbx|dev|prod]');
      process.exit(1);
   }
   
   const config = GEN2_CONFIG[ENV];
   REGION = config.region;
   TABLE_PREFIX = config.tablePrefix;
   
   if ('UPDATE_AFTER_GEN2_DEPLOY' === TABLE_PREFIX)
   {
      console.error('ERROR: Update tablePrefix in config.js before running');
      process.exit(1);
   }
   
   const client = new DynamoDBClient({ region: REGION });
   docClient = DynamoDBDocumentClient.from(client);
   
   const SOURCE_ENV = config.gen1Source || ENV;
   EXPORT_DIR = path.join(__dirname, 'exports', SOURCE_ENV);
   TRANSFORMED_DIR = path.join(__dirname, 'transformed', SOURCE_ENV);
   
   TABLES = TABLE_MAPPINGS;
   
   console.log(`Validating migration for ${ENV.toUpperCase()}...`);
   console.log(`Region: ${REGION}`);
   console.log(`Table Prefix: ${TABLE_PREFIX}`);
   
   if (!fs.existsSync(EXPORT_DIR))
   {
      console.error(`\\nERROR: Export directory not found: ${EXPORT_DIR}`);
      process.exit(1);
   }
   
   if (!fs.existsSync(TRANSFORMED_DIR))
   {
      console.error(`\\nERROR: Transformed directory not found: ${TRANSFORMED_DIR}`);
      process.exit(1);
   }
   
   let allPassed = true;
   
   for (const table of TABLES)
   {
      const passed = await validateTable(table, {
         exportDir: EXPORT_DIR,
         transformedDir: TRANSFORMED_DIR,
         client: docClient,
         env: ENV,
         tablePrefix: TABLE_PREFIX
      });
      if (!passed) { allPassed = false; }
   }
   
   console.log(`\\n${'='.repeat(50)}`);
   if (allPassed)
   { console.log('✅ VALIDATION PASSED - All tables migrated successfully'); }
   else
   {
      console.log('❌ VALIDATION FAILED - Some tables have mismatches');
      process.exit(1);
   }
}

// Only run main() if this file is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`)
{ main().catch(console.error); }
