#!/usr/bin/env node

/**
 * Export DynamoDB Tables Script
 * 
 * Exports all DynamoDB tables from Gen1 to JSON files
 * Run AFTER pre-migration-cleanup.js
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');
const path = require('path');

const ENV = process.argv[2] || 'dev';

if (!['dev', 'prod'].includes(ENV))
{
   console.error('Usage: node export-dynamodb.js [dev|prod]');
   process.exit(1);
}

const CONFIG = {
   dev: {
      region: 'us-west-2',
      tablePrefix: 'vziz2d2xgbbx7ec2s44ncx73p4'
   },
   prod: {
      region: 'us-west-2',
      tablePrefix: 'p56j3ha5kjhmjn66c4m4eevl4a'
   }
};

const REGION = CONFIG[ENV].region;
const TABLE_PREFIX = CONFIG[ENV].tablePrefix;

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

const OUTPUT_DIR = path.join(__dirname, 'exports', ENV);

async function exportTable(tableName)
{
   const fullTableName = `${tableName}-${TABLE_PREFIX}-${ENV}`;
   console.log(`Exporting ${fullTableName}...`);
   
   const items = [];
   let lastEvaluatedKey = undefined;
   
   do
   {
      const params = {
         TableName: fullTableName,
         ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
      };
      
      const result = await docClient.send(new ScanCommand(params));
      items.push(...result.Items);
      lastEvaluatedKey = result.LastEvaluatedKey;
   }
   while (lastEvaluatedKey);
   
   const outputFile = path.join(OUTPUT_DIR, `${tableName}.json`);
   fs.writeFileSync(outputFile, JSON.stringify(items, null, 2));
   
   console.log(`  Exported ${items.length} items to ${outputFile}`);
   return items.length;
}

async function main()
{
   console.log(`Exporting DynamoDB tables for ${ENV.toUpperCase()}...\n`);
   console.log(`Region: ${REGION}`);
   console.log(`Table Prefix: ${TABLE_PREFIX}\n`);
   
   if (!fs.existsSync(OUTPUT_DIR))
   { fs.mkdirSync(OUTPUT_DIR, { recursive: true }); }
   
   let totalItems = 0;
   
   for (const table of TABLES)
   {
      const count = await exportTable(table);
      totalItems += count;
   }
   
   console.log(`\nExport complete! Total items: ${totalItems}`);
   console.log(`Files saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);
