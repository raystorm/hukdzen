import { util } from '@aws-appsync/utils';

export function request(ctx) {
   const { filter, limit, nextToken } = ctx.args;
   return {
      operation: 'Scan',
      filter: filter ? util.transform.toDynamoDBFilterExpression(filter) : null,
      limit,
      nextToken,
   };
}

export function response(ctx) {
   const { items = [], nextToken } = ctx.result;
   return { items, nextToken };
}
