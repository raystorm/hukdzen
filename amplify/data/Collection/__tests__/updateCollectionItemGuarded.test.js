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

import { request, response } from '../updateCollectionItemGuarded.js';

describe('updateCollectionItemGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates id is required', () =>
      {
         const ctx = { arguments: { input: { documentDetailsId: 'doc-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: id is required');
      });

      it('validates exactly one of documentDetailsId or childCollectionId - both provided', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:                'item-1',
                  documentDetailsId: 'doc-1',
                  childCollectionId: 'coll-2',
               }
            }
         };
         expect(() => request(ctx)).toThrow('ValidationError: Exactly one of documentDetailsId or childCollectionId must be set');
      });

      it('validates exactly one of documentDetailsId or childCollectionId - neither provided', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id: 'item-1',
               }
            }
         };
         expect(() => request(ctx)).toThrow('ValidationError: Exactly one of documentDetailsId or childCollectionId must be set');
      });

      it('updates item to reference document', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:                'item-1',
                  documentDetailsId: 'doc-456',
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'item-1' });
         expect(result.update.expression).toContain('#documentID = :documentID');
         expect(result.update.expression).toContain('#childCollectionID = :childCollectionID');
         expect(result.update.expressionValues[':documentID']).toBe('doc-456');
         expect(result.update.expressionValues[':childCollectionID']).toBe(null);
      });

      it('updates item to reference child collection', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:                'item-1',
                  childCollectionId: 'coll-789',
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'item-1' });
         expect(result.update.expression).toContain('#childCollectionID = :childCollectionID');
         expect(result.update.expression).toContain('#documentID = :documentID');
         expect(result.update.expressionValues[':childCollectionID']).toBe('coll-789');
         expect(result.update.expressionValues[':documentID']).toBe(null);
      });

      it('updates item order', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:                'item-1',
                  documentDetailsId: 'doc-1',
                  order:             10,
               }
            }
         };

         const result = request(ctx);

         expect(result.update.expression).toContain('#order = :order');
         expect(result.update.expressionValues[':order']).toBe(10);
      });

      it('updates timestamp on update', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:                'item-1',
                  documentDetailsId: 'doc-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.update.expressionValues[':updatedAt']).toBe('2024-01-01T00:00:00.000Z');
      });

      it('includes condition to ensure item exists', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:                'item-1',
                  documentDetailsId: 'doc-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.condition).toEqual({
            expression:      'attribute_exists(#id)',
            expressionNames: { '#id': 'id' },
         });
      });
   });

   describe('response', () =>
   {
      it('returns result when no error', () =>
      {
         const ctx = { result: { id: 'item-1', documentID: 'doc-1' } };
         expect(response(ctx)).toEqual({ id: 'item-1', documentID: 'doc-1' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'Item not found', type: 'ConditionalCheckFailedException' } };
         expect(() => response(ctx)).toThrow('ConditionalCheckFailedException: Item not found');
      });
   });
});
