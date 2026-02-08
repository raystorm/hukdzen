const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { Client } = require('@opensearch-project/opensearch');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');
const { logger } = require('../shared/logger');

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);

let osClient;
function getOpenSearchClient()
{
   if (!osClient)
   {
      osClient = new Client({
         ...AwsSigv4Signer({
            region: process.env.AWS_REGION,
            service: 'aoss',
            getCredentials: () => {
               const credentialsProvider = defaultProvider();
               return credentialsProvider();
            },
         }),
         node: process.env.OPENSEARCH_ENDPOINT,
      });
   }
   return osClient;
}

const DEFAULT_BOX_ID = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

exports.handler = async (event) =>
{
   logger.log('Search event:', event);

   try
   {
      const { query, boxIds, field, sortField, sortDirection, limit, from } = event.arguments;
      const userId = event.identity?.sub;

      if (!userId) { throw new Error('User not authenticated'); }
      if (!query || query.trim() === '') { throw new Error('Search query is required'); }

      let allowedBoxIds = boxIds;
      if (!allowedBoxIds)
      {
         const user = await getUser(userId);
         if (!user?.isAdmin) { allowedBoxIds = await getUserBoxIds(userId); }
      }
      else
      {
         const user = await getUser(userId);
         if (!user?.isAdmin)
         {
            const userBoxIds = await getUserBoxIds(userId);
            allowedBoxIds = boxIds.filter(id => userBoxIds.includes(id));
            if (0 === allowedBoxIds.length)
            { throw new Error('No access to specified boxes'); }
         }
      }

      const searchField = field || 'keywords';
      const searchLimit = limit || 10;
      const searchFrom = from || 0;

      const osQuery = buildOpenSearchQuery(query, searchField, allowedBoxIds);
      const osSort = buildOpenSearchSort(sortField, sortDirection);

      logger.log('OpenSearch query:', osQuery);

      const osClient = getOpenSearchClient();
      const searchBody = {
         query: osQuery,
         from: searchFrom,
         size: searchLimit,
      };
      if (osSort) { searchBody.sort = osSort; }

      const response = await osClient.search({
         index: 'documents',
         body: searchBody,
      });

      const items = response.body.hits.hits.map(hit => ({
         type: 'DOCUMENT',
         document: { id: hit._id, ...hit._source },
         score: hit._score,
      }));

      return {
         items,
         total: response.body.hits.total.value,
         from: searchFrom,
         limit: searchLimit,
         nextToken: (searchFrom + searchLimit < response.body.hits.total.value) ?
                    String(searchFrom + searchLimit) : null,
      };
   }
   catch (error)
   {
      logger.error('Search error:', error);
      throw error;
   }
};

async function getUser(userId)
{
   const params = {
      TableName: process.env.USER_TABLE_NAME,
      Key: { id: userId },
   };

   const result = await ddb.send(new GetCommand(params));
   return result.Item;
}

async function getUserBoxIds(userId)
{
   const params = {
      TableName: process.env.BOX_USER_TABLE_NAME,
      IndexName: 'byUser',
      KeyConditionExpression: 'userUserId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
   };

   const result = await ddb.send(new QueryCommand(params));
   const boxIds = result.Items?.map(item => item.boxXbiisId).filter(Boolean) || [];
   boxIds.push(DEFAULT_BOX_ID);
   return boxIds;
}

function buildOpenSearchQuery(query, field, boxIds)
{
   let searchFields;
   if (!field || field === 'keywords')
   { searchFields = ['keywords']; }
   else if (field === 'all')
   { searchFields = ['keywords', 'eng_title', 'bc_title', 'ak_title', 'eng_description', 'bc_description', 'ak_description']; }
   else
   { searchFields = [field]; }

   const mustClauses = [{
      multi_match: {
         query,
         fields: searchFields,
         type: 'best_fields',
      },
   }];

   if (boxIds)
   {
      mustClauses.push({
         terms: { 'documentDetailsBoxId': boxIds },
      });
   }

   return { bool: { must: mustClauses } };
}

function buildOpenSearchSort(sortField, sortDirection)
{
   if (!sortField) { return undefined; }
   const direction = sortDirection === 'DESC' ? 'desc' : 'asc';
   return [{ [sortField]: { order: direction } }];
}
