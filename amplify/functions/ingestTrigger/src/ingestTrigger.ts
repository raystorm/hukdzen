import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda';
import { logger } from '../../shared/logger';
import { indexUpdater } from './OpenSearch';
import { getOfficeDocumentText, isOfficeDocument, isTextFile } from './TextExtractor';

const S3AccessLevel = 'public';
export { S3AccessLevel };

const indexName = process.env.INDEX_NAME || 'treasures-index';
export { indexName };

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const amplifyEnv = process.env.ENV;
const isProd = amplifyEnv === 'prod';

interface SearchIndexBody
{
   __typename:                string;
   id:                        string;
   eng_title:                 string;
   eng_description:           string;
   bc_title:                  string;
   bc_description:            string;
   ak_title:                  string;
   ak_description:            string;
   fileKey:                   string;
   fileHash:                  string;
   created:                   string;
   updated:                   string;
   type:                      string;
   version:                   number;
   createdAt:                 string;
   updatedAt:                 string;
   documentAuthorId:          string;
   documentContentOwnerUserId: string;
   documentBoxBoxId:          string;
   keywords:                  string[];
}

interface SearchIndex
{
   index:   string;
   id:      string;
   body:    SearchIndexBody;
}

export const buildSearchIndex = (indexName: string, record: DynamoDBRecord,
                                 fileContents: string): SearchIndex =>
{
   const insert = record.dynamodb!.NewImage!;
   const keys: string[] = [];
   for (const item of insert.keywords.L!) { keys.push(item.S!); }
   keys.push(fileContents);

   return {
      index: indexName,
      id: record.dynamodb!.Keys!.id.S!,
      body:
      {
         __typename:                insert.__typename.S!,
         id:                        insert.id.S!,
         eng_title:                 insert.eng?.M?.title?.S || '',
         eng_description:           insert.eng?.M?.description?.S || '',
         bc_title:                  insert.bc?.M?.title?.S || '',
         bc_description:            insert.bc?.M?.description?.S || '',
         ak_title:                  insert.ak?.M?.title?.S || '',
         ak_description:            insert.ak?.M?.description?.S || '',
         fileKey:                   insert.fileKey.S!,
         fileHash:                  insert.fileHash?.S ?? '',
         created:                   insert.created.S!,
         updated:                   insert.updated ? insert.updated.S! : '',
         type:                      insert.type.S ?? '',
         version:                   Number(insert.version.N!),
         createdAt:                 insert.createdAt.S!,
         updatedAt:                 insert.updatedAt.S!,
         documentAuthorId:          insert.documentAuthorId.S!,
         documentContentOwnerUserId: insert.documentContentOwnerUserId.S!,
         documentBoxBoxId:          insert.documentBoxBoxId.S!,
         keywords: keys,
      }
   };
}

/**
 * Ingest Trigger Lambda
 * 
 * Document processing and indexing pipeline triggered by S3 uploads.
 * 
 * **Trigger:** DynamoDB Stream events from Document table
 * 
 * **Responsibilities:**
 * - Extract document metadata from DynamoDB stream
 * - Fetch uploaded file from S3
 * - Extract text content from document (text, Office, OpenDocument and PDF files)
 * - Index metadata only (empty file text) for other file types
 * - Process every record in a stream batch; rethrow the first failure so the batch retries
 * - Convert orthography (BC ↔ AK) via imported conversion logic
 * - Generate content hash for deduplication
 * - Index document in OpenSearch with keywords and extracted text
 * - Update document record in DynamoDB
 * 
 * **Integration Points:**
 * - DynamoDB Streams (trigger source)
 * - S3 (document storage and retrieval)
 * - OpenSearch (document indexing)
 * - DynamoDB (document metadata)
 * - Local-Utilities (extraction/conversion logic parity)
 * 
 * **Business Logic:**
 * - Multilingual metadata extraction (English, BC orthography, AK orthography)
 * - Orthography conversion (bidirectional BC ↔ AK)
 * - Duplicate detection via content hashing
 * - Search keyword generation and indexing
 * - Text extraction from supported file types (txt, Office documents)
 * 
 * @param event - DynamoDB Stream event containing document records
 */
const processRecord = async (record: DynamoDBRecord): Promise<void> =>
{
   const bucketName = process.env.STORAGE_BUCKET_NAME;
   const docDetail = record.dynamodb;

   if (!docDetail?.NewImage)
   {
      const message = 'Missing NewImage: aborting update';
      logger.error(message);
      throw new Error(message);
   }

   const filePrefix = `${S3AccessLevel}/`;
   const fileKey = `${filePrefix}${docDetail.NewImage.fileKey.S}`;

   if (!fileKey || filePrefix === fileKey)
   {
      const message = 'Missing File Key: aborting update';
      logger.error(message);
      throw new Error(message);
   }

   const getFileParams = { Bucket: bucketName, Key: fileKey };
   if (!isProd) { logger.log('About to GET file for:', getFileParams); }
   const file = await s3Client.send(new GetObjectCommand(getFileParams));

   if (!file.Body)
   {
      const failMessage = 'Unable to locate Uploaded file';
      logger.error(failMessage);
      throw new Error(failMessage);
   }

   if (isTextFile(fileKey))
   {
      const content = await file.Body.transformToString();
      await indexUpdater(buildSearchIndex(indexName, record, content));
   }
   else if (isOfficeDocument(fileKey))
   {
      const ar = await file.Body.transformToByteArray();
      const fileBuff = Buffer.from(ar);
      const fileText = await getOfficeDocumentText(fileBuff);
      await indexUpdater(buildSearchIndex(indexName, record, fileText));
   }
   else
   {
      // No text to extract: still index the metadata so the document is searchable by title/description
      const message = 'UnSupported File extension: Unable to extract text. Indexing metadata only.';
      if (!isProd) { logger.warn(message); }
      await indexUpdater(buildSearchIndex(indexName, record, ''));
   }
};

export const handler: DynamoDBStreamHandler = async (event) =>
{
   if (!isProd)
   {
      logger.log('EVENT:', event);
      for (const record of event.Records)
      {
         logger.log("event id:",           record.eventID);
         logger.log("event name:",         record.eventName);
         logger.log('DynamoDB Record: %j', record.dynamodb);
      }
   }

   // A stream batch can hold several records: process every one, then
   // rethrow the first failure so the batch is retried (indexing is idempotent).
   let firstError: unknown;

   for (const record of event.Records)
   {
      try { await processRecord(record); }
      catch (err)
      {
         logger.error('unexpected error indexing file:', err);
         if (undefined === firstError) { firstError = err; }
      }
   }

   if (undefined !== firstError) { throw firstError; }
}
