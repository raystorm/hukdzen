import { util } from '@aws-appsync/utils';

function validateRequired(value, fieldName) {
   if (!value || (typeof value === 'string' && !value.trim())) {
      util.error(`${fieldName} is required`, 'ValidationError');
   }
}

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.id) { util.error('id is required', 'ValidationError'); }
   if (input.eng !== undefined) { validateRequired(input.eng?.title, 'eng.title'); }
   if (input.collectionOwnerUserId !== undefined) { validateRequired(input.collectionOwnerUserId, 'collectionOwnerUserId'); }
   if (input.boxBoxId !== undefined) { validateRequired(input.boxBoxId, 'boxBoxId'); }

   const now = util.time.nowISO8601();

   const expressionParts = [];
   const expressionNames = {};
   const expressionValues = {};

   if (input.eng !== undefined) {
      expressionParts.push('#eng = :eng');
      expressionNames['#eng'] = 'eng';
      expressionValues[':eng'] = input.eng;
   }

   if (input.bc !== undefined) {
      expressionParts.push('#bc = :bc');
      expressionNames['#bc'] = 'bc';
      expressionValues[':bc'] = input.bc;
   }

   if (input.ak !== undefined) {
      expressionParts.push('#ak = :ak');
      expressionNames['#ak'] = 'ak';
      expressionValues[':ak'] = input.ak;
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
