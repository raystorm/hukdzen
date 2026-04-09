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

import { request, response } from '../updateCollectionGuarded.js';

describe('updateCollectionGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates id is required', () =>
      {
         const ctx = { arguments: { input: { eng: { title: 'Test Collection' } } } };
         expect(() => request(ctx)).toThrow('ValidationError: id is required');
      });

      it('validates eng.title cannot be empty when provided', () =>
      {
         const ctx = { arguments: { input: { id: 'test-id', eng: {} } } };
         expect(() => request(ctx)).toThrow('ValidationError: eng.title is required');
      });

      it('validates eng.title cannot be whitespace-only', () =>
      {
         const ctx = { arguments: { input: { id: 'test-id', eng: { title: '   ' } } } };
         expect(() => request(ctx)).toThrow('ValidationError: eng.title is required');
      });

      it('validates collectionOwnerUserId cannot be empty when provided', () =>
      {
         const ctx = { arguments: { input: { id: 'test-id', collectionOwnerUserId: '' } } };
         expect(() => request(ctx)).toThrow('ValidationError: collectionOwnerUserId is required');
      });

      it('validates collectionOwnerUserId cannot be whitespace-only', () =>
      {
         const ctx = { arguments: { input: { id: 'test-id', collectionOwnerUserId: '   ' } } };
         expect(() => request(ctx)).toThrow('ValidationError: collectionOwnerUserId is required');
      });

      it('validates boxBoxId cannot be empty when provided', () =>
      {
         const ctx = { arguments: { input: { id: 'test-id', boxBoxId: '' } } };
         expect(() => request(ctx)).toThrow('ValidationError: boxBoxId is required');
      });

      it('validates boxBoxId cannot be whitespace-only', () =>
      {
         const ctx = { arguments: { input: { id: 'test-id', boxBoxId: '   ' } } };
         expect(() => request(ctx)).toThrow('ValidationError: boxBoxId is required');
      });

      it('allows update without providing optional fields', () =>
      {
         const ctx = { arguments: { input: { id: 'test-id' } } };
         const result = request(ctx);
         expect(result.operation).toBe('UpdateItem');
      });


      it('creates UpdateItem operation with all fields', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:             'coll-1',
                  eng: {
                     title:       'Updated Collection',
                     description: 'Updated description',
                  },
                  bc: {
                     title:       'BC Title',
                     description: 'BC description',
                  },
                  ak: {
                     title:       'AK Title',
                     description: 'AK description',
                  },
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'coll-1' });
         expect(result.update.expression).toBe(
            'SET #eng = :eng, #bc = :bc, #ak = :ak, #updated = :updated, #updatedAt = :updatedAt'
         );
         expect(result.update.expressionValues).toMatchObject({
            ':eng': {
               title:       'Updated Collection',
               description: 'Updated description',
            },
            ':bc': {
               title:       'BC Title',
               description: 'BC description',
            },
            ':ak': {
               title:       'AK Title',
               description: 'AK description',
            },
            ':updated':        '2024-01-01T00:00:00.000Z',
            ':updatedAt':      '2024-01-01T00:00:00.000Z',
         });
      });

      it('creates UpdateItem operation with only eng field', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:        'coll-1',
                  eng: { title: 'Updated Collection' },
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'coll-1' });
         expect(result.update.expression).toBe(
            'SET #eng = :eng, #updated = :updated, #updatedAt = :updatedAt'
         );
         expect(result.update.expressionValues).toMatchObject({
            ':eng': { title: 'Updated Collection' },
            ':updated':   '2024-01-01T00:00:00.000Z',
            ':updatedAt': '2024-01-01T00:00:00.000Z',
         });
      });

      it('updates timestamps on update', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:        'coll-1',
                  eng: { title: 'Test' },
               }
            }
         };

         const result = request(ctx);

         expect(result.update.expressionValues[':updated']).toBe('2024-01-01T00:00:00.000Z');
         expect(result.update.expressionValues[':updatedAt']).toBe('2024-01-01T00:00:00.000Z');
      });

      it('includes condition to ensure item exists', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:        'coll-1',
                  eng: { title: 'Test' },
               }
            }
         };

         const result = request(ctx);

         expect(result.condition).toEqual({
            expression:      'attribute_exists(#id)',
            expressionNames: { '#id': 'id' },
         });
      });

      it('handles optional bc and ak Summary fields', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:  'coll-1',
                  eng: { title: 'Test' },
                  bc:  { title: 'BC Test' },
               }
            }
         };

         const result = request(ctx);

         expect(result.update.expression).toBe(
            'SET #eng = :eng, #bc = :bc, #updated = :updated, #updatedAt = :updatedAt'
         );
         expect(result.update.expressionValues[':eng']).toEqual({ title: 'Test' });
         expect(result.update.expressionValues[':bc']).toEqual({ title: 'BC Test' });
      });
   });

   describe('response', () =>
   {
      it('returns result when no error', () =>
      {
         const ctx = { result: { id: 'coll-1', eng: { title: 'Updated Collection' } } };
         expect(response(ctx)).toEqual({ id: 'coll-1', eng: { title: 'Updated Collection' } });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'Item not found', type: 'ConditionalCheckFailedException' } };
         expect(() => response(ctx)).toThrow('ConditionalCheckFailedException: Item not found');
      });
   });
});
