import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.name)  { util.error('name is required', 'ValidationError'); }
   if (!input.email) { util.error('email is required', 'ValidationError'); }

   const id  = input.id || util.autoId();
   const now = util.time.nowISO8601();

   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id }),
      attributeValues: util.dynamodb.toMapValues({
         __typename:       'User',
         id:               id,
         name:             input.name,
         clan:             input.clan,
         waa:              input.waa,
         email:            input.email,
         isAdmin:          input.isAdmin,
         emailPreferences: input.emailPreferences,
         createdAt:        now,
         updatedAt:        now,
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
