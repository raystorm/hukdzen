import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.id) { util.error('id is required', 'ValidationError'); }
   if (input.purpose === 'DEFAULT') { util.error('Cannot update DEFAULT purpose boxes', 'ValidationError'); }
   if (input.purpose === 'USER' && input.name) { util.error('Cannot change name for USER purpose boxes', 'ValidationError'); }

   const now = util.time.nowISO8601();

   const expressionParts = [];
   const expressionNames = {};
   const expressionValues = {};

   if (input.name !== undefined) {
      expressionParts.push('#name = :name');
      expressionNames['#name'] = 'name';
      expressionValues[':name'] = input.name;
   }
   if (input.purpose !== undefined) {
      expressionParts.push('#purpose = :purpose');
      expressionNames['#purpose'] = 'purpose';
      expressionValues[':purpose'] = input.purpose;
   }
   if (input.defaultRole !== undefined) {
      expressionParts.push('#defaultRole = :defaultRole');
      expressionNames['#defaultRole'] = 'defaultRole';
      expressionValues[':defaultRole'] = input.defaultRole;
   }
   if (input.waa !== undefined) {
      expressionParts.push('#waa = :waa');
      expressionNames['#waa'] = 'waa';
      expressionValues[':waa'] = input.waa;
   }

   expressionParts.push('#updatedAt = :updatedAt');
   expressionNames['#updatedAt'] = 'updatedAt';
   expressionValues[':updatedAt'] = now;

   return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({ id: input.id }),
      update: {
         expression: 'SET ' + expressionParts.join(', '),
         expressionNames,
         expressionValues: util.dynamodb.toMapValues(expressionValues),
      },
      condition: {
         expression:      'attribute_exists(#id)',
         expressionNames: { '#id': 'id' },
      },
   };
}

export function response(ctx)
{
   if (ctx.error) { util.error(ctx.error.message, ctx.error.type); }
   return ctx.result;
}
