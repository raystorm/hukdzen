import { generateClient } from 'aws-amplify/api';
import {
         getBoxUser, listBoxUsers,
         getUser, getXbiis
       } from "../../../shared/graphql/queries";
import type { BoxUser } from '../../../shared/types';

const client = generateClient();

interface Event {
   operation: 'get' | 'list';
   arguments: any;
}

export const handler = async (event: Event) =>
{
   const { operation, arguments: args } = event;

   if (operation === 'get')
   {
      const result = await client.graphql({ query: getBoxUser,
                                            variables: { id: args.id } })
      if (!result?.data?.getBoxUser) { return null; }
      return await hydrateBoxUser(result.data.getBoxUser);
   }

   if (operation === 'list')
   {
      const result = await client.graphql({
         query: listBoxUsers,
         variables: {
           filter: args.filter,
           limit: args.limit,
           nextToken: args.nextToken,
         }
      });

      const items = await Promise.all(
         result.data.listBoxUsers?.items.map(hydrateBoxUser)
      );

      return { items, nextToken: result.data.listBoxUsers.nextToken };
   }

   throw new Error(`Unknown operation: ${operation}`);
}

async function hydrateBoxUser(boxUser: BoxUser)
{
   const hydrated = { ...boxUser };

   if (boxUser.boxUserUserId)
   {
      const userResult = await client.graphql({query: getUser,
                                               variables: { id: boxUser.boxUserUserId }
      });
      hydrated.user = userResult?.data?.getUser ?? null;
   }

   if (boxUser.boxUserBoxId)
   {
      const boxResult = await client.graphql({ query: getXbiis,
                                               variables: { id: boxUser.boxUserBoxId }
      });
      const box = boxResult?.data?.getXbiis;
      if ( box )
      {
         hydrated.box = box;

         if (box.xbiisOwnerId)
         {
            const ownerResult = await client.graphql({ query: getUser,
                                                       variables: { id: box.xbiisOwnerId }
            });
            hydrated.box!.owner = ownerResult?.data?.getUser ?? null;
         }
      }
   }

   return hydrated;
}