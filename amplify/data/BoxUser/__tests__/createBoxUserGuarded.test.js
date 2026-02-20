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

import { request, response } from '../createBoxUserGuarded.js';



describe('createBoxUserGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates userId is required', () =>
      {
         const ctx = { arguments: { input: { boxId: 'box-1', role: 'READ' } } };
         expect(() => request(ctx)).toThrow('ValidationError: userId is required');
      });

      it('validates boxId is required', () =>
      {
         const ctx = { arguments: { input: { userId: 'user-1', role: 'READ' } } };
         expect(() => request(ctx)).toThrow('ValidationError: boxId is required');
      });

      it('validates role is required', () =>
      {
         const ctx = { arguments: { input: { userId: 'user-1', boxId: 'box-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: role is required');
      });

      it('creates PutItem operation with all required fields', () =>
      {
         const ctx = {
            arguments: {
               input: { userId: 'user-1', boxId: 'box-1', role: 'READ' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues).toMatchObject({
            __typename:    'BoxUser',
            id:            'mock-id',
            role:          'READ',
            userUserId:    'user-1',
            boxUserUserId: 'user-1',
            boxUserBoxId:  'box-1',
            createdAt:     '2024-01-01T00:00:00.000Z',
            updatedAt:     '2024-01-01T00:00:00.000Z',
         });
      });

      it('uses provided id when present', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'custom-id', userId: 'user-1', boxId: 'box-1', role: 'WRITE' }
            }
         };

         const result = request(ctx);

         expect(result.key).toEqual({ id: 'custom-id' });
         expect(result.attributeValues.id).toBe('custom-id');
      });

      it('includes condition to prevent overwriting existing items', () =>
      {
         const ctx = {
            arguments: {
               input: { userId: 'user-1', boxId: 'box-1', role: 'READ' }
            }
         };

         const result = request(ctx);

         expect(result.condition).toEqual({
            expression:       'attribute_not_exists(#id)',
            expressionNames:  { '#id': 'id' },
         });
      });

      it('syncs userUserId and boxUserUserId to userId', () => {
         const ctx = { arguments: { input: { userId: 'u-1', boxId: 'b-1', role: 'READ' } } };
         const result = request(ctx);

         expect(result.attributeValues.userUserId).toBe('u-1');
         expect(result.attributeValues.boxUserUserId).toBe('u-1');
      });

   });

   describe('response', () =>
   {
      it('returns result when no error', () =>
      {
         const ctx = { result: { id: 'test-id' } };
         expect(response(ctx)).toEqual({ id: 'test-id' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
