import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { filter, limit, nextToken } = ctx.arguments;

   return {
      operation:      'Scan',
      filter:         filter ? util.transform.toDynamoDBFilterExpression(filter) : null,
      limit:          limit,
      nextToken:      nextToken,
   };
}

export function response(ctx)
{
   return {
      items:     ctx.result.items,
      nextToken: ctx.result.nextToken,
   };
}
