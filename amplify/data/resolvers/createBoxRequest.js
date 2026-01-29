export function request(ctx) {
   const { boxRequestCreatedById } = ctx.args.input;
   
   if (!boxRequestCreatedById) {
      util.error('createdBy is required', 'ValidationError');
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
