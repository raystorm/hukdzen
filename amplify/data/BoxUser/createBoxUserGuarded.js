import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.userId) { util.error('userId is required', 'ValidationError'); }
   if (!input.boxId)  { util.error('boxId is required', 'ValidationError'); }
   if (!input.role)   { util.error('role is required', 'ValidationError'); }

   const id  = input.id || util.autoId();
   const now = util.time.nowISO8601();

   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id }),
      attributeValues: util.dynamodb.toMapValues({
         __typename:    'BoxUser',
         id:            id,
         role:          input.role,
         userUserId:    input.userId,
         boxUserUserId: input.userId,
         boxUserBoxId:  input.boxId,
         createdAt:     now,
         updatedAt:     now,
      }),
      condition: {
         expression:       'attribute_not_exists(#id)',
         expressionNames:  { '#id': 'id' },
      },
   };
}

export function response(ctx)
{
   if (ctx.error) { util.error(ctx.error.message, ctx.error.type); }
   return ctx.result;
}
