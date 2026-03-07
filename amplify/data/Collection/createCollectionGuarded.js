import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.eng_title)            { util.error('eng_title is required', 'ValidationError'); }
   if (!input.collectionOwnerUserId) { util.error('collectionOwnerUserId is required', 'ValidationError'); }
   if (!input.boxXbiisId)           { util.error('boxXbiisId is required', 'ValidationError'); }

   const id  = input.id || util.autoId();
   const now = util.time.nowISO8601();

   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id }),
      attributeValues: util.dynamodb.toMapValues({
         __typename:                 'Collection',
         id:                         id,
         eng_title:                  input.eng_title,
         eng_description:            input.eng_description,
         bc_title:                   input.bc_title,
         bc_description:             input.bc_description,
         ak_title:                   input.ak_title,
         ak_description:             input.ak_description,
         collectionCollectionOwnerId: input.collectionOwnerUserId,
         collectionBoxId:            input.boxXbiisId,
         created:                    now,
         updated:                    now,
         createdAt:                  now,
         updatedAt:                  now,
      }),
      condition: {
         expression:      'attribute_not_exists(#id)',
         expressionNames: { '#id': 'id' },
      },
   };
}

export function response(ctx)
{
   if (ctx.error) { util.error(ctx.error.message, ctx.error.type); }
   return ctx.result;
}
