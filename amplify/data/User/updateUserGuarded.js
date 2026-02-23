import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.id)    { util.error('id is required', 'ValidationError'); }
   if (!input.name)  { util.error('name is required', 'ValidationError'); }
   if (!input.email) { util.error('email is required', 'ValidationError'); }

   const now = util.time.nowISO8601();

   return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({ id: input.id }),
      update: {
         expression: 'SET #name = :name, #clan = :clan, #waa = :waa, #email = :email, #isAdmin = :isAdmin, #emailPreferences = :emailPreferences, #updatedAt = :updatedAt',
         expressionNames: {
            '#name':             'name',
            '#clan':             'clan',
            '#waa':              'waa',
            '#email':            'email',
            '#isAdmin':          'isAdmin',
            '#emailPreferences': 'emailPreferences',
            '#updatedAt':        'updatedAt',
         },
         expressionValues: util.dynamodb.toMapValues({
            ':name':             input.name,
            ':clan':             input.clan,
            ':waa':              input.waa,
            ':email':            input.email,
            ':isAdmin':          input.isAdmin,
            ':emailPreferences': input.emailPreferences,
            ':updatedAt':        now,
         }),
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
