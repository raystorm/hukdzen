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

import { request, response } from '../createCollectionGuarded.js';

describe('createCollectionGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates eng_title is required', () =>
      {
         const ctx = { arguments: { input: { collectionOwnerUserId: 'user-1', boxXbiisId: 'box-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: eng.title is required');
      });

      it('validates eng.title is required when eng is provided but title is missing', () =>
      {
         const ctx = { arguments: { input: { eng: {}, collectionOwnerUserId: 'user-1', boxXbiisId: 'box-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: eng.title is required');
      });

      it('validates collectionOwnerUserId is required', () =>
      {
         const ctx = { arguments: { input: { eng: { title: 'Test Collection' }, boxXbiisId: 'box-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: collectionOwnerUserId is required');
      });

      it('validates boxXbiisId is required', () =>
      {
         const ctx = { arguments: { input: { eng: { title: 'Test Collection' }, collectionOwnerUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: boxXbiisId is required');
      });

      it('creates PutItem operation with all required fields', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  eng: {
                     title:       'Test Collection',
                     description: 'English description',
                  },
                  bc: {
                     title:       'BC Title',
                     description: 'BC description',
                  },
                  ak: {
                     title:       'AK Title',
                     description: 'AK description',
                  },
                  collectionOwnerUserId: 'user-123',
                  boxXbiisId:            'box-456',
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues).toMatchObject({
            __typename:                  'Collection',
            id:                          'mock-id',
            eng: {
               title:       'Test Collection',
               description: 'English description',
            },
            bc: {
               title:       'BC Title',
               description: 'BC description',
            },
            ak: {
               title:       'AK Title',
               description: 'AK description',
            },
            collectionContentOwnerUserId: 'user-123',
            collectionBoxId:             'box-456',
            created:                     '2024-01-01T00:00:00.000Z',
            updated:                     '2024-01-01T00:00:00.000Z',
            createdAt:                   '2024-01-01T00:00:00.000Z',
            updatedAt:                   '2024-01-01T00:00:00.000Z',
         });
      });

      it('uses provided id when present', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:                    'custom-id',
                  eng: { title: 'Test Collection' },
                  collectionOwnerUserId: 'user-1',
                  boxXbiisId:            'box-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.key).toEqual({ id: 'custom-id' });
         expect(result.attributeValues.id).toBe('custom-id');
      });

      it('maps collectionOwnerUserId to collectionCollectionOwnerId', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  eng: { title: 'Test' },
                  collectionOwnerUserId: 'user-123',
                  boxXbiisId:            'box-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.collectionContentOwnerUserId).toBe('user-123');
      });

      it('maps boxXbiisId to collectionBoxId', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  eng: { title: 'Test' },
                  collectionOwnerUserId: 'user-1',
                  boxXbiisId:            'box-456',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.collectionBoxId).toBe('box-456');
      });

      it('generates timestamps on create', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  eng: { title: 'Test' },
                  collectionOwnerUserId: 'user-1',
                  boxXbiisId:            'box-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.created).toBe('2024-01-01T00:00:00.000Z');
         expect(result.attributeValues.updated).toBe('2024-01-01T00:00:00.000Z');
         expect(result.attributeValues.createdAt).toBe('2024-01-01T00:00:00.000Z');
         expect(result.attributeValues.updatedAt).toBe('2024-01-01T00:00:00.000Z');
      });

      it('includes condition to prevent overwriting existing items', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  eng: { title: 'Test' },
                  collectionOwnerUserId: 'user-1',
                  boxXbiisId:            'box-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.condition).toEqual({
            expression:      'attribute_not_exists(#id)',
            expressionNames: { '#id': 'id' },
         });
      });

      it('handles optional bc and ak Summary fields', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  eng: { title: 'Test Collection' },
                  collectionOwnerUserId: 'user-1',
                  boxXbiisId:            'box-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.eng).toEqual({ title: 'Test Collection' });
         expect(result.attributeValues.bc).toBeUndefined();
         expect(result.attributeValues.ak).toBeUndefined();
      });
   });

   describe('response', () =>
   {
      it('returns result when no error', () =>
      {
         const ctx = { result: { id: 'test-id', eng: { title: 'Test Collection' } } };
         expect(response(ctx)).toEqual({ id: 'test-id', eng: { title: 'Test Collection' } });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
