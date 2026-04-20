#!/usr/bin/env node

/**
 * Validate Migration Script
 * 
 * Validates that Gen2 data matches Gen1 exported data
 * Run AFTER import-dynamodb.js
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');
const path = require('path');

const ENV = process.argv[2] || 'dev';

if (!['dev', 'prod'].includes(ENV))
{
   console.error('Usage: node validate-migration.js [dev|prod]');
   process.exit(1);
}

const CONFIG = {
   dev: {
      region: 'us-east-1',
      tablePrefix: 'UPDATE_AFTER_GEN2_DEPLOY' // TODO: Update after Gen2 deployment
   },
   prod: {
      region: 'us-west-2',
      tablePrefix: 'UPDATE_AFTER_GEN2_DEPLOY' // TODO: Update after Gen2 deployment
   }
};

const REGION = CONFIG[ENV].region;
const TABLE_PREFIX = CONFIG[ENV].tablePrefix;

if ('UPDATE_AFTER_GEN2_DEPLOY' === TABLE_PREFIX)
{
   console.error('ERROR: Update TABLE_PREFIX in script before running');
   process.exit(1);
}

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

const EXPORT_DIR = path.join(__dirname, 'exports', ENV);
const TRANSFORMED_DIR = path.join(__dirname, 'transformed', ENV);

const TABLES = [
   { gen1: 'User', gen2: 'User' },
   { gen1: 'Author', gen2: 'Author' },
   { gen1: 'DocumentDetails', gen2: 'Document' },
   { gen1: 'Xbiis', gen2: 'Box' },
   { gen1: 'BoxUser', gen2: 'BoxUser' },
   { gen1: 'Collection', gen2: 'Collection' },
   { gen1: 'CollectionItem', gen2: 'CollectionItem' }
];

async function getGen2Count(tableName)
{
   const fullTableName = `${tableName}-${TABLE_PREFIX}-${ENV}`;
   
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
