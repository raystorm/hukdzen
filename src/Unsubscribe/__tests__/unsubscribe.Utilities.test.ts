import { describe, it, expect } from 'vitest';
import { decodeUnsubscribeToken } from '../unsubscribe.Utilities';

describe('unsubscribe.Utilities', () =>
{
   describe('decodeUnsubscribeToken', () =>
   {
      it('decodes valid token', () =>
      {
         const payload = { userId: 'user-123', email: 'test@example.com' };
         const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
         const body = btoa(JSON.stringify(payload));
         const signature = 'fake-signature';
         const token = `${header}.${body}.${signature}`;
         
         const decoded = decodeUnsubscribeToken(token);
         
         expect(decoded).toBeTruthy();
         expect(decoded?.userId).toBe('user-123');
         expect(decoded?.email).toBe('test@example.com');
      });

      it('returns null for invalid token', () =>
      {
         const decoded = decodeUnsubscribeToken('invalid-token');
         expect(decoded).toBeNull();
      });

      it('returns null for empty token', () =>
      {
         const decoded = decodeUnsubscribeToken('');
         expect(decoded).toBeNull();
      });

      it('returns null for token with wrong number of parts', () =>
      {
         const decoded = decodeUnsubscribeToken('part1.part2');
         expect(decoded).toBeNull();
      });
   });
});
