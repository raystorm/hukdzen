const { Client }           = require('@opensearch-project/opensearch');
const { defaultProvider }  = require('@aws-sdk/credential-provider-node');
const { AwsSigv4Signer }   = require('@opensearch-project/opensearch/aws');

exports.handler = async (event) =>
{
   console.log('Event:', JSON.stringify(event));
   
   if (event.RequestType === 'Delete')
   { return { PhysicalResourceId: 'opensearch-index' }; }

   const client = new Client({
      ...AwsSigv4Signer({
         region: process.env.AWS_REGION,
         service: 'aoss',
         getCredentials: () => defaultProvider()(),
      }),
      node: process.env.COLLECTION_ENDPOINT,
   });

   const indexName = process.env.INDEX_NAME;
   
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
                     __typename: { type: 'keyword' },
                     id: { type: 'keyword' },
                     eng_title: { type: 'text' },
                     eng_description: { type: 'text' },
                     bc_title: { type: 'text' },
                     bc_description: { type: 'text' },
                     ak_title: { type: 'text' },
                     ak_description: { type: 'text' },
                     fileKey: { type: 'keyword' },
                     fileHash: { type: 'keyword' },
                     created: { type: 'date' },
                     updated: { type: 'date' },
                     type: { type: 'keyword' },
                     version: { type: 'long' },
                     createdAt: { type: 'date' },
                     updatedAt: { type: 'date' },
                     documentDetailsAuthorId: { type: 'keyword' },
                     documentDetailsDocOwnerId: { type: 'keyword' },
                     documentDetailsBoxId: { type: 'keyword' },
                     keywords: { type: 'text' },
                  },
               },
            },
         });
         console.log(`Created index: ${indexName}`);
      }
      else { console.log(`Index already exists: ${indexName}`); }
      
      return { PhysicalResourceId: 'opensearch-index' };
   }
   catch (error)
   {
      console.error('Error:', error);
      throw error;
   }
};
