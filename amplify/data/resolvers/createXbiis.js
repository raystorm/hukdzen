import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { xbiisOwnerId } = ctx.args.input;
   
   if (!xbiisOwnerId) { util.error('owner is required', 'ValidationError'); }
   
   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id: util.autoId() }),
      attributeValues: util.dynamodb.toMapValues(ctx.args.input),
   };
}

export function response(ctx) { return ctx.result; }
