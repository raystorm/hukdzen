#!/usr/bin/env node

/**
 * Index OpenSearch (Migration Step 8)
 *
 * Indexes migrated Documents by invoking the deployed ingestTrigger Lambda
 * once per Document, with a synthetic DynamoDB stream INSERT event.
 * The Lambda reads the file from S3, extracts its text, and writes the
 * search record, so migrated and uploaded documents share one code path.
 *
 * Run AFTER import-dynamodb.js and sync-s3.js (the Lambda reads the file from S3).
 * Safe to re-run: the Lambda overwrites the record for a given Document id.
 *
 * Note: for file types the Lambda cannot extract text from (anything other than
 * text, Office, OpenDocument and PDF files) it indexes the metadata only.
 */

import {InvokeCommand, LambdaClient} from '@aws-sdk/client-lambda';
import {marshall} from '@aws-sdk/util-dynamodb';
import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {GEN2_CONFIG} from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/**
 * Build the DynamoDB stream event the ingestTrigger Lambda expects.
 */
export const buildStreamEvent = (document) => ({
   Records: [
      {
         eventID:      document.id,
         eventName:    'INSERT',
         eventSource:  'aws:dynamodb',
         dynamodb: {
            Keys:     { id: { S: document.id } },
            NewImage: marshall(document, { removeUndefinedValues: true }),
         },
      },
   ],
});

/**
 * Create a function that invokes the Lambda synchronously with an event.
 * Resolves to { functionError, payload }.
 */
export const createInvoker = (functionName, region) => {
   const client = new LambdaClient({ region });

   return async (event) => {
      const response = await client.send(new InvokeCommand({
         FunctionName:   functionName,
         InvocationType: 'RequestResponse',
         Payload:        Buffer.from(JSON.stringify(event)),
      }));

      return {
         functionError: response.FunctionError,
         payload:       response.Payload ? Buffer.from(response.Payload).toString() : '',
      };
   };
};

export const indexDocument = async (document, invoke, counts, dryRun = false) => {
   if (dryRun) {
      console.log(`Would invoke ingest for: ${document.id}`);
      counts.invoked++;
      return;
   }

   try {
      const {functionError, payload} = await invoke(buildStreamEvent(document));

      if (functionError) {
         console.error(`Failed to index ${document.id}: ${payload}`);
         counts.failed++;
         return;
      }

      counts.invoked++;
   }
   catch (err) {
      console.error(`Failed to index ${document.id}:`, err.message);
      counts.failed++;
   }
};

/**
 * @param env    sbx | dev | prod
 * @param dryRun when true, no Lambda is invoked
 * @param deps   injectable dependencies (for tests): existsSync, readFileSync, invoke
 */
export const runIndexing = async (env, dryRun = false, deps = {}) => {
   const existsSync   = deps.existsSync   || fs.existsSync;
   const readFileSync = deps.readFileSync || fs.readFileSync;

   if (!['dev', 'prod', 'sbx'].includes(env)) {
      console.error('Usage: node index-opensearch.js [sbx|dev|prod] [--dry-run]');
      process.exit(1);
   }

   const config       = GEN2_CONFIG[env];
   const functionName = config.ingestTriggerFunction;

   if (!functionName || 'UPDATE_AFTER_GEN2_DEPLOY' === functionName) {
      console.error(`ERROR: Update ingestTriggerFunction for ${env} in config.js before running`);
      console.error('Deploy Gen2 with search enabled, then find the ingestTrigger Lambda name in the AWS Console');
      process.exit(1);
   }

   const inputFile = path.join(__dirname, 'import-ready', env, 'Document.json');

   if (!existsSync(inputFile)) {
      console.error(`ERROR: Document.json not found: ${inputFile}`);
      process.exit(1);
   }

   const invoke    = deps.invoke || createInvoker(functionName, config.region);
   const documents = JSON.parse(readFileSync(inputFile, 'utf8'));
   const counts    = { invoked: 0, failed: 0 };

   if (dryRun) { console.log('=== DRY RUN MODE ===\n'); }
   console.log(`Indexing OpenSearch for ${env.toUpperCase()} via ${functionName}...\n`);

   for (const doc of documents) {
      await indexDocument(doc, invoke, counts, dryRun);
   }

   if (dryRun) {
      console.log(`\nWould invoke: ${counts.invoked}`);
   }
   else {
      console.log(`\nInvoked OK: ${counts.invoked}, Failed: ${counts.failed}`);
   }
};

// CLI entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
   const env    = process.argv[2] || 'dev';
   const dryRun = process.argv.includes('--dry-run');
   runIndexing(env, dryRun).catch(console.error);
}
