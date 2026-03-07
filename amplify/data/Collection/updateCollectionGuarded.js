import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.id)        { util.error('id is required', 'ValidationError'); }
   if (!input.eng_title) { util.error('eng_title is required', 'ValidationError'); }

   const now = util.time.nowISO8601();

   const expressionParts = [];
   const expressionNames = {};
   const expressionValues = {};

   // Always update eng_title
   expressionParts.push('#eng_title = :eng_title');
   expressionNames['#eng_title'] = 'eng_title';
   expressionValues[':eng_title'] = input.eng_title;

   // Optional fields
   if (input.eng_description !== undefined) {
      expressionParts.push('#eng_description = :eng_description');
      expressionNames['#eng_description'] = 'eng_description';
      expressionValues[':eng_description'] = input.eng_description;
   }
   if (input.bc_title !== undefined) {
      expressionParts.push('#bc_title = :bc_title');
      expressionNames['#bc_title'] = 'bc_title';
      expressionValues[':bc_title'] = input.bc_title;
   }
   if (input.bc_description !== undefined) {
      expressionParts.push('#bc_description = :bc_description');
      expressionNames['#bc_description'] = 'bc_description';
      expressionValues[':bc_description'] = input.bc_description;
   }
   if (input.ak_title !== undefined) {
      expressionParts.push('#ak_title = :ak_title');
      expressionNames['#ak_title'] = 'ak_title';
      expressionValues[':ak_title'] = input.ak_title;
   }
   if (input.ak_description !== undefined) {
      expressionParts.push('#ak_description = :ak_description');
      expressionNames['#ak_description'] = 'ak_description';
      expressionValues[':ak_description'] = input.ak_description;
   }

   // Always update timestamps
   expressionParts.push('#updated = :updated');
   expressionParts.push('#updatedAt = :updatedAt');
   expressionNames['#updated'] = 'updated';
   expressionNames['#updatedAt'] = 'updatedAt';
   expressionValues[':updated'] = now;
   expressionValues[':updatedAt'] = now;

   return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({ id: input.id }),
      update: {
         expression: 'SET ' + expressionParts.join(', '),
         expressionNames: expressionNames,
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
