import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import type { DynamoDBStreamHandler, DynamoDBRecord } from 'aws-lambda';
import { logger } from '../shared/logger';
import { indexUpdater } from './OpenSearch';
import { isTextFile, isOfficeDocument, getOfficeDocumentText } from './TextExtractor';

const S3AccessLevel = 'public';
export { S3AccessLevel };

const indexName = 'documentdetails';
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
   documentDetailsAuthorId:   string;
   documentDetailsDocOwnerId: string;
   documentDetailsBoxId:      string;
   keywords:                  string[];
}

interface SearchIndex
{
   index:   string;
   id:      string;
   body:    SearchIndexBody;
   refresh: boolean;
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
         eng_title:                 insert.eng_title.S!,
         eng_description:           insert.eng_description.S!,
         bc_title:                  insert.bc_title.S!,
         bc_description:            insert.bc_description.S!,
         ak_title:                  insert.ak_title.S!,
         ak_description:            insert.ak_description.S!,
         fileKey:                   insert.fileKey.S!,
         fileHash:                  insert.fileHash?.S ?? '',
         created:                   insert.created.S!,
         updated:                   insert.updated ? insert.updated.S! : '',
         type:                      insert.type.S ?? '',
         version:                   Number(insert.version.N!),
         createdAt:                 insert.createdAt.S!,
         updatedAt:                 insert.updatedAt.S!,
         documentDetailsAuthorId:   insert.documentDetailsAuthorId.S!,
         documentDetailsDocOwnerId: insert.documentDetailsDocOwnerId.S!,
         documentDetailsBoxId:      insert.documentDetailsBoxId.S!,
         keywords: keys,
      },
      refresh: true
   };
}

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

   const bucketName = process.env.STORAGE_HALIAMWAALS3_BUCKETNAME;

   try
   {
      const eventType = event.Records[0].eventName;
      const docDetail = event.Records[0].dynamodb;

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
         await indexUpdater(buildSearchIndex(indexName, event.Records[0], content));
      }
      else if (isOfficeDocument(fileKey))
      {
         const ar = await file.Body.transformToByteArray();
         const fileBuff = Buffer.from(ar);
         const fileText = await getOfficeDocumentText(fileBuff);
         await indexUpdater(buildSearchIndex(indexName, event.Records[0], fileText));
      }
      else
      {
         const message = 'UnSupported File extension: Unable to extract text.';
         if (!isProd) { logger.warn(message); }
      }
   }
   catch (err)
   {
      logger.error('unexpected error indexing file:', err);
      throw err;
   }
}
