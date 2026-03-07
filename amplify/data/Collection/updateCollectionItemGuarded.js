import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.id) { util.error('id is required', 'ValidationError'); }

   const hasDocument = !!input.documentDetailsId;
   const hasChild    = !!input.childCollectionId;

   if (!hasDocument && !hasChild) { util.error('Exactly one of documentDetailsId or childCollectionId must be set', 'ValidationError'); }
   if (hasDocument && hasChild)   { util.error('Exactly one of documentDetailsId or childCollectionId must be set', 'ValidationError'); }

   const now = util.time.nowISO8601();

   return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({ id: input.id }),
      update: {
         expression: 'SET #documentID = :documentID, #childCollectionID = :childCollectionID, #order = :order, #updatedAt = :updatedAt',
         expressionNames: {
            '#documentID':       'documentID',
            '#childCollectionID': 'childCollectionID',
            '#order':            'order',
            '#updatedAt':        'updatedAt',
         },
         expressionValues: util.dynamodb.toMapValues({
            ':documentID':       input.documentDetailsId || null,
            ':childCollectionID': input.childCollectionId || null,
            ':order':            input.order,
            ':updatedAt':        now,
         }),
      },
      condition: {
         expression:      'attribute_exists(#id)',
         expressionNames: { '#id': 'id' },
      },
   };
}

export function response(ctx)
{
   if (ctx.error) { util.error(ctx.error.message, ctx.error.type); }
   return ctx.result;
}
