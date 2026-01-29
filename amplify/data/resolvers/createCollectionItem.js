import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { collectionItemCollectionId, collectionItemDocumentId,
           collectionItemChildCollectionId } = ctx.args.input;
   
   if (!collectionItemCollectionId)
   { util.error('collection is required', 'ValidationError'); }
   
   const hasDocument = !!collectionItemDocumentId;
   const hasChildCollection = !!collectionItemChildCollectionId;
   
   if (!hasDocument && !hasChildCollection)
   {
      util.error('Either document or childCollection must be set', 'ValidationError');
   }
   
   if (hasDocument && hasChildCollection)
   {
      util.error('Cannot set both document and childCollection - they are mutually exclusive',
                 'ValidationError');
   }
   
   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id: util.autoId() }),
      attributeValues: util.dynamodb.toMapValues(ctx.args.input),
   };
}

export function response(ctx) { return ctx.result; }
