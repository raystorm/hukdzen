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

import { request, response } from '../createCollectionItemGuarded.js';

describe('createCollectionItemGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates collectionCollectionId is required', () =>
      {
         const ctx = { arguments: { input: { documentDetailsId: 'doc-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: collectionCollectionId is required');
      });

      it('validates exactly one of documentDetailsId or childCollectionId - both provided', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-1',
                  documentDetailsId:      'doc-1',
                  childCollectionId:      'coll-2',
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
                  collectionCollectionId: 'coll-1',
               }
            }
         };
         expect(() => request(ctx)).toThrow('ValidationError: Exactly one of documentDetailsId or childCollectionId must be set');
      });

      it('creates PutItem operation with document reference', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-123',
                  documentDetailsId:      'doc-456',
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues).toMatchObject({
            __typename:     'CollectionItem',
            id:             'mock-id',
            collectionID:   'coll-123',
            documentID:     'doc-456',
            childCollectionID: null,
            created:        '2024-01-01T00:00:00.000Z',
            createdAt:      '2024-01-01T00:00:00.000Z',
            updatedAt:      '2024-01-01T00:00:00.000Z',
         });
      });

      it('creates PutItem operation with child collection reference', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-123',
                  childCollectionId:      'coll-789',
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues).toMatchObject({
            __typename:        'CollectionItem',
            id:                'mock-id',
            collectionID:      'coll-123',
            documentID:        null,
            childCollectionID: 'coll-789',
            created:           '2024-01-01T00:00:00.000Z',
            createdAt:         '2024-01-01T00:00:00.000Z',
            updatedAt:         '2024-01-01T00:00:00.000Z',
         });
      });

      it('creates item with order', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-1',
                  documentDetailsId:      'doc-1',
                  order:                  5,
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.order).toBe(5);
      });

      it('uses provided id when present', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:                     'custom-id',
                  collectionCollectionId: 'coll-1',
                  documentDetailsId:      'doc-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.key).toEqual({ id: 'custom-id' });
         expect(result.attributeValues.id).toBe('custom-id');
      });

      it('maps collectionCollectionId to collectionID', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-123',
                  documentDetailsId:      'doc-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.collectionID).toBe('coll-123');
      });

      it('maps documentDetailsId to documentID', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-1',
                  documentDetailsId:      'doc-456',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.documentID).toBe('doc-456');
      });

      it('maps childCollectionId to childCollectionID', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-1',
                  childCollectionId:      'coll-789',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.childCollectionID).toBe('coll-789');
      });

      it('generates timestamps on create', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-1',
                  documentDetailsId:      'doc-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.created).toBe('2024-01-01T00:00:00.000Z');
         expect(result.attributeValues.createdAt).toBe('2024-01-01T00:00:00.000Z');
         expect(result.attributeValues.updatedAt).toBe('2024-01-01T00:00:00.000Z');
      });

      it('includes condition to prevent overwriting existing items', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  collectionCollectionId: 'coll-1',
                  documentDetailsId:      'doc-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.condition).toEqual({
            expression:      'attribute_not_exists(#id)',
            expressionNames: { '#id': 'id' },
         });
      });
   });

   describe('response', () =>
   {
      it('returns result when no error', () =>
      {
         const ctx = { result: { id: 'test-id', collectionID: 'coll-1' } };
         expect(response(ctx)).toEqual({ id: 'test-id', collectionID: 'coll-1' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
