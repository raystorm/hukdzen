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

import { request, response } from '../updateCollectionGuarded.js';

describe('updateCollectionGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates id is required', () =>
      {
         const ctx = { arguments: { input: { eng_title: 'Test Collection' } } };
         expect(() => request(ctx)).toThrow('ValidationError: id is required');
      });

      it('validates eng_title is required', () =>
      {
         const ctx = { arguments: { input: { id: 'coll-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: eng_title is required');
      });

      it('creates UpdateItem operation with all fields', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:             'coll-1',
                  eng_title:      'Updated Collection',
                  eng_description: 'Updated description',
                  bc_title:       'BC Title',
                  bc_description: 'BC description',
                  ak_title:       'AK Title',
                  ak_description: 'AK description',
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'coll-1' });
         expect(result.update.expression).toBe(
            'SET #eng_title = :eng_title, #eng_description = :eng_description, #bc_title = :bc_title, #bc_description = :bc_description, #ak_title = :ak_title, #ak_description = :ak_description, #updated = :updated, #updatedAt = :updatedAt'
         );
         expect(result.update.expressionValues).toMatchObject({
            ':eng_title':      'Updated Collection',
            ':eng_description': 'Updated description',
            ':bc_title':       'BC Title',
            ':bc_description': 'BC description',
            ':ak_title':       'AK Title',
            ':ak_description': 'AK description',
            ':updated':        '2024-01-01T00:00:00.000Z',
            ':updatedAt':      '2024-01-01T00:00:00.000Z',
         });
      });

      it('creates UpdateItem operation with only required fields', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:        'coll-1',
                  eng_title: 'Updated Collection',
               }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'coll-1' });
         expect(result.update.expression).toBe(
            'SET #eng_title = :eng_title, #updated = :updated, #updatedAt = :updatedAt'
         );
         expect(result.update.expressionValues).toMatchObject({
            ':eng_title': 'Updated Collection',
            ':updated':   '2024-01-01T00:00:00.000Z',
            ':updatedAt': '2024-01-01T00:00:00.000Z',
         });
      });

      it('updates timestamps on update', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:        'coll-1',
                  eng_title: 'Test',
               }
            }
         };

         const result = request(ctx);

         expect(result.update.expressionValues[':updated']).toBe('2024-01-01T00:00:00.000Z');
         expect(result.update.expressionValues[':updatedAt']).toBe('2024-01-01T00:00:00.000Z');
      });

      it('includes condition to ensure item exists', () =>
      {
         const ctx = {
            arguments: {
               input: {
                  id:        'coll-1',
                  eng_title: 'Test',
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
         const ctx = { result: { id: 'coll-1', eng_title: 'Updated Collection' } };
         expect(response(ctx)).toEqual({ id: 'coll-1', eng_title: 'Updated Collection' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'Item not found', type: 'ConditionalCheckFailedException' } };
         expect(() => response(ctx)).toThrow('ConditionalCheckFailedException: Item not found');
      });
   });
});
