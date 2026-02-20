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

import { request, response } from '../updateBoxUserGuarded.js';


describe('updateBoxUserGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates id is required', () =>
      {
         const ctx = { arguments: { input: { userId: 'user-1', boxId: 'box-1', role: 'READ' } } };
         expect(() => request(ctx)).toThrow('ValidationError: id is required');
      });

      it('validates userId is required', () =>
      {
         const ctx = { arguments: { input: { id: 'bu-1', boxId: 'box-1', role: 'READ' } } };
         expect(() => request(ctx)).toThrow('ValidationError: userId is required');
      });

      it('validates boxId is required', () =>
      {
         const ctx = { arguments: { input: { id: 'bu-1', userId: 'user-1', role: 'READ' } } };
         expect(() => request(ctx)).toThrow('ValidationError: boxId is required');
      });

      it('validates role is required', () =>
      {
         const ctx = { arguments: { input: { id: 'bu-1', userId: 'user-1', boxId: 'box-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: role is required');
      });

      it('creates UpdateItem operation with all fields', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'bu-1', userId: 'user-1', boxId: 'box-1', role: 'WRITE' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'bu-1' });
         expect(result.update.expression).toBe(
            'SET #role = :role, #userUserId = :userUserId, #boxUserUserId = :boxUserUserId, #boxUserBoxId = :boxUserBoxId, #updatedAt = :updatedAt'
         );
         expect(result.update.expressionValues).toMatchObject({
            ':role':          'WRITE',
            ':userUserId':    'user-1',
            ':boxUserUserId': 'user-1',
            ':boxUserBoxId':  'box-1',
            ':updatedAt':     '2024-01-01T00:00:00.000Z',
         });
      });

      it('syncs userUserId and boxUserUserId to same value', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'bu-1', userId: 'user-123', boxId: 'box-1', role: 'READ' }
            }
         };

         const result = request(ctx);

         expect(result.update.expressionValues[':userUserId']).toBe('user-123');
         expect(result.update.expressionValues[':boxUserUserId']).toBe('user-123');
      });

      it('includes condition to ensure item exists', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'bu-1', userId: 'user-1', boxId: 'box-1', role: 'READ' }
            }
         };

         const result = request(ctx);

         expect(result.condition).toEqual({
            expression:       'attribute_exists(#id)',
            expressionNames:  { '#id': 'id' },
         });
      });
   });

   describe('response', () =>
   {
      it('returns result when no error', () =>
      {
         const ctx = { result: { id: 'bu-1', role: 'WRITE' } };
         expect(response(ctx)).toEqual({ id: 'bu-1', role: 'WRITE' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'Item not found', type: 'ConditionalCheckFailedException' } };
         expect(() => response(ctx)).toThrow('ConditionalCheckFailedException: Item not found');
      });
   });
});
