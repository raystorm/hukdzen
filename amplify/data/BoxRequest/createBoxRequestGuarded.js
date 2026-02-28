import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.requestedName) { util.error('requestedName is required', 'ValidationError'); }
   if (!input.requestReason) { util.error('requestReason is required', 'ValidationError'); }
   if (!input.status) { util.error('status is required', 'ValidationError'); }
   if (!input.createdByUserId) { util.error('createdByUserId is required', 'ValidationError'); }

   if (input.status === 'DENIED' && !input.denialReason)
   { util.error('denialReason is required when status is DENIED', 'ValidationError'); }

   if (input.status === 'APPROVED' && !input.approvedByUserId)
   { util.error('approvedByUserId is required when status is APPROVED', 'ValidationError'); }

   if (input.status === 'APPROVED' && !input.createdBoxXbiisId)
   { util.error('createdBoxXbiisId is required when status is APPROVED', 'ValidationError'); }

   const id  = input.id || util.autoId();
   const now = util.time.nowISO8601();

   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id }),
      attributeValues: util.dynamodb.toMapValues({
         __typename:                 'BoxRequest',
         id:                         id,
         requestedName:              input.requestedName,
         requestReason:              input.requestReason,
         status:                     input.status,
         denialReason:               input.denialReason,
         boxRequestCreatedById:      input.createdByUserId,
         boxRequestApprovedById:     input.approvedByUserId,
         boxRequestCreatedBoxId:     input.createdBoxXbiisId,
         createdAt:                  now,
         updatedAt:                  now,
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
