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

const ENV = process.argv[2] || 'dev';

if (!['sbx', 'dev', 'prod'].includes(ENV))
{
   console.error('Usage: node validate-migration.js [sbx|dev|prod]');
   process.exit(1);
}

const config = GEN2_CONFIG[ENV];
const REGION = config.region;
const TABLE_PREFIX = config.tablePrefix;

if ('UPDATE_AFTER_GEN2_DEPLOY' === TABLE_PREFIX)
{
   console.error('ERROR: Update tablePrefix in config.js before running');
   process.exit(1);
}

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

const SOURCE_ENV = config.gen1Source || ENV;
const EXPORT_DIR = path.join(__dirname, 'exports', SOURCE_ENV);
const TRANSFORMED_DIR = path.join(__dirname, 'transformed', SOURCE_ENV);

const TABLES = TABLE_MAPPINGS;

async function getGen2Count(tableName)
{
   const fullTableName = `${tableName}-${TABLE_PREFIX}-${ENV === 'sbx' ? 'NONE' : ENV}`;
   
   try
   {
      const params = {
         TableName: fullTableName,
         Select: 'COUNT'
      };
      
      let count = 0;
      let lastEvaluatedKey = undefined;
      
      do
      {
         const result = await docClient.send(new ScanCommand({
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

function getGen1Count(tableName)
{
   const exportFile = path.join(EXPORT_DIR, `${tableName}.json`);
   
   if (!fs.existsSync(exportFile))
   { return 0; }
   
   const items = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
   return items.length;
}

function getTransformedCount(tableName)
{
   const transformedFile = path.join(TRANSFORMED_DIR, `${tableName}.json`);
   
   if (!fs.existsSync(transformedFile))
   { return 0; }
   
   const items = JSON.parse(fs.readFileSync(transformedFile, 'utf8'));
   return items.length;
}

async function validateTable(table)
{
   console.log(`\\nValidating ${table.gen2}...`);
   
   const gen1Count = getGen1Count(table.gen1);
   const transformedCount = getTransformedCount(table.gen2);
   const gen2Count = await getGen2Count(table.gen2);
   
   console.log(`  Gen1 Export:    ${gen1Count} items`);
   console.log(`  Transformed:    ${transformedCount} items`);
   console.log(`  Gen2 Imported:  ${gen2Count} items`);
   
   const exportMatch = gen1Count === transformedCount;
   const importMatch = transformedCount === gen2Count;
   
   if (exportMatch && importMatch)
   {
      console.log(`  ✅ PASS - All counts match`);
      return true;
   }
   else
   {
      if (!exportMatch)
      { console.log(`  ❌ FAIL - Export/Transform mismatch`); }
      if (!importMatch)
      { console.log(`  ❌ FAIL - Transform/Import mismatch`); }
      return false;
   }
}

async function main()
{
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
      const passed = await validateTable(table);
      if (!passed)
      { allPassed = false; }
   }
   
   console.log(`\\n${'='.repeat(50)}`);
   if (allPassed)
   {
      console.log('✅ VALIDATION PASSED - All tables migrated successfully');
   }
   else
   {
      console.log('❌ VALIDATION FAILED - Some tables have mismatches');
      process.exit(1);
   }
}

main().catch(console.error);
