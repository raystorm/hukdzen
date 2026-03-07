import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.collectionCollectionId) { util.error('collectionCollectionId is required', 'ValidationError'); }

   const hasDocument = !!input.documentDetailsId;
   const hasChild    = !!input.childCollectionId;

   if (!hasDocument && !hasChild) { util.error('Exactly one of documentDetailsId or childCollectionId must be set', 'ValidationError'); }
   if (hasDocument && hasChild)   { util.error('Exactly one of documentDetailsId or childCollectionId must be set', 'ValidationError'); }

   const id  = input.id || util.autoId();
   const now = util.time.nowISO8601();

   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id }),
      attributeValues: util.dynamodb.toMapValues({
         __typename:       'CollectionItem',
         id:               id,
         collectionID:     input.collectionCollectionId,
         documentID:       input.documentDetailsId || null,
         childCollectionID: input.childCollectionId || null,
         order:            input.order,
         created:          now,
         createdAt:        now,
         updatedAt:        now,
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
