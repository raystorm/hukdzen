#!/usr/bin/env node

import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {Client} from '@opensearch-project/opensearch';
import {AwsSigv4Signer} from '@opensearch-project/opensearch/aws';
import {defaultProvider} from '@aws-sdk/credential-provider-node';
import fs from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {GEN2_CONFIG} from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const TEXT_EXTENSIONS = ['txt', 'text', 'md', 'csv'];

const isTextFile = (fileKey) => {
   if (!fileKey.includes('.')) { return false; }
   const ext = fileKey.substring(fileKey.lastIndexOf('.') + 1);
   return TEXT_EXTENSIONS.includes(ext);
};

export const buildIndexBody = (document, fileContent) => ({
   __typename:                    document.__typename,
   id:                            document.id,
   eng_title:                     document.eng?.title || '',
   eng_description:               document.eng?.description || '',
   bc_title:                      document.bc?.title || '',
   bc_description:                document.bc?.description || '',
   ak_title:                      document.ak?.title || '',
   ak_description:                document.ak?.description || '',
   fileKey:                       document.fileKey,
   fileHash:                      document.fileHash ?? '',
   created:                       document.created,
   updated:                       document.updated,
   type:                          document.type,
   version:                       document.version,
   createdAt:                     document.createdAt,
   updatedAt:                     document.updatedAt,
   documentAuthorId:              document.documentAuthorId,
   documentContentOwnerUserId:    document.documentContentOwnerUserId,
   documentBoxBoxId:              document.documentBoxBoxId,
   keywords:                      [...document.keywords, fileContent],
});

export const indexDocument = async (
   document, s3Client, indexName, indexUpdater, counts, dryRun = false
) => {
   if (!isTextFile(document.fileKey)) {
      console.warn(`Skipping unsupported file type: ${document.fileKey}`);
      counts.skipped++;
      return;
   }

   if (dryRun) {
      console.log(`Would index: ${document.id}`);
      counts.indexed++;
      return;
   }

   try {
      const s3Response = await s3Client.send(
         new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key:    `public/${document.fileKey}`,
         })
      );
      const fileContent = await s3Response.Body.transformToString();
      const body        = buildIndexBody(document, fileContent);

      await indexUpdater({ index: indexName, id: document.id, body, refresh: true });
      counts.indexed++;
   }
   catch (err) {
      console.error(`Failed to index ${document.id}:`, err.message);
      counts.failed++;
   }
};

export const runIndexing = async (env, dryRun = false, fsExistsSync = fs.existsSync) => {
   if (!['dev', 'prod', 'sbx'].includes(env)) {
      console.error('Usage: node index-opensearch.js [sbx|dev|prod] [--dry-run]');
      process.exit(1);
   }

   if (!process.env.OS_DOMAIN_URL) {
      console.error('ERROR: OS_DOMAIN_URL environment variable is required');
      process.exit(1);
   }

   const config    = GEN2_CONFIG[env];
   const sourceEnv = config.gen1Source || env;
   const inputFile = path.join(__dirname, 'import-ready', sourceEnv, 'Document.json');

   if (!fsExistsSync(inputFile)) {
      console.error(`ERROR: Document.json not found: ${inputFile}`);
      process.exit(1);
   }

   const indexName = process.env.INDEX_NAME || 'treasures-index';

   const osClient = new Client({
      ...AwsSigv4Signer({
         region:         config.region,
         service:        'es',
         getCredentials: () => defaultProvider()(),
      }),
      node: process.env.OS_DOMAIN_URL,
   });

   const indexUpdater = async (indexItem) => {
      const response = await osClient.index(indexItem);
      if (199 < response.statusCode && 300 > response.statusCode) { return response; }
      throw new Error('OpenSearch returned non-2xx status');
   };

   const s3Client = new S3Client({ region: config.region });

   const documents = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
   const counts    = { indexed: 0, skipped: 0, failed: 0 };

   if (dryRun) { console.log('=== DRY RUN MODE ===\n'); }
   console.log(`Indexing OpenSearch for ${env.toUpperCase()}...\n`);

   for (const doc of documents) {
      await indexDocument(doc, s3Client, indexName, indexUpdater, counts, dryRun);
   }

   if (dryRun) {
      console.log(`\nWould index: ${counts.indexed}, Would skip: ${counts.skipped}`);
   }
   else {
      console.log(`\nIndexed: ${counts.indexed}, Skipped: ${counts.skipped}, Failed: ${counts.failed}`);
   }
};

// CLI entry point
if (process.argv[1] === fileURLToPath(import.meta.url)) {
   const env    = process.argv[2] || 'dev';
   const dryRun = process.argv.includes('--dry-run');
   runIndexing(env, dryRun).catch(console.error);
}
