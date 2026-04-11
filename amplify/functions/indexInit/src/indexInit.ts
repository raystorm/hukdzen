import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import type { Handler } from 'aws-lambda';

interface CustomResourceEvent {
   RequestType: 'Create' | 'Update' | 'Delete';
   [key: string]: any;
}

/**
 * Index Init Lambda
 * 
 * Initializes OpenSearch indexes on first deployment or update.
 * 
 * **Trigger:** CloudFormation Custom Resource (Create or Update events)
 * 
 * **Responsibilities:**
 * - Check if OpenSearch index exists
 * - Create index with proper mappings if it doesn't exist
 * - Configure field types for document properties
 * - Set up analyzers for multilingual search
 * - Initialize index settings
 * 
 * **Integration Points:**
 * - OpenSearch (index management)
 * - CloudFormation (custom resource lifecycle)
 * 
 * **Index Configuration:**
 * - Document metadata fields (titles, descriptions in 3 languages)
 * - File metadata (fileKey, fileHash, type, version)
 * - Relationship IDs (author, owner, box)
 * - Timestamps (created, updated, createdAt, updatedAt)
 * - Keywords field for full-text search
 * 
 * **Business Logic:**
 * - Idempotent: checks for existing index before creation
 * - No-op on Delete events (preserves data)
 * - Uses AWS SigV4 signing for OpenSearch Serverless authentication
 * 
 * @param event - CloudFormation Custom Resource event
 * @returns Physical resource ID for CloudFormation tracking
 */
export const handler: Handler = async (event: CustomResourceEvent) =>
{
   console.log('Event:', JSON.stringify(event));
   
   if (event.RequestType === 'Delete')
   { return { PhysicalResourceId: 'opensearch-index' }; }

   const client = new Client({
      ...AwsSigv4Signer({
         region: process.env.AWS_REGION || 'us-east-1',
         service: 'aoss',
         getCredentials: () => defaultProvider()(),
      }),
      node: process.env.COLLECTION_ENDPOINT,
   });

   const indexName = process.env.INDEX_NAME;
   
   if (!indexName)
   { throw new Error('INDEX_NAME environment variable not set'); }
   
   try
   {
      const exists = await client.indices.exists({ index: indexName });
      
      if (!exists.body)
      {
         await client.indices.create({
            index: indexName,
            body: {
               mappings: {
                  properties: {
                     __typename:                 { type: 'keyword' },
                     id:                         { type: 'keyword' },
                     eng_title:                  { type: 'text' },
                     eng_description:            { type: 'text' },
                     bc_title:                   { type: 'text' },
                     bc_description:             { type: 'text' },
                     ak_title:                   { type: 'text' },
                     ak_description:             { type: 'text' },
                     fileKey:                    { type: 'keyword' },
                     fileHash:                   { type: 'keyword' },
                     created:                    { type: 'date' },
                     updated:                    { type: 'date' },
                     type:                       { type: 'keyword' },
                     version:                    { type: 'long' },
                     createdAt:                  { type: 'date' },
                     updatedAt:                  { type: 'date' },
                     documentDetailsAuthorId:    { type: 'keyword' },
                     documentDetailsDocOwnerId:  { type: 'keyword' },
                     documentDetailsBoxId:       { type: 'keyword' },
                     keywords:                   { type: 'text' },
                  },
               },
            },
         });
         console.log(`Created index: ${indexName}`);
      }
      else { console.log(`Index already exists: ${indexName}`); }
      
      return { PhysicalResourceId: 'opensearch-index' };
   }
   catch (error: any)
   {
      console.error('Error:', error);
      throw error;
   }
};
