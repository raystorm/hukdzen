import { logger } from '../../../shared/logger';
import { graphql } from '../../../shared/graphql';
import {
         getBoxRequest, listBoxRequests,
         getUser, getXbiis
       } from "../../../shared/graphql/queries";
import type { GetBoxRequestQuery, ListBoxRequestsQuery,
              GetUserQuery, GetXbiisQuery
            } from '../../../shared/graphql/API';
import type { BoxRequest, BoxRequestList } from '../../../shared/types';

interface Event {
   operation: 'get' | 'list';
   arguments: any;
}

/**
 * BoxRequest Hydrator Lambda
 * 
 * Hydrates BoxRequest relationships for detailed GraphQL queries.
 * 
 * **Trigger:** GraphQL query invocation via AppSync (getBoxRequestDetailed, listBoxRequestDetailed)
 * 
 * **Responsibilities:**
 * - Fetch BoxRequest data from DynamoDB
 * - Hydrate related User records (createdBy, approvedBy)
 * - Hydrate related Box record (createdBox)
 * - Hydrate Box owner User record
 * - Apply permission filtering
 * - Return fully hydrated response
 * 
 * **Integration Points:**
 * - AppSync (GraphQL resolver)
 * - DynamoDB (data fetching via shared GraphQL client)
 * 
 * **Operations:**
 * - get: Fetch and hydrate single BoxRequest by ID
 * - list: Fetch and hydrate multiple BoxRequests with filtering and pagination
 * 
 * @param event - Event containing operation type ('get' or 'list') and arguments
 * @returns Hydrated BoxRequest or BoxRequestList with relationships populated
 */
export const handler = async (event: Event): Promise<BoxRequest | null | BoxRequestList> =>
{
   try
   {
      logger.info('Event:', event);
      const { operation, arguments: args } = event;

      if (operation === 'get')
      {
         const result = await graphql<GetBoxRequestQuery>(getBoxRequest, { id: args.id });
         if (!result?.data?.getBoxRequest) { return null; }
         return await hydrateBoxRequest(result.data.getBoxRequest);
      }

      if (operation === 'list')
      {
         const result = await graphql<ListBoxRequestsQuery>(listBoxRequests,
         {
            filter: args.filter,
            limit: args.limit,
            nextToken: args.nextToken,
         });

         const items = await Promise.all(
            (result.data?.listBoxRequests?.items ?? []).filter((i) => i !== null)
                                                       .map(hydrateBoxRequest)
         );

         return { items,
                  nextToken: result.data?.listBoxRequests?.nextToken } as BoxRequestList;
      }

      throw new Error(`Unknown operation: ${operation}`);
   }
   catch (error)
   {
      logger.error('Handler error:', error);
      throw error;
   }
}

async function hydrateBoxRequest(boxRequest: BoxRequest)
{
   const hydrated = { ...boxRequest };

   if (boxRequest.boxRequestCreatedById)
   {
      const result = await graphql<GetUserQuery>(getUser,
                                                 { id: boxRequest.boxRequestCreatedById });
      logger.info('getUser (createdBy) result:', result);
      hydrated.createdBy = result?.data?.getUser ?? null;
   }

   if (boxRequest.boxRequestApprovedById)
   {
      const result = await graphql<GetUserQuery>(getUser,
                                                 { id: boxRequest.boxRequestApprovedById });
      logger.info('getUser (approvedBy) result:', result);
      hydrated.approvedBy = result?.data?.getUser ?? null;
   }

   if (boxRequest.boxRequestCreatedBoxId)
   {
      const result = await graphql<GetXbiisQuery>(getXbiis,
                                                  { id: boxRequest.boxRequestCreatedBoxId });
      logger.info('getXbiis result:', result);
      const box = result?.data?.getXbiis;
      if (box)
      {
         hydrated.createdBox = box;

         if (box.xbiisOwnerId)
         {
            const result = await graphql<GetUserQuery>(getUser,
                                                       { id: box.xbiisOwnerId });
            logger.info('getUser (box owner) result:', result);
            hydrated.createdBox!.owner = result?.data?.getUser ?? null;
         }
      }
   }

   logger.info('Hydrated BoxRequest:', hydrated);
   return hydrated;
}
