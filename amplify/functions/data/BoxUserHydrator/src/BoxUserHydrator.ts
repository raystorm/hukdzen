import { generateClient } from 'aws-amplify/data';
//import type { Schema } from '../../../../data/resource.js';

//const client = generateClient<Schema>();

interface Event {
   operation: 'get' | 'list';
   arguments: any;
}

export const handler = async (event: Event) =>
{
   return; }
   /*
   const { operation, arguments: args } = event;

   if (operation === 'get')
   {
      const result = await client.models.BoxUser.get({ id: args.id });
      if (!result.data) return null;
      return await hydrateBoxUser(result.data);
   }

   if (operation === 'list')
   {
      const result = await client.models.BoxUser.list({
         filter: args.filter,
         limit: args.limit,
         nextToken: args.nextToken,
      });

      const items = await Promise.all(
         result.data.map(boxUser => hydrateBoxUser(boxUser))
      );

      return { items, nextToken: result.nextToken };
   }

   throw new Error(`Unknown operation: ${operation}`);
};

async function hydrateBoxUser(boxUser: any)
{
   const hydrated = { ...boxUser };

   if (boxUser.userId) {
      const userResult = await client.models.User.get({ id: boxUser.userId });
      if (userResult.data) hydrated.user = userResult.data;
   }

   if (boxUser.boxId)
   {
      const boxResult = await client.models.Xbiis.get({ id: boxUser.boxId });
      if (boxResult.data)
      {
         const box = boxResult.data;
         hydrated.box = box;

         if (box.ownerId)
         {
            const ownerResult = await client.models.User.get({ id: box.ownerId });
            if (ownerResult.data) hydrated.box.owner = ownerResult.data;
         }
      }
   }

   return hydrated;
}
*/