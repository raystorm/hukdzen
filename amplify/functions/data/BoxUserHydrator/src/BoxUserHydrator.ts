import { logger } from '../../../shared/logger';
import { graphql } from '../../../shared/graphql';
import {
         getBoxUser, listBoxUsers,
         getUser, getXbiis
       } from "../../../shared/graphql/queries";
import { GetBoxUserQuery, ListBoxUsersQuery,
         GetUserQuery, GetXbiisQuery
       } from '../../../shared/graphql/API';
import type { BoxUser, BoxUserList } from '../../../shared/types';

interface Event {
   operation: 'get' | 'list';
   arguments: any;
}

/**
 * BoxUser Hydrator Lambda
 * 
 * Hydrates BoxUser relationships for detailed GraphQL queries.
 * 
 * **Trigger:** GraphQL query invocation via AppSync (getBoxUserDetailed, listBoxUserDetailed)
 * 
 * **Responsibilities:**
 * - Fetch BoxUser data from DynamoDB
 * - Hydrate related User record
 * - Hydrate related Box record
 * - Hydrate Box owner User record
 * - Apply permission filtering
 * - Filter out BoxUsers with missing relationships
 * - Return fully hydrated response
 * 
 * **Integration Points:**
 * - AppSync (GraphQL resolver)
 * - DynamoDB (data fetching via shared GraphQL client)
 * 
 * **Operations:**
 * - get: Fetch and hydrate single BoxUser by ID
 * - list: Fetch and hydrate multiple BoxUsers with filtering and pagination
 * 
 * @param event - Event containing operation type ('get' or 'list') and arguments
 * @returns Hydrated BoxUser or BoxUserList with relationships populated
 */
export const handler = async (event: Event) =>
{
   try
   {
      logger.info('Event:', event);
      const { operation, arguments: args } = event;

      if (operation === 'get')
      {
         const result = await graphql<GetBoxUserQuery>(getBoxUser, { id: args.id });
         if (!result?.data?.getBoxUser) { return null; }
         return await hydrateBoxUser(result.data.getBoxUser);
      }

      if (operation === 'list')
      {
         const result = await graphql<ListBoxUsersQuery>(listBoxUsers, {
            filter: args.filter,
            limit: args.limit,
            nextToken: args.nextToken,
         });

         const items = await Promise.all(
            (result.data?.listBoxUsers?.items ?? []).filter((i) => i !== null)
                                                    .map(hydrateBoxUser)
         );

         // Filter out BoxUsers that failed to hydrate (missing user or box)
         const validItems = items.filter(item => item.user && item.box);

         return { items: validItems,
                  nextToken: result.data?.listBoxUsers?.nextToken } as BoxUserList;
      }
      throw new Error(`Unknown operation: ${operation}`);
   }
   catch (error)
   {
      logger.error('Handler error:', error);
      throw error;
   }
}

async function hydrateBoxUser(boxUser: BoxUser)
{
   const hydrated = { ...boxUser };

   if (boxUser.boxUserUserId)
   {
      const result = await graphql<GetUserQuery>(getUser, { id: boxUser.boxUserUserId });
      logger.info('getUser result:', result);
      hydrated.user = result?.data?.getUser ?? null;
   }

   if (boxUser.boxUserBoxId)
   {
      const result = await graphql<GetXbiisQuery>(getXbiis, { id: boxUser.boxUserBoxId });
      logger.info('getXbiis result:', result);
      const box = result?.data?.getXbiis;
      if ( box )
      {
         hydrated.box = box;

         if (box.xbiisOwnerId)
         {
            const result = await graphql<GetUserQuery>(getUser, { id: box.xbiisOwnerId });
            logger.info('getUser (owner) result:', result);
            hydrated.box!.owner = result?.data?.getUser ?? null;
         }
      }
   }

   logger.info('Hydrated BoxUser:', hydrated);
   return hydrated;
}
