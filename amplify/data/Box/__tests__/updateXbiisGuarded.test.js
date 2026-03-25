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

import { request, response } from '../updateXbiisGuarded.js';

describe('updateXbiisGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates id is required', () =>
      {
         const ctx = { arguments: { input: { name: 'Updated Box' } } };
         expect(() => request(ctx)).toThrow('ValidationError: id is required');
      });

      it('validates cannot update DEFAULT purpose boxes', () =>
      {
         const ctx = { arguments: { input: { id: 'box-1', purpose: 'DEFAULT', name: 'Updated Box' } } };
         expect(() => request(ctx)).toThrow('ValidationError: Cannot update DEFAULT purpose boxes');
      });

      it('validates cannot change name for USER purpose boxes', () =>
      {
         const ctx = { arguments: { input: { id: 'box-1', purpose: 'USER', name: 'New Name' } } };
         expect(() => request(ctx)).toThrow('ValidationError: Cannot change name for USER purpose boxes');
      });

      it('creates UpdateItem operation with all fields', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'box-1', name: 'Updated Box', purpose: 'GROUP', defaultRole: 'EDITOR' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'box-1' });
         expect(result.update.expressionValues).toMatchObject({
            ':name':        'Updated Box',
            ':purpose':     'GROUP',
            ':defaultRole': 'EDITOR',
            ':updatedAt':   '2024-01-01T00:00:00.000Z',
         });
      });

      it('creates UpdateItem operation for USER box without name change', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'box-1', purpose: 'USER', defaultRole: 'EDITOR' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'box-1' });
         expect(result.update.expressionValues).not.toHaveProperty(':name');
         expect(result.update.expressionValues[':updatedAt']).toBe('2024-01-01T00:00:00.000Z');
      });

      it('updates optional fields', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'box-1', purpose: 'GROUP', waa: 'Updated Waa' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.update.expressionValues[':waa']).toBe('Updated Waa');
      });
   });

   describe('response', () =>
   {
      it('returns result when no error', () =>
      {
         const ctx = { result: { id: 'box-1', name: 'Updated Box' } };
         expect(response(ctx)).toEqual({ id: 'box-1', name: 'Updated Box' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
