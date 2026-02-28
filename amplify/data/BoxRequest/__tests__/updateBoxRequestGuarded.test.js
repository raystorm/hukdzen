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

import { request, response } from '../updateBoxRequestGuarded.js';

describe('updateBoxRequestGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates id is required', () =>
      {
         const ctx = { arguments: { input: { requestedName: 'My Box', requestReason: 'Need access', status: 'PENDING', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: id is required');
      });

      it('validates requestedName is required', () =>
      {
         const ctx = { arguments: { input: { id: 'req-1', requestReason: 'Need access', status: 'PENDING', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: requestedName is required');
      });

      it('validates requestReason is required', () =>
      {
         const ctx = { arguments: { input: { id: 'req-1', requestedName: 'My Box', status: 'PENDING', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: requestReason is required');
      });

      it('validates status is required', () =>
      {
         const ctx = { arguments: { input: { id: 'req-1', requestedName: 'My Box', requestReason: 'Need access', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: status is required');
      });

      it('validates createdByUserId is required', () =>
      {
         const ctx = { arguments: { input: { id: 'req-1', requestedName: 'My Box', requestReason: 'Need access', status: 'PENDING' } } };
         expect(() => request(ctx)).toThrow('ValidationError: createdByUserId is required');
      });

      it('validates denialReason required when status is DENIED', () =>
      {
         const ctx = { arguments: { input: { id: 'req-1', requestedName: 'My Box', requestReason: 'Need access', status: 'DENIED', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: denialReason is required when status is DENIED');
      });

      it('validates approvedByUserId required when status is APPROVED', () =>
      {
         const ctx = { arguments: { input: { id: 'req-1', requestedName: 'My Box', requestReason: 'Need access', status: 'APPROVED', createdByUserId: 'user-1', createdBoxXbiisId: 'box-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: approvedByUserId is required when status is APPROVED');
      });

      it('validates createdBoxXbiisId required when status is APPROVED', () =>
      {
         const ctx = { arguments: { input: { id: 'req-1', requestedName: 'My Box', requestReason: 'Need access', status: 'APPROVED', createdByUserId: 'user-1', approvedByUserId: 'admin-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: createdBoxXbiisId is required when status is APPROVED');
      });

      it('creates UpdateItem operation for status change to APPROVED', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'req-1', requestedName: 'My Box', requestReason: 'Need access', status: 'APPROVED', createdByUserId: 'user-1', approvedByUserId: 'admin-1', createdBoxXbiisId: 'box-1' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('UpdateItem');
         expect(result.key).toEqual({ id: 'req-1' });
         expect(result.update.expressionValues).toMatchObject({
            ':requestedName': 'My Box',
            ':requestReason': 'Need access',
            ':status':        'APPROVED',
            ':createdById':   'user-1',
            ':approvedById':  'admin-1',
            ':createdBoxId':  'box-1',
            ':updatedAt':     '2024-01-01T00:00:00.000Z',
         });
      });

      it('creates UpdateItem operation for status change to DENIED', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'req-1', requestedName: 'My Box', requestReason: 'Need access', status: 'DENIED', createdByUserId: 'user-1', denialReason: 'Duplicate request' }
            }
         };

         const result = request(ctx);

         expect(result.update.expressionValues).toMatchObject({
            ':status':       'DENIED',
            ':denialReason': 'Duplicate request',
         });
      });

      it('includes condition to ensure item exists', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'req-1', requestedName: 'My Box', requestReason: 'Need access', status: 'PENDING', createdByUserId: 'user-1' }
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
         const ctx = { result: { id: 'req-1', requestedName: 'My Box' } };
         expect(response(ctx)).toEqual({ id: 'req-1', requestedName: 'My Box' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'Item not found', type: 'ConditionalCheckFailedException' } };
         expect(() => response(ctx)).toThrow('ConditionalCheckFailedException: Item not found');
      });
   });
});
