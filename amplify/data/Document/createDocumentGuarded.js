import { util } from '@aws-appsync/utils';

export function request(ctx) {
   const { input } = ctx.arguments;

   if (!input.eng || !input.eng.title) { util.error('eng.title is required', 'ValidationError'); }
   if (!input.authorId) { util.error('authorId is required', 'ValidationError'); }
   if (!input.docOwnerUserId) { util.error('docOwnerUserId is required', 'ValidationError'); }
   if (!input.boxBoxId) { util.error('boxBoxId is required', 'ValidationError'); }
   if (!input.fileKey) { util.error('fileKey is required', 'ValidationError'); }
   if (input.version === undefined || input.version === null) {
      util.error('version is required', 'ValidationError');
   }
   if (input.version < 0) {
      util.error('version must be >= 0', 'ValidationError');
   }

   const id  = input.id || util.autoId();
   const now = util.time.nowISO8601();

   return {
      operation: 'PutItem',
      key: util.dynamodb.toMapValues({ id }),
      attributeValues: util.dynamodb.toMapValues({
         __typename:                    'Document',
         id:                            id,
         eng:                           input.eng,
         bc:                            input.bc,
         ak:                            input.ak,
         documentAuthorId:              input.authorId,
         documentContentOwnerUserId:    input.docOwnerUserId,
         documentBoxBoxId:            input.boxBoxId,
         fileKey:                       input.fileKey,
         fileHash:                      input.fileHash,
         created:                       now,
         updated:                       now,
         type:                          input.type,
         version:                       input.version,
         keywords:                      input.keywords,
      }),
      condition: {
         expression:      'attribute_not_exists(#id)',
         expressionNames: { '#id': 'id' },
      },
   };
}

export function response(ctx) {
   if (ctx.error) { util.error(ctx.error.message, ctx.error.type); }
   return ctx.result;
}
