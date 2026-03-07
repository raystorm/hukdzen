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
         expect(() => request(ctx)).toThrow('ValidationError: eng_title is required');
      });

      it('validates collectionOwnerUserId is required', () =>
      {
         const ctx = { arguments: { input: { eng_title: 'Test Collection', boxXbiisId: 'box-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: collectionOwnerUserId is required');
      });

      it('validates boxXbiisId is required', () =>
      {
         const ctx = { arguments: { input: { eng_title: 'Test Collection', collectionOwnerUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: boxXbiisId is required');
      });

      it('creates PutItem operation with all required fields', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  eng_title:             'Test Collection',
                  collectionOwnerUserId: 'user-123',
                  boxXbiisId:            'box-456',
                  eng_description:       'English description',
                  bc_title:              'BC Title',
                  bc_description:        'BC description',
                  ak_title:              'AK Title',
                  ak_description:        'AK description',
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues).toMatchObject({
            __typename:                  'Collection',
            id:                          'mock-id',
            eng_title:                   'Test Collection',
            eng_description:             'English description',
            bc_title:                    'BC Title',
            bc_description:              'BC description',
            ak_title:                    'AK Title',
            ak_description:              'AK description',
            collectionCollectionOwnerId: 'user-123',
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
                  eng_title:             'Test Collection',
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
                  eng_title:             'Test',
                  collectionOwnerUserId: 'user-123',
                  boxXbiisId:            'box-1',
               }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues.collectionCollectionOwnerId).toBe('user-123');
      });

      it('maps boxXbiisId to collectionBoxId', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  eng_title:             'Test',
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
                  eng_title:             'Test',
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
                  eng_title:             'Test',
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
   });

   describe('response', () =>
   {
      it('returns result when no error', () =>
      {
         const ctx = { result: { id: 'test-id', eng_title: 'Test Collection' } };
         expect(response(ctx)).toEqual({ id: 'test-id', eng_title: 'Test Collection' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
