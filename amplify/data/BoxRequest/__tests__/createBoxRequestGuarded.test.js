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

import { request, response } from '../createBoxRequestGuarded.js';

describe('createBoxRequestGuarded', () =>
{
   beforeEach(() => { vi.clearAllMocks(); });

   describe('request', () =>
   {
      it('validates requestedName is required', () =>
      {
         const ctx = { arguments: { input: { requestReason: 'Need access', status: 'PENDING', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: requestedName is required');
      });

      it('validates requestReason is required', () =>
      {
         const ctx = { arguments: { input: { requestedName: 'My Box', status: 'PENDING', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: requestReason is required');
      });

      it('validates status is required', () =>
      {
         const ctx = { arguments: { input: { requestedName: 'My Box', requestReason: 'Need access', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: status is required');
      });

      it('validates createdByUserId is required', () =>
      {
         const ctx = { arguments: { input: { requestedName: 'My Box', requestReason: 'Need access', status: 'PENDING' } } };
         expect(() => request(ctx)).toThrow('ValidationError: createdByUserId is required');
      });

      it('validates denialReason required when status is DENIED', () =>
      {
         const ctx = { arguments: { input: { requestedName: 'My Box', requestReason: 'Need access', status: 'DENIED', createdByUserId: 'user-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: denialReason is required when status is DENIED');
      });

      it('validates approvedByUserId required when status is APPROVED', () =>
      {
         const ctx = { arguments: { input: { requestedName: 'My Box', requestReason: 'Need access', status: 'APPROVED', createdByUserId: 'user-1', createdBoxBoxId: 'box-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: approvedByUserId is required when status is APPROVED');
      });

      it('validates createdBoxBoxId required when status is APPROVED', () =>
      {
         const ctx = { arguments: { input: { requestedName: 'My Box', requestReason: 'Need access', status: 'APPROVED', createdByUserId: 'user-1', approvedByUserId: 'admin-1' } } };
         expect(() => request(ctx)).toThrow('ValidationError: createdBoxBoxId is required when status is APPROVED');
      });

      it('creates PutItem operation for PENDING request', () =>
      {
         const ctx = {
            arguments: {
               input: { requestedName: 'My Box', requestReason: 'Need access', status: 'PENDING', createdByUserId: 'user-1' }
            }
         };

         const result = request(ctx);

         expect(result.operation).toBe('PutItem');
         expect(result.key).toEqual({ id: 'mock-id' });
         expect(result.attributeValues).toMatchObject({
            __typename:            'BoxRequest',
            id:                    'mock-id',
            requestedName:         'My Box',
            requestReason:         'Need access',
            status:                'PENDING',
            boxRequestCreatedById: 'user-1',
            createdAt:             '2024-01-01T00:00:00.000Z',
            updatedAt:             '2024-01-01T00:00:00.000Z',
         });
      });

      it('creates PutItem operation for APPROVED request', () =>
      {
         const ctx = {
            arguments: {
               input: { requestedName: 'My Box', requestReason: 'Need access', status: 'APPROVED', createdByUserId: 'user-1', approvedByUserId: 'admin-1', createdBoxBoxId: 'box-1' }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues).toMatchObject({
            status:                  'APPROVED',
            boxRequestApprovedById:  'admin-1',
            boxRequestCreatedBoxId:  'box-1',
         });
      });

      it('creates PutItem operation for DENIED request', () =>
      {
         const ctx = {
            arguments: {
               input: { requestedName: 'My Box', requestReason: 'Need access', status: 'DENIED', createdByUserId: 'user-1', denialReason: 'Duplicate request' }
            }
         };

         const result = request(ctx);

         expect(result.attributeValues).toMatchObject({
            status:       'DENIED',
            denialReason: 'Duplicate request',
         });
      });

      it('uses provided id when present', () =>
      {
         const ctx = {
            arguments: {
               input: { id: 'custom-id', requestedName: 'My Box', requestReason: 'Need access', status: 'PENDING', createdByUserId: 'user-1' }
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
               input: { requestedName: 'My Box', requestReason: 'Need access', status: 'PENDING', createdByUserId: 'user-1' }
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
         const ctx = { result: { id: 'test-id', requestedName: 'My Box' } };
         expect(response(ctx)).toEqual({ id: 'test-id', requestedName: 'My Box' });
      });

      it('throws error when ctx.error present', () =>
      {
         const ctx = { error: { message: 'DynamoDB error', type: 'DynamoDbException' } };
         expect(() => response(ctx)).toThrow('DynamoDbException: DynamoDB error');
      });
   });
});
