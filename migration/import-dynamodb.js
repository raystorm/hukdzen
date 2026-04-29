#!/usr/bin/env node

/**
 * Import DynamoDB Tables Script
 * 
 * Imports JSON files into Gen2 DynamoDB tables
 * Run AFTER Gen2 deployment and export-dynamodb.js
 * 
 * NOTE: Update GEN2_TABLE_PREFIX after deploying Gen2
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.argv[2] || 'dev';
const DRY_RUN = process.argv.includes('--dry-run');

if (!['dev', 'prod'].includes(ENV))
{
   console.error('Usage: node import-dynamodb.js [dev|prod] [--dry-run]');
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
   console.error('ERROR: Update GEN2_TABLE_PREFIX in script before running');
   console.error('Deploy Gen2, then find table prefix from AWS Console');
   process.exit(1);
}

const TABLES = [
   'User',
   'Author',
   'Document',
   'Box',
   'BoxUser',
   'BoxRequest',
   'Collection',
   'CollectionItem'
];

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

const INPUT_DIR = path.join(__dirname, 'transformed', ENV);

async function importTable(tableName)
{
   const fullTableName = `${tableName}-${TABLE_PREFIX}-${ENV}`;
   const inputFile = path.join(INPUT_DIR, `${tableName}.json`);
   
   if (!fs.existsSync(inputFile))
   {
      const msg = DRY_RUN ? 'Would skip' : 'Skipping';
      console.log(`  ${msg} ${tableName} - no transformed file found`);
      return 0;
   }
   
   if (DRY_RUN) { console.log(`Would import to ${fullTableName}...`); }
   else { console.log(`Importing ${fullTableName}...`); }
   
   const items = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
   
   if (DRY_RUN) { console.log(`  Would import ${items.length} items`); }
   else
   {
      // Batch write in chunks of 25 (DynamoDB limit)
      const BATCH_SIZE = 25;
      let imported = 0;
      
      for (let i = 0; i < items.length; i += BATCH_SIZE)
      {
         const batch = items.slice(i, i + BATCH_SIZE);
         
         const params = {
            RequestItems: {
               [fullTableName]: batch.map(item => ({ PutRequest: { Item: item } }))
            }
         };
         
         await docClient.send(new BatchWriteCommand(params));
         imported += batch.length;
         
         if (0 === imported % 100) { console.log(`  Imported ${imported}/${items.length} items...`); }
      }
      
      console.log(`  Imported ${items.length} items`);
   }
   
   return items.length;
}

async function main()
{
   if (DRY_RUN)
   {
      console.log('=== DRY RUN MODE ===');
      console.log('No data will be written to DynamoDB\n');
   }
   
   console.log(`Importing DynamoDB tables for ${ENV.toUpperCase()}...\n`);
   console.log(`Region: ${REGION}`);
   console.log(`Table Prefix: ${TABLE_PREFIX}\n`);
   
   if (!fs.existsSync(INPUT_DIR))
   {
      console.error(`ERROR: Export directory not found: ${INPUT_DIR}`);
      console.error('Run transform-data.js first');
      process.exit(1);
   }
   
   let totalItems = 0;
   
   for (const table of TABLES)
   {
      const count = await importTable(table);
      totalItems += count;
   }
   
   if (DRY_RUN)
   {
      console.log('\n=== DRY RUN COMPLETE ===');
      console.log('No data written to DynamoDB');
      console.log(`Would have imported ${totalItems} items total`);
   }
   else { console.log(`\nImport complete! Total items: ${totalItems}`); }
}

main().catch(console.error);
