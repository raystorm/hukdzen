import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.name)        { util.error('name is required', 'ValidationError'); }
   if (!input.ownerUserId) { util.error('ownerUserId is required', 'ValidationError'); }
   if (!input.purpose)     { util.error('purpose is required', 'ValidationError'); }
   if (!input.defaultRole) { util.error('defaultRole is required', 'ValidationError'); }
   if (input.purpose === 'DEFAULT') { util.error('Cannot create DEFAULT purpose boxes', 'ValidationError'); }

   const id  = input.id || util.autoId();
   const now = util.time.nowISO8601();

   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id }),
      attributeValues: util.dynamodb.toMapValues({
         __typename:  'Xbiis',
         id:          id,
         name:        input.name,
         ownerUserId: input.ownerUserId,
         purpose:     input.purpose,
         defaultRole: input.defaultRole,
         waa:         input.waa,
         createdAt:   now,
         updatedAt:   now,
      }),
      condition: {
         expression:      'attribute_not_exists(#id)',
         expressionNames: { '#id': 'id' },
      },
   };
}

export function response(ctx)
{
   if (ctx.error) { util.error(ctx.error.message, ctx.error.type); }
   return ctx.result;
}
