export function request(ctx) {
   const { status, denialReason, boxRequestApprovedById, boxRequestCreatedBoxId } = ctx.args.input;
   
   if (status === 'DENIED' && !denialReason) {
      util.error('denialReason is required when status is DENIED', 'ValidationError');
   }
   
   if (status === 'APPROVED') {
      if (!boxRequestApprovedById) {
         util.error('approvedBy is required when status is APPROVED', 'ValidationError');
      }
      if (!boxRequestCreatedBoxId) {
         util.error('createdBox is required when status is APPROVED', 'ValidationError');
      }
   }
   
   return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({ id: ctx.args.input.id }),
      update: {
         expression: 'SET #status = :status, #denialReason = :denialReason, #approvedBy = :approvedBy, #createdBox = :createdBox',
         expressionNames: {
            '#status': 'status',
            '#denialReason': 'denialReason',
            '#approvedBy': 'boxRequestApprovedById',
            '#createdBox': 'boxRequestCreatedBoxId',
         },
         expressionValues: util.dynamodb.toMapValues({
            ':status': status,
            ':denialReason': denialReason,
            ':approvedBy': boxRequestApprovedById,
            ':createdBox': boxRequestCreatedBoxId,
         }),
      },
   };
}

export function response(ctx) {
   return ctx.result;
}
