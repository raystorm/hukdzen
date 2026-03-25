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

import { request, response } from '../createXbiisGuarded.js';

describe('createXbiisGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates name is required', () =>
      {
         const ctx = { arguments: { input: { ownerUserId: 'user-1', purpose: 'GROUP', defaultRole: 'VIEWER' } } };
         expect(() => request(ctx)).toThrow('ValidationError: name is required');
      });

      it('validates ownerUserId is required', () =>
      {
         const ctx = { arguments: { input: { name: 'Test Box', purpose: 'GROUP', defaultRole: 'VIEWER' } } };
         expect(() => request(ctx)).toThrow('ValidationError: ownerUserId is required');
      });

      it('validates purpose is required', () =>
      {
         const ctx = { arguments: { input: { name: 'Test Box', ownerUserId: 'user-1', defaultRole: 'VIEWER' } } };
         expect(() => request(ctx)).toThrow('ValidationError: purpose is required');
      });

      it('validates defaultRole is required', () =>
      {
         const ctx = { arguments: { input: { name: 'Test Box', ownerUserId: 'user-1', purpose: 'GROUP' } } };
         expect(() => request(ctx)).toThrow('ValidationError: defaultRole is required');
      });

      it('validates cannot create DEFAULT purpose boxes', () =>
      {
         const ctx = { arguments: { input: { name: 'Test Box', ownerUserId: 'user-1', purpose: 'DEFAULT', defaultRole: 'VIEWER' } } };
         expect(() => request(ctx)).toThrow('ValidationError: Cannot create DEFAULT purpose boxes');
      });

      it('creates PutItem operation with all required fields', () =>
      {
         const ctx = {
            arguments: {
               input: { name: 'Test Box', ownerUserId: 'user-1', purpose: 'GROUP', defaultRole: 'VIEWER' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues).toMatchObject({
            __typename:  'Xbiis',
            id:          'mock-id',
            name:        'Test Box',
            ownerUserId: 'user-1',
            purpose:     'GROUP',
            defaultRole: 'VIEWER',
            createdAt:   '2024-01-01T00:00:00.000Z',
            updatedAt:   '2024-01-01T00:00:00.000Z',
         });
      });

      it('creates PutItem operation with optional fields', () =>
      {
         const ctx = {
            arguments: {
               input: { name: 'Test Box', ownerUserId: 'user-1', purpose: 'USER', defaultRole: 'VIEWER', waa: 'Waa Name' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.attributeValues.waa).toBe('Waa Name');
      });

      it('uses provided id when present', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'custom-id', name: 'Test Box', ownerUserId: 'user-1', purpose: 'GROUP', defaultRole: 'VIEWER' }
            }
         };

         const result = request(ctx);

         expect(result.key).toEqual({ id: 'custom-id' });
         expect(result.attributeValues.id).toBe('custom-id');
      });

      it('auto-generates id when not provided', () =>
      {
         const ctx = {
            arguments: {
               input: { name: 'Test Box', ownerUserId: 'user-1', purpose: 'GROUP', defaultRole: 'VIEWER' }
            }
         };

         const result = request(ctx);

         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues.id).toBe('mock-id');
      });

      it('includes condition to prevent overwriting existing items', () =>
      {
         const ctx = {
            arguments: {
               input: { name: 'Test Box', ownerUserId: 'user-1', purpose: 'GROUP', defaultRole: 'VIEWER' }
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
         const ctx = { result: { id: 'test-id', name: 'Test Box' } };
         expect(response(ctx)).toEqual({ id: 'test-id', name: 'Test Box' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
