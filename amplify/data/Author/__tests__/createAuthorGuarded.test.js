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

import { request, response } from '../createAuthorGuarded.js';

describe('createAuthorGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates name is required', () =>
      {
         const ctx = { arguments: { input: { clan: 'EAGLE' } } };
         expect(() => request(ctx)).toThrow('ValidationError: name is required');
      });

      it('creates PutItem operation with all fields', () =>
      {
         const ctx = {
            arguments: {
               input: { name: 'John Doe', clan: 'EAGLE', waa: 'Waa Name', email: 'john@example.com' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues).toMatchObject({
            __typename: 'Author',
            id:         'mock-id',
            name:       'John Doe',
            clan:       'EAGLE',
            waa:        'Waa Name',
            email:      'john@example.com',
            createdAt:  '2024-01-01T00:00:00.000Z',
            updatedAt:  '2024-01-01T00:00:00.000Z',
         });
      });

      it('uses provided id when present', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'custom-id', name: 'Jane Doe' }
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
               input: { name: 'John Doe' }
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
         const ctx = { result: { id: 'test-id', name: 'John Doe' } };
         expect(response(ctx)).toEqual({ id: 'test-id', name: 'John Doe' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
