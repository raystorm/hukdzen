import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { documentDetailsAuthorId, documentDetailsDocOwnerId,
           documentDetailsBoxId } = ctx.args.input;
   
   if (!documentDetailsAuthorId)
   { util.error('author is required', 'ValidationError'); }
   if (!documentDetailsDocOwnerId)
   { util.error('docOwner is required', 'ValidationError'); }
   if (!documentDetailsBoxId)
   { util.error('box is required', 'ValidationError'); }
   
   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id: util.autoId() }),
      attributeValues: util.dynamodb.toMapValues(ctx.args.input),
   };
}

export function response(ctx) { return ctx.result; }
