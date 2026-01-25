import { describe, it, expect, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';

import {
   generateUnsubscribeToken,
   generateUnsubscribeUrl,
   decodeUnsubscribeToken,
   type UnsubscribeTokenPayload
} from '../unsubscribeUtils';

const TEST_SECRET = 'test-secret-key-for-jwt';
const TEST_USER_ID = 'user-123';
const TEST_EMAIL = 'test@example.com';
//const TEST_FRONTEND_URL = 'https://test.example.com';
const TEST_FRONTEND_URL = 'http://localhost:3000';

process.env.REACT_APP_JWT_SECRET = TEST_SECRET;
process.env.REACT_APP_FRONTEND_URL = TEST_FRONTEND_URL;

describe('unsubscribeUtils', () =>
{
   beforeAll(() =>
   {
      process.env.REACT_APP_JWT_SECRET = TEST_SECRET;
      process.env.REACT_APP_FRONTEND_URL = TEST_FRONTEND_URL;
   });

   beforeEach(() =>
   {
      process.env.REACT_APP_JWT_SECRET = TEST_SECRET;
      process.env.REACT_APP_FRONTEND_URL = TEST_FRONTEND_URL;
   });

   afterEach(() => { vi.clearAllMocks(); })

   describe('generateUnsubscribeToken', () =>
   {
      it('generates a valid JWT token', () =>
      {
         expect(process.env.REACT_APP_JWT_SECRET).toBeTruthy();
         const token = generateUnsubscribeToken(TEST_USER_ID, TEST_EMAIL);
         expect(token).toBeTruthy();
         expect(typeof token).toBe('string');
         expect(token.split('.')).toHaveLength(3);
      });

      it('includes userId and email in payload', () =>
      {
         const token = generateUnsubscribeToken(TEST_USER_ID, TEST_EMAIL);
         const decoded = jwt.verify(token, TEST_SECRET) as UnsubscribeTokenPayload;
         
         expect(decoded.userId).toBe(TEST_USER_ID);
         expect(decoded.email).toBe(TEST_EMAIL);
      });

      it('sets 90-day expiration', () =>
      {
         const token = generateUnsubscribeToken(TEST_USER_ID, TEST_EMAIL);
         const decoded = jwt.verify(token, TEST_SECRET) as any;
         
         const now = Math.floor(Date.now() / 1000);
         const ninetyDays = 90 * 24 * 60 * 60;
         
         expect(decoded.exp).toBeGreaterThan(now);
         expect(decoded.exp).toBeLessThanOrEqual(now + ninetyDays + 10);
      });

      it('throws error when JWT_SECRET is missing', () =>
      {
         const originalSecret = process.env.REACT_APP_JWT_SECRET;
         process.env.REACT_APP_JWT_SECRET = '';
         
         expect(() => generateUnsubscribeToken(TEST_USER_ID, TEST_EMAIL))
            .toThrow('REACT_APP_JWT_SECRET not configured');
         
         process.env.REACT_APP_JWT_SECRET = originalSecret;
      });
   });

   describe('generateUnsubscribeUrl', () =>
   {
      it('generates URL with token parameter', () =>
      {
         const url = generateUnsubscribeUrl(TEST_USER_ID, TEST_EMAIL);
         
         expect(url).toContain(TEST_FRONTEND_URL);
         expect(url).toContain('/unsubscribe?token=');
      });

      it('generates valid token in URL', () =>
      {
         const url = generateUnsubscribeUrl(TEST_USER_ID, TEST_EMAIL);
         const tokenParam = url.split('token=')[1];
         
         expect(tokenParam).toBeTruthy();
         const decoded = jwt.verify(tokenParam, TEST_SECRET) as UnsubscribeTokenPayload;
         expect(decoded.userId).toBe(TEST_USER_ID);
         expect(decoded.email).toBe(TEST_EMAIL);
      });
   });

   describe('decodeUnsubscribeToken', () =>
   {
      it('decodes valid token', () =>
      {
         const token = generateUnsubscribeToken(TEST_USER_ID, TEST_EMAIL);
         const decoded = decodeUnsubscribeToken(token);
         
         expect(decoded).toBeTruthy();
         expect(decoded?.userId).toBe(TEST_USER_ID);
         expect(decoded?.email).toBe(TEST_EMAIL);
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

      it('decodes expired token without verification', () =>
      {
         const expiredToken = jwt.sign(
            { userId: TEST_USER_ID, email: TEST_EMAIL },
            TEST_SECRET,
            { expiresIn: '-1d' }
         );
         
         const decoded = decodeUnsubscribeToken(expiredToken);
         expect(decoded).toBeTruthy();
         expect(decoded?.userId).toBe(TEST_USER_ID);
      });
   });
});