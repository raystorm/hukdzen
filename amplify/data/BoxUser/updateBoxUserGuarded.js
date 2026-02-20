import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.id)     { util.error('id is required', 'ValidationError'); }
   if (!input.userId) { util.error('userId is required', 'ValidationError'); }
   if (!input.boxId)  { util.error('boxId is required', 'ValidationError'); }
   if (!input.role)   { util.error('role is required', 'ValidationError'); }

   const now = util.time.nowISO8601();

   return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({ id: input.id }),
      update: {
         expression: 'SET #role = :role, #userUserId = :userUserId, #boxUserUserId = :boxUserUserId, #boxUserBoxId = :boxUserBoxId, #updatedAt = :updatedAt',
         expressionNames: {
            '#role':          'role',
            '#userUserId':    'userUserId',
            '#boxUserUserId': 'boxUserUserId',
            '#boxUserBoxId':  'boxUserBoxId',
            '#updatedAt':     'updatedAt',
         },
         expressionValues: util.dynamodb.toMapValues({
            ':role':          input.role,
            ':userUserId':    input.userId,
            ':boxUserUserId': input.userId,
            ':boxUserBoxId':  input.boxId,
            ':updatedAt':     now,
         }),
      },
      condition: {
         expression:       'attribute_exists(#id)',
         expressionNames:  { '#id': 'id' },
      },
   };
}

export function response(ctx)
{
   if (ctx.error) { util.error(ctx.error.message, ctx.error.type); }
   return ctx.result;
}
