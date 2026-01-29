import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { boxUserUserId, boxUserBoxId } = ctx.args.input;
   
   if (!boxUserUserId) { util.error('user is required', 'ValidationError'); }
   if (!boxUserBoxId)  { util.error('box is required', 'ValidationError'); }
   
   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id: util.autoId() }),
      attributeValues: util.dynamodb.toMapValues(ctx.args.input),
   };
}

export function response(ctx) { return ctx.result; }
