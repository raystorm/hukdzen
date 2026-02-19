import { logger } from '../../../shared/logger';
import { graphql } from '../../../shared/graphql';
import {
         getBoxUser, listBoxUsers,
         getUser, getXbiis
       } from "../../../shared/graphql/queries";
import type { BoxUser } from '../../../shared/types';

interface Event {
   operation: 'get' | 'list';
   arguments: any;
}

export const handler = async (event: Event) =>
{
   try {
      logger.info('Event:', event);
      const { operation, arguments: args } = event;

      if (operation === 'get')
      {
         const result = await graphql(getBoxUser, { id: args.id });
         if (!result?.data?.getBoxUser) { return null; }
         return await hydrateBoxUser(result.data.getBoxUser);
      }

      if (operation === 'list')
      {
         const result = await graphql(listBoxUsers, {
            filter: args.filter,
            limit: args.limit,
            nextToken: args.nextToken,
         });

         const items = await Promise.all(
            result.data.listBoxUsers?.items.map(hydrateBoxUser)
         );

         // Filter out BoxUsers that failed to hydrate (missing user or box)
         const validItems = items.filter(item => item.user && item.box);

         return { items: validItems, nextToken: result.data.listBoxUsers.nextToken };
      }

      throw new Error(`Unknown operation: ${operation}`);
   } catch (error) {
      logger.error('Handler error:', error);
      throw error;
   }
}

async function hydrateBoxUser(boxUser: BoxUser)
{
   const hydrated = { ...boxUser };

   if (boxUser.boxUserUserId)
   {
      const result = await graphql(getUser, { id: boxUser.boxUserUserId });
      logger.info('getUser result:', result);
      hydrated.user = result?.data?.getUser ?? null;
   }

   if (boxUser.boxUserBoxId)
   {
      const result = await graphql(getXbiis, { id: boxUser.boxUserBoxId });
      logger.info('getXbiis result:', result);
      const box = result?.data?.getXbiis;
      if ( box )
      {
         hydrated.box = box;

         if (box.xbiisOwnerId)
         {
            const result = await graphql(getUser, { id: box.xbiisOwnerId });
            logger.info('getUser (owner) result:', result);
            hydrated.box!.owner = result?.data?.getUser ?? null;
         }
      }
   }

   logger.info('Hydrated BoxUser:', hydrated);
   return hydrated;
}
