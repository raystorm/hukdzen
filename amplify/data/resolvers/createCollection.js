export function request(ctx) {
   const { collectionCollectionOwnerId, collectionBoxId } = ctx.args.input;
   
   if (!collectionCollectionOwnerId) {
      util.error('collectionOwner is required', 'ValidationError');
   }
   if (!collectionBoxId) {
      util.error('box is required', 'ValidationError');
   }
   
   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id: util.autoId() }),
      attributeValues: util.dynamodb.toMapValues(ctx.args.input),
   };
}

export function response(ctx) {
   return ctx.result;
}
