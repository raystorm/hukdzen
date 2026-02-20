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

import { request, response } from '../updateAuthorGuarded.js';

describe('updateAuthorGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates id is required', () =>
      {
         const ctx = { arguments: { input: { name: 'John Doe' } } };
         expect(() => request(ctx)).toThrow('ValidationError: id is required');
      });

      it('validates name is required', () =>
      {
         const ctx = { arguments: { input: { id: 'author-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: name is required');
      });

      it('creates UpdateItem operation with all fields', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'author-1', name: 'John Doe', clan: 'RAVEN', waa: 'Waa Name', email: 'john@example.com' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'author-1' });
         expect(result.update.expression).toBe(
            'SET #name = :name, #clan = :clan, #waa = :waa, #email = :email, #updatedAt = :updatedAt'
         );
         expect(result.update.expressionValues).toMatchObject({
            ':name':      'John Doe',
            ':clan':      'RAVEN',
            ':waa':       'Waa Name',
            ':email':     'john@example.com',
            ':updatedAt': '2024-01-01T00:00:00.000Z',
         });
      });

      it('includes condition to ensure item exists', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'author-1', name: 'John Doe' }
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
         const ctx = { result: { id: 'author-1', name: 'John Doe' } };
         expect(response(ctx)).toEqual({ id: 'author-1', name: 'John Doe' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'Item not found', type: 'ConditionalCheckFailedException' } };
         expect(() => response(ctx)).toThrow('ConditionalCheckFailedException: Item not found');
      });
   });
});
