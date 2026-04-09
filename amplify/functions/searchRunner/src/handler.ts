import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { logger } from '../../shared/logger';
import type { AppSyncEvent,
              SearchArguments, SearchResults, SearchResultItem,
              User
            } from './types';
import { DefaultBox } from './types';

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);

let osClient: Client | undefined;

function getOpenSearchClient(): Client
{
   if (!osClient)
   {
      osClient = new Client({
         ...AwsSigv4Signer({
            region: process.env.AWS_REGION || 'us-east-1',
            service: 'aoss',
            getCredentials: () => defaultProvider()(),
         }),
         node: process.env.OPENSEARCH_ENDPOINT,
      });
   }
   return osClient;
}

const DEFAULT_BOX_ID = DefaultBox.id;

/**
 * Search Runner Lambda
 * 
 * Executes OpenSearch queries with permission-based filtering for the Smalgyax-Files application.
 * 
 * **Trigger:** GraphQL query invocation via AppSync
 * 
 * **Responsibilities:**
 * - Parse search query parameters
 * - Apply permission-based filtering (admin vs non-admin users)
 * - Execute OpenSearch query
 * - Handle pagination with limit/from/nextToken
 * - Apply relevance ranking or custom sort
 * - Return search results
 * 
 * **Integration Points:**
 * - AppSync (GraphQL resolver)
 * - OpenSearch (query execution)
 * - DynamoDB (permission checking via User and BoxUser tables)
 * 
 * **Business Logic:**
 * - Admin users can search all boxes
 * - Non-admin users are filtered to only accessible boxes (via BoxUser membership + default box)
 * - Field selection: keywords (default), 'all' (searches all fields), or specific field
 * - Pagination: supports limit, from, and nextToken for result navigation
 * - Relevance ranking by default, optional custom sort by field and direction
 * 
 * @param event - AppSync event containing search arguments and user identity
 * @returns Search results with items, total count, pagination info
 */
export const handler = async (event: AppSyncEvent<SearchArguments>): Promise<SearchResults> =>
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
            allowedBoxIds = allowedBoxIds.filter(id => userBoxIds.includes(id));
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
      const searchBody: any = {
         query: osQuery,
         from: searchFrom,
         size: searchLimit,
      };
      if (osSort) { searchBody.sort = osSort; }

      const response = await osClient.search({
         index: process.env.INDEX_NAME || 'treasures-index',
         body: searchBody,
      });

      const items = response.body.hits.hits.map((hit: any) => ({
         type: 'DOCUMENT' as const,
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

async function getUser(userId: string): Promise<User | undefined>
{
   const params = {
      TableName: process.env.USER_TABLE_NAME!,
      Key: { id: userId },
   };

   const result = await ddb.send(new GetCommand(params));
   return result.Item as User | undefined;
}

async function getUserBoxIds(userId: string): Promise<string[]>
{
   const params = {
      TableName: process.env.BOX_USER_TABLE_NAME!,
      IndexName: 'byUser',
      KeyConditionExpression: 'userUserId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
   };

   const result = await ddb.send(new QueryCommand(params));
   const boxIds = result.Items?.map(item => item.boxBoxId).filter(Boolean) || [];
   boxIds.push(DEFAULT_BOX_ID);
   return boxIds as string[];
}

function buildOpenSearchQuery(query: string, field: string, boxIds?: string[])
{
   let searchFields: string[];
   if (!field || field === 'keywords')
   { searchFields = ['keywords']; }
   else if (field === 'all')
   {
      searchFields = ['keywords', 'eng_title', 'bc_title', 'ak_title',
                      'eng_description', 'bc_description', 'ak_description'];
   }
   else { searchFields = [field]; }

   const mustClauses: any[] = [{
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

function buildOpenSearchSort(sortField?: string, sortDirection?: string)
{
   if (!sortField) { return undefined; }
   const direction = sortDirection === 'DESC' ? 'desc' : 'asc';
   return [{ [sortField]: { order: direction } }];
}
