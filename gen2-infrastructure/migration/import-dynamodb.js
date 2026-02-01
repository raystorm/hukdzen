#!/usr/bin/env node

/**
 * Import DynamoDB Tables Script
 * 
 * Imports JSON files into Gen2 DynamoDB tables
 * Run AFTER Gen2 deployment and export-dynamodb.js
 * 
 * NOTE: Update GEN2_TABLE_PREFIX after deploying Gen2
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');
const path = require('path');

const ENV = process.argv[2] || 'dev';

if (!['dev', 'prod'].includes(ENV))
{
   console.error('Usage: node import-dynamodb.js [dev|prod]');
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
   'DocumentDetails',
   'Xbiis',
   'BoxUser',
   'Collection',
   'CollectionItem'
];

const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

const INPUT_DIR = path.join(__dirname, 'exports', ENV);

async function importTable(tableName)
{
   const fullTableName = `${tableName}-${TABLE_PREFIX}-${ENV}`;
   const inputFile = path.join(INPUT_DIR, `${tableName}.json`);
   
   if (!fs.existsSync(inputFile))
   {
      console.log(`  Skipping ${tableName} - no export file found`);
      return 0;
   }
   
   console.log(`Importing ${fullTableName}...`);
   
   const items = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
   
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
      
      if (0 === imported % 10)
      { console.log(`  Imported ${imported}/${items.length} items...`); }
   }
   
   console.log(`  Imported ${imported} items to ${fullTableName}`);
   return imported;
}

async function main()
{
   console.log(`Importing DynamoDB tables for ${ENV.toUpperCase()}...\n`);
   console.log(`Region: ${REGION}`);
   console.log(`Table Prefix: ${TABLE_PREFIX}\n`);
   
   if (!fs.existsSync(INPUT_DIR))
   {
      console.error(`ERROR: Export directory not found: ${INPUT_DIR}`);
      console.error('Run export-dynamodb.js first');
      process.exit(1);
   }
   
   let totalItems = 0;
   
   for (const table of TABLES)
   {
      const count = await importTable(table);
      totalItems += count;
   }
   
   console.log(`\nImport complete! Total items: ${totalItems}`);
}

main().catch(console.error);
