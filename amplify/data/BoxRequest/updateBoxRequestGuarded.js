import { util } from '@aws-appsync/utils';

export function request(ctx)
{
   const { input } = ctx.arguments;

   if (!input.id) { util.error('id is required', 'ValidationError'); }
   if (!input.requestedName) { util.error('requestedName is required', 'ValidationError'); }
   if (!input.requestReason) { util.error('requestReason is required', 'ValidationError'); }
   if (!input.status) { util.error('status is required', 'ValidationError'); }
   if (!input.createdByUserId) { util.error('createdByUserId is required', 'ValidationError'); }

   if (input.status === 'DENIED' && !input.denialReason)
   { util.error('denialReason is required when status is DENIED', 'ValidationError'); }

   if (input.status === 'APPROVED' && !input.approvedByUserId)
   { util.error('approvedByUserId is required when status is APPROVED', 'ValidationError'); }

   if (input.status === 'APPROVED' && !input.createdBoxId)
   { util.error('createdBoxId is required when status is APPROVED', 'ValidationError'); }

   const now = util.time.nowISO8601();

   return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({ id: input.id }),
      update: {
         expression: 'SET #requestedName = :requestedName, #requestReason = :requestReason, #status = :status, #denialReason = :denialReason, #createdById = :createdById, #approvedById = :approvedById, #createdBoxId = :createdBoxId, #updatedAt = :updatedAt',
         expressionNames: {
            '#requestedName': 'requestedName',
            '#requestReason': 'requestReason',
            '#status':        'status',
            '#denialReason':  'denialReason',
            '#createdById':   'boxRequestCreatedById',
            '#approvedById':  'boxRequestApprovedById',
            '#createdBoxId':  'boxRequestCreatedBoxId',
            '#updatedAt':     'updatedAt',
         },
         expressionValues: util.dynamodb.toMapValues({
            ':requestedName': input.requestedName,
            ':requestReason': input.requestReason,
            ':status':        input.status,
            ':denialReason':  input.denialReason,
            ':createdById':   input.createdByUserId,
            ':approvedById':  input.approvedByUserId,
            ':createdBoxId':  input.createdBoxBoxId,
            ':updatedAt':     now,
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
