import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@aws-appsync/utils', () => ({
   util: {
      time: { nowISO8601: vi.fn(() => '2024-01-01T00:00:00.000Z') },
      error: vi.fn((message, type) => { throw new Error(`${type}: ${message}`); }),
      dynamodb: {
         toMapValues: vi.fn((obj) => obj),
      },
   },
}));

import { request, response } from '../updateDocumentGuarded.js';

describe('updateDocumentGuarded', () => {
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request - Required Field Validation', () => {
      it('validates id is required', () => {
         const ctx = { arguments: { input: { eng: { title: 'Title' } } } };
         expect(() => request(ctx)).toThrow('ValidationError: id is required');
      });

      it('creates UpdateItem operation when id provided', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { title: 'Title' } } } };
         const result = request(ctx);
         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'doc-1' });
      });
   });

   describe('request - Version Validation', () => {
      it('validates version must be >= 0', () => {
         const ctx = { arguments: { input: { id: 'doc-1', version: -1 } } };
         expect(() => request(ctx)).toThrow('ValidationError: version must be >= 0');
      });

      it('accepts version = 0', () => {
         const ctx = { arguments: { input: { id: 'doc-1', version: 0 } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#version = :version');
         expect(result.update.expressionValues[':version']).toBe(0);
      });

      it('adds condition to prevent version from decreasing when version is updated', () => {
         const ctx = { arguments: { input: { id: 'doc-1', version: 2 } } };
         const result = request(ctx);
         expect(result.condition.expression).toContain('attribute_exists(#id) AND (#version <= :newVersion OR attribute_not_exists(#version))');
         expect(result.update.expressionValues[':newVersion']).toBe(2);
      });

      it('does not add version condition when version is not being updated', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { title: 'Title' } } } };
         const result = request(ctx);
         expect(result.condition.expression).toBe('attribute_exists(#id)');
         expect(result.update.expressionValues).not.toHaveProperty(':newVersion');
      });
   });

   describe('request - Partial Updates Content Interface', () => {
      it('updates eng Summary', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { title: 'New Title' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#eng = :eng');
         expect(result.update.expressionValues[':eng']).toEqual({ title: 'New Title' });
      });

      it('updates eng with both title and description', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { title: 'New Title', description: 'New Desc' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#eng = :eng');
         expect(result.update.expressionValues[':eng']).toEqual({ title: 'New Title', description: 'New Desc' });
      });

      it('updates eng with description only', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { description: 'New Desc' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#eng = :eng');
         expect(result.update.expressionValues[':eng']).toEqual({ description: 'New Desc' });
      });

      it('adds BC orthography', () => {
         const ctx = { arguments: { input: { id: 'doc-1', bc: { title: 'BC Title', description: 'BC Desc' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#bc = :bc');
         expect(result.update.expressionValues[':bc']).toEqual({ title: 'BC Title', description: 'BC Desc' });
      });

      it('updates BC title only', () => {
         const ctx = { arguments: { input: { id: 'doc-1', bc: { title: 'BC Title' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#bc = :bc');
         expect(result.update.expressionValues[':bc']).toEqual({ title: 'BC Title' });
      });

      it('updates BC description only', () => {
         const ctx = { arguments: { input: { id: 'doc-1', bc: { description: 'BC Desc' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#bc = :bc');
         expect(result.update.expressionValues[':bc']).toEqual({ description: 'BC Desc' });
      });

      it('adds AK orthography', () => {
         const ctx = { arguments: { input: { id: 'doc-1', ak: { title: 'AK Title', description: 'AK Desc' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#ak = :ak');
         expect(result.update.expressionValues[':ak']).toEqual({ title: 'AK Title', description: 'AK Desc' });
      });

      it('updates AK title only', () => {
         const ctx = { arguments: { input: { id: 'doc-1', ak: { title: 'AK Title' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#ak = :ak');
         expect(result.update.expressionValues[':ak']).toEqual({ title: 'AK Title' });
      });

      it('updates AK description only', () => {
         const ctx = { arguments: { input: { id: 'doc-1', ak: { description: 'AK Desc' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#ak = :ak');
         expect(result.update.expressionValues[':ak']).toEqual({ description: 'AK Desc' });
      });

      it('updates multiple orthographies', () => {
         const ctx = {
            arguments: {
               input: {
                  id: 'doc-1',
                  eng: { title: 'Eng Title' },
                  bc: { title: 'BC Title', description: 'BC Desc' },
                  ak: { description: 'AK Desc' }
               }
            }
         };
         const result = request(ctx);
         expect(result.update.expression).toContain('#eng = :eng');
         expect(result.update.expression).toContain('#bc = :bc');
         expect(result.update.expression).toContain('#ak = :ak');
         expect(result.update.expressionValues[':eng']).toEqual({ title: 'Eng Title' });
         expect(result.update.expressionValues[':bc']).toEqual({ title: 'BC Title', description: 'BC Desc' });
         expect(result.update.expressionValues[':ak']).toEqual({ description: 'AK Desc' });
      });
   });

   describe('request - Partial Updates Other Fields', () => {
      it('updates fileKey', () => {
         const ctx = { arguments: { input: { id: 'doc-1', fileKey: 'new-key' } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#fileKey = :fileKey');
         expect(result.update.expressionValues[':fileKey']).toBe('new-key');
      });

      it('updates fileHash', () => {
         const ctx = { arguments: { input: { id: 'doc-1', fileHash: 'new-hash' } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#fileHash = :fileHash');
         expect(result.update.expressionValues[':fileHash']).toBe('new-hash');
      });

      it('updates version', () => {
         const ctx = { arguments: { input: { id: 'doc-1', version: 2 } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#version = :version');
         expect(result.update.expressionValues[':version']).toBe(2);
      });

      it('updates type', () => {
         const ctx = { arguments: { input: { id: 'doc-1', type: 'application/pdf' } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#type = :type');
         expect(result.update.expressionValues[':type']).toBe('application/pdf');
      });

      it('updates keywords', () => {
         const ctx = { arguments: { input: { id: 'doc-1', keywords: ['k1', 'k2'] } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#keywords = :keywords');
         expect(result.update.expressionValues[':keywords']).toEqual(['k1', 'k2']);
      });
   });

   describe('request - Field Mapping in Updates', () => {
      it('maps authorId to documentAuthorId', () => {
         const ctx = { arguments: { input: { id: 'doc-1', authorId: 'author-123' } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#documentAuthorId = :documentAuthorId');
         expect(result.update.expressionValues[':documentAuthorId']).toBe('author-123');
      });

      it('maps docOwnerUserId to documentContentOwnerUserId', () => {
         const ctx = { arguments: { input: { id: 'doc-1', docOwnerUserId: 'user-123' } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#documentContentOwnerUserId = :documentContentOwnerUserId');
         expect(result.update.expressionValues[':documentContentOwnerUserId']).toBe('user-123');
      });

      it('maps boxBoxId to documentBoxBoxId', () => {
         const ctx = { arguments: { input: { id: 'doc-1', boxBoxId: 'box-123' } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#documentBoxBoxId = :documentBoxBoxId');
         expect(result.update.expressionValues[':documentBoxBoxId']).toBe('box-123');
      });

      it('maps all field mappings', () => {
         const ctx = {
            arguments: {
               input: {
                  id: 'doc-1',
                  authorId: 'a1',
                  docOwnerUserId: 'u1',
                  boxBoxId: 'b1'
               }
            }
         };
         const result = request(ctx);
         expect(result.update.expression).toContain('#documentAuthorId = :documentAuthorId');
         expect(result.update.expression).toContain('#documentContentOwnerUserId = :documentContentOwnerUserId');
         expect(result.update.expression).toContain('#documentBoxBoxId = :documentBoxBoxId');
      });
   });

   describe('request - Timestamp Updates', () => {
      it('sets updated timestamp', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { title: 'Title' } } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#updated = :updated');
         expect(result.update.expressionValues[':updated']).toBe('2024-01-01T00:00:00.000Z');
      });

      it('always sets updated timestamp even with no other fields', () => {
         const ctx = { arguments: { input: { id: 'doc-1' } } };
         const result = request(ctx);
         expect(result.update.expression).toBe('SET #updated = :updated');
         expect(result.update.expressionValues[':updated']).toBe('2024-01-01T00:00:00.000Z');
      });

      it('does not modify created timestamp', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { title: 'Title' } } } };
         const result = request(ctx);
         expect(result.update.expression).not.toContain('created');
         expect(result.update.expressionValues).not.toHaveProperty(':created');
      });
   });

   describe('request - DynamoDB Operation Structure', () => {
      it('creates UpdateItem operation structure', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { title: 'Title' }, fileKey: 'key1' } } };
         const result = request(ctx);
         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'doc-1' });
         expect(result.update).toHaveProperty('expression');
         expect(result.update).toHaveProperty('expressionNames');
         expect(result.update).toHaveProperty('expressionValues');
      });

      it('includes condition requiring item exists', () => {
         const ctx = { arguments: { input: { id: 'doc-1', eng: { title: 'Title' } } } };
         const result = request(ctx);
         expect(result.condition).toEqual({
            expression: 'attribute_exists(#id)',
         });
      });

      it('builds correct SET expression with multiple fields', () => {
         const ctx = {
            arguments: {
               input: {
                  id: 'doc-1',
                  eng: { title: 'Title' },
                  bc: { description: 'Desc' },
                  fileKey: 'key1',
                  version: 2
               }
            }
         };
         const result = request(ctx);
         expect(result.update.expression).toContain('SET ');
         expect(result.update.expression).toContain('#eng = :eng');
         expect(result.update.expression).toContain('#bc = :bc');
         expect(result.update.expression).toContain('#fileKey = :fileKey');
         expect(result.update.expression).toContain('#version = :version');
         expect(result.update.expression).toContain('#updated = :updated');
      });
   });

   describe('request - Complex Update Scenarios', () => {
      it('updates all fields at once', () => {
         const ctx = {
            arguments: {
               input: {
                  id: 'doc-1',
                  eng: { title: 'Eng', description: 'Eng Desc' },
                  bc: { title: 'BC', description: 'BC Desc' },
                  ak: { title: 'AK', description: 'AK Desc' },
                  authorId: 'a1',
                  docOwnerUserId: 'u1',
                  boxBoxId: 'b1',
                  fileKey: 'key1',
                  fileHash: 'hash1',
                  type: 'pdf',
                  version: 2,
                  keywords: ['k1', 'k2']
               }
            }
         };
         const result = request(ctx);
         expect(result.update.expressionValues[':eng']).toEqual({ title: 'Eng', description: 'Eng Desc' });
         expect(result.update.expressionValues[':bc']).toEqual({ title: 'BC', description: 'BC Desc' });
         expect(result.update.expressionValues[':ak']).toEqual({ title: 'AK', description: 'AK Desc' });
         expect(result.update.expressionValues[':documentAuthorId']).toBe('a1');
         expect(result.update.expressionValues[':documentContentOwnerUserId']).toBe('u1');
         expect(result.update.expressionValues[':documentBoxBoxId']).toBe('b1');
         expect(result.update.expressionValues[':fileKey']).toBe('key1');
         expect(result.update.expressionValues[':fileHash']).toBe('hash1');
         expect(result.update.expressionValues[':type']).toBe('pdf');
         expect(result.update.expressionValues[':version']).toBe(2);
         expect(result.update.expressionValues[':keywords']).toEqual(['k1', 'k2']);
      });

      it('handles null values for optional Summary objects', () => {
         const ctx = { arguments: { input: { id: 'doc-1', bc: null } } };
         const result = request(ctx);
         expect(result.update.expression).toContain('#bc = :bc');
         expect(result.update.expressionValues[':bc']).toBeNull();
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

      it('throws error for item not found', () => {
         const ctx = { error: { message: 'Item not found', type: 'ConditionalCheckFailedException' } };
         expect(() => response(ctx)).toThrow('ConditionalCheckFailedException: Item not found');
      });
   });
});
