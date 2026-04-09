import { util } from '@aws-appsync/utils';

export function request(ctx) {
   const { input } = ctx.arguments;

   if (!input.id) { util.error('id is required', 'ValidationError'); }
   if (input.version !== undefined && input.version < 0) {
      util.error('version must be >= 0', 'ValidationError');
   }

   const expNames = { '#id': 'id' };
   const expValues = {};
   const setExpressions = [];

   if (input.eng !== undefined) {
      setExpressions.push('#eng = :eng');
      expNames['#eng'] = 'eng';
      expValues[':eng'] = input.eng;
   }

   if (input.bc !== undefined) {
      setExpressions.push('#bc = :bc');
      expNames['#bc'] = 'bc';
      expValues[':bc'] = input.bc;
   }

   if (input.ak !== undefined) {
      setExpressions.push('#ak = :ak');
      expNames['#ak'] = 'ak';
      expValues[':ak'] = input.ak;
   }

   if (input.authorId !== undefined) {
      setExpressions.push('#documentAuthorId = :documentAuthorId');
      expNames['#documentAuthorId'] = 'documentAuthorId';
      expValues[':documentAuthorId'] = input.authorId;
   }

   if (input.docOwnerUserId !== undefined) {
      setExpressions.push('#documentContentOwnerUserId = :documentContentOwnerUserId');
      expNames['#documentContentOwnerUserId'] = 'documentContentOwnerUserId';
      expValues[':documentContentOwnerUserId'] = input.docOwnerUserId;
   }

   if (input.boxBoxId !== undefined) {
      setExpressions.push('#documentBoxBoxId = :documentBoxBoxId');
      expNames['#documentBoxBoxId'] = 'documentBoxBoxId';
      expValues[':documentBoxBoxId'] = input.boxBoxId;
   }

   if (input.fileKey !== undefined) {
      setExpressions.push('#fileKey = :fileKey');
      expNames['#fileKey'] = 'fileKey';
      expValues[':fileKey'] = input.fileKey;
   }

   if (input.fileHash !== undefined) {
      setExpressions.push('#fileHash = :fileHash');
      expNames['#fileHash'] = 'fileHash';
      expValues[':fileHash'] = input.fileHash;
   }

   if (input.type !== undefined) {
      setExpressions.push('#type = :type');
      expNames['#type'] = 'type';
      expValues[':type'] = input.type;
   }

   if (input.version !== undefined) {
      setExpressions.push('#version = :version');
      expNames['#version'] = 'version';
      expValues[':version'] = input.version;
   }

   if (input.keywords !== undefined) {
      setExpressions.push('#keywords = :keywords');
      expNames['#keywords'] = 'keywords';
      expValues[':keywords'] = input.keywords;
   }

   const now = util.time.nowISO8601();
   setExpressions.push('#updated = :updated');
   expNames['#updated'] = 'updated';
   expValues[':updated'] = now;

   // Build condition expression
   let conditionExpression = 'attribute_exists(#id)';
   
   // If version is being updated, ensure it doesn't decrease
   if (input.version !== undefined) {
      conditionExpression += ' AND (#version <= :newVersion OR attribute_not_exists(#version))';
      expNames['#version'] = 'version';
      expValues[':newVersion'] = input.version;
   }

   return {
      operation: 'UpdateItem',
      key: util.dynamodb.toMapValues({ id: input.id }),
      update: {
         expression: `SET ${setExpressions.join(', ')}`,
         expressionNames: expNames,
         expressionValues: util.dynamodb.toMapValues(expValues),
      },
      condition: {
         expression: conditionExpression,
      },
   };
}

export function response(ctx) {
   if (ctx.error) { util.error(ctx.error.message, ctx.error.type); }
   return ctx.result;
}
