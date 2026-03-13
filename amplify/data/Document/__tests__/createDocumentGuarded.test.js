import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@aws-appsync/utils', () => ({
   util: {
      autoId: vi.fn(() => 'mock-id'),
      time: { nowISO8601: vi.fn(() => '2024-01-01T00:00:00.000Z') },
      error: vi.fn((message, type) => { throw new Error(`${type}: ${message}`); }),
      dynamodb: {
         toMapValues: vi.fn((obj) => obj),
      },
   },
}));

import { request, response } from '../createDocumentGuarded.js';

describe('createDocumentGuarded', () => {
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request - Required Field Validation', () => {
      it('validates eng.title is required', () => {
         const ctx = { arguments: { input: { eng: { description: 'Desc' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         expect(() => request(ctx)).toThrow('ValidationError: eng.title is required');
      });

      it('validates eng object is required', () => {
         const ctx = { arguments: { input: { authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         expect(() => request(ctx)).toThrow('ValidationError: eng.title is required');
      });

      it('validates authorId is required', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         expect(() => request(ctx)).toThrow('ValidationError: authorId is required');
      });

      it('validates docOwnerUserId is required', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         expect(() => request(ctx)).toThrow('ValidationError: docOwnerUserId is required');
      });

      it('validates boxXbiisId is required', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', fileKey: 'f1', version: 1 } } };
         expect(() => request(ctx)).toThrow('ValidationError: boxXbiisId is required');
      });

      it('validates fileKey is required', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', version: 1 } } };
         expect(() => request(ctx)).toThrow('ValidationError: fileKey is required');
      });

      it('validates version is required', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: version is required');
      });
   });

   describe('request - Version Validation', () => {
      it('validates version must be >= 0', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: -1 } } };
         expect(() => request(ctx)).toThrow('ValidationError: version must be >= 0');
      });

      it('accepts version = 0', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 0 } } };
         const result = request(ctx);
         expect(result.attributeValues.version).toBe(0);
      });
   });

   describe('request - Content Interface Structure', () => {
      it('creates minimal valid input with eng.title only', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.eng).toEqual({ title: 'Title' });
         expect(result.attributeValues.bc).toBeUndefined();
         expect(result.attributeValues.ak).toBeUndefined();
      });

      it('creates full eng Summary', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title', description: 'Desc' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.eng).toEqual({ title: 'Title', description: 'Desc' });
      });

      it('creates BC orthography with title only', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, bc: { title: 'BC Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.bc).toEqual({ title: 'BC Title' });
      });

      it('creates BC orthography with title and description', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, bc: { title: 'BC Title', description: 'BC Desc' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.bc).toEqual({ title: 'BC Title', description: 'BC Desc' });
      });

      it('creates AK orthography with title only', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, ak: { title: 'AK Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.ak).toEqual({ title: 'AK Title' });
      });

      it('creates AK orthography with title and description', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, ak: { title: 'AK Title', description: 'AK Desc' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.ak).toEqual({ title: 'AK Title', description: 'AK Desc' });
      });

      it('creates all three orthographies', () => {
         const ctx = {
            arguments: {
               input: {
                  eng: { title: 'Eng Title', description: 'Eng Desc' },
                  bc: { title: 'BC Title', description: 'BC Desc' },
                  ak: { title: 'AK Title', description: 'AK Desc' },
                  authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1
               }
            }
         };
         const result = request(ctx);
         expect(result.attributeValues.eng).toEqual({ title: 'Eng Title', description: 'Eng Desc' });
         expect(result.attributeValues.bc).toEqual({ title: 'BC Title', description: 'BC Desc' });
         expect(result.attributeValues.ak).toEqual({ title: 'AK Title', description: 'AK Desc' });
      });

      it('creates BC with description only', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, bc: { description: 'BC Desc' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.bc).toEqual({ description: 'BC Desc' });
      });

      it('creates AK with description only', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, ak: { description: 'AK Desc' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.ak).toEqual({ description: 'AK Desc' });
      });
   });

   describe('request - Field Mapping', () => {
      it('maps authorId to documentAuthorId', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'author-123', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.documentAuthorId).toBe('author-123');
      });

      it('maps docOwnerUserId to documentContentOwnerUserId', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'owner-123', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.documentContentOwnerUserId).toBe('owner-123');
      });

      it('maps boxXbiisId to documentBoxXbiisId', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'box-123', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.documentBoxXbiisId).toBe('box-123');
      });

      it('maps all field mappings', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.documentAuthorId).toBe('a1');
         expect(result.attributeValues.documentContentOwnerUserId).toBe('u1');
         expect(result.attributeValues.documentBoxXbiisId).toBe('b1');
      });
   });

   describe('request - ID and Timestamp Generation', () => {
      it('auto-generates ID when not provided', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.key).toEqual({ id: 'mock-id' });
      });

      it('uses provided ID', () => {
         const ctx = { arguments: { input: { id: 'custom-id', eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.key).toEqual({ id: 'custom-id' });
         expect(result.attributeValues.id).toBe('custom-id');
      });

      it('generates created and updated timestamps', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.created).toBe('2024-01-01T00:00:00.000Z');
         expect(result.attributeValues.updated).toBe('2024-01-01T00:00:00.000Z');
      });
   });

   describe('request - DynamoDB Operation Structure', () => {
      it('creates PutItem operation with all attributes', () => {
         const ctx = {
            arguments: {
               input: {
                  eng: { title: 'Title', description: 'Desc' },
                  bc: { title: 'BC', description: 'BC Desc' },
                  ak: { title: 'AK', description: 'AK Desc' },
                  authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1',
                  fileKey: 'f1', fileHash: 'hash1', type: 'pdf', version: 1, keywords: ['k1', 'k2']
               }
            }
         };
         const result = request(ctx);
         expect(result.operation).toBe('PutItem');
         expect(result.attributeValues.__typename).toBe('Document');
         expect(result.attributeValues).toHaveProperty('id');
         expect(result.attributeValues).toHaveProperty('eng');
         expect(result.attributeValues).toHaveProperty('bc');
         expect(result.attributeValues).toHaveProperty('ak');
         expect(result.attributeValues).toHaveProperty('documentAuthorId');
         expect(result.attributeValues).toHaveProperty('documentContentOwnerUserId');
         expect(result.attributeValues).toHaveProperty('documentBoxXbiisId');
         expect(result.attributeValues).toHaveProperty('fileKey');
         expect(result.attributeValues).toHaveProperty('fileHash');
         expect(result.attributeValues).toHaveProperty('created');
         expect(result.attributeValues).toHaveProperty('updated');
         expect(result.attributeValues).toHaveProperty('type');
         expect(result.attributeValues).toHaveProperty('version');
         expect(result.attributeValues).toHaveProperty('keywords');
      });

      it('includes condition to prevent overwriting', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', version: 1 } } };
         const result = request(ctx);
         expect(result.condition).toEqual({
            expression: 'attribute_not_exists(#id)',
            expressionNames: { '#id': 'id' },
         });
      });
   });

   describe('request - Optional Fields', () => {
      it('includes optional fileHash', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', fileHash: 'hash123', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.fileHash).toBe('hash123');
      });

      it('includes optional type', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', type: 'application/pdf', version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.type).toBe('application/pdf');
      });

      it('includes optional keywords', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' }, authorId: 'a1', docOwnerUserId: 'u1', boxXbiisId: 'b1', fileKey: 'f1', keywords: ['word1', 'word2'], version: 1 } } };
         const result = request(ctx);
         expect(result.attributeValues.keywords).toEqual(['word1', 'word2']);
      });
   });

   describe('response', () => {
      it('returns result when no error', () => {
         const ctx = { result: { id: 'test-id', eng: { title: 'Title' } } };
         expect(response(ctx)).toEqual({ id: 'test-id', eng: { title: 'Title' } });
      });

      it('throws error when ctx.error present', () => {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
