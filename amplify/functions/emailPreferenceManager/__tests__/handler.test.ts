import { handler } from '../handler';
import jwt from 'jsonwebtoken';

const mockDdbSend = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => ({ DynamoDBClient: jest.fn() }));
jest.mock('@aws-sdk/lib-dynamodb', () => ({
   DynamoDBDocumentClient: {
      from: jest.fn(() => ({ send: (...args: any[]) => mockDdbSend(...args) })),
   },
   QueryCommand: jest.fn((params) => params),
   UpdateCommand: jest.fn((params) => params),
   GetCommand: jest.fn((params) => params),
}));

const optOut = { __typename: 'EmailPreferences' as const, allOptOut: true };

describe('emailPreferenceManager handler', () =>
{
   beforeEach(() =>
   {
      process.env.AWS_REGION = 'us-east-1';
      process.env.USER_TABLE_NAME = 'User-test';
      process.env.JWT_SECRET = 'test-secret';
      
      jest.clearAllMocks();
   });

   describe('SNS bounce handling', () =>
   {
      test('opts out user on permanent bounce', async () =>
      {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Permanent',
                        bouncedRecipients: [{ emailAddress: 'bounce@example.com' }]
                     }
                  })
               }
            }]
         };

         mockDdbSend
            .mockResolvedValueOnce({ Items: [{ id: 'user-123', email: 'bounce@example.com' }] })
            .mockResolvedValueOnce({});

         const result = await handler(event);

         expect(result.statusCode).toBe(200);
         expect(mockDdbSend).toHaveBeenCalledTimes(2);
         
         const updateCall = mockDdbSend.mock.calls[1][0];
         expect(updateCall.UpdateExpression).toBe('SET emailPreferences = :prefs');
         const prefs = updateCall.ExpressionAttributeValues[':prefs'];
         expect(prefs.allOptOut).toBe(true);
         expect(prefs.optOutReason).toBe('BOUNCE_HARD');
         expect(prefs.optOutAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
         expect(prefs.softBounceCount).toBe(0);
      });

      test('increments counter on first soft bounce', async () =>
      {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Transient',
                        bouncedRecipients: [{ emailAddress: 'softbounce@example.com' }]
                     }
                  })
               }
            }]
         };

         mockDdbSend
            .mockResolvedValueOnce({
               Items: [{
                  id: 'user-456',
                  email: 'softbounce@example.com',
                  emailPreferences: { softBounceCount: 0 }
               }]
            })
            .mockResolvedValueOnce({});

         await handler(event);

         expect(mockDdbSend).toHaveBeenCalledTimes(2);
         
         const updateCall = mockDdbSend.mock.calls[1][0];
         expect(updateCall.ExpressionAttributeValues[':prefs'].softBounceCount).toBe(1);
      });

      test('opts out user after 5 soft bounces', async () =>
      {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Transient',
                        bouncedRecipients: [{ emailAddress: 'softbounce@example.com' }]
                     }
                  })
               }
            }]
         };

         const userWith4Bounces = {
            Items: [{
               id: 'user-456',
               email: 'softbounce@example.com',
               emailPreferences: { softBounceCount: 4 }
            }]
         };

         mockDdbSend
            .mockResolvedValueOnce(userWith4Bounces)
            .mockResolvedValueOnce(userWith4Bounces)
            .mockResolvedValueOnce({});

         await handler(event);

         expect(mockDdbSend).toHaveBeenCalledTimes(3);
         
         const updateCall = mockDdbSend.mock.calls[2][0];
         const prefs = updateCall.ExpressionAttributeValues[':prefs'];
         expect(prefs.allOptOut).toBe(true);
         expect(prefs.optOutReason).toBe('BOUNCE_SOFT');
         expect(prefs.optOutAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
         expect(prefs.softBounceCount).toBe(0);
      });

      test('opts out user on complaint', async () =>
      {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Complaint',
                     complaint: {
                        complainedRecipients: [{ emailAddress: 'complaint@example.com' }]
                     }
                  })
               }
            }]
         };

         mockDdbSend
            .mockResolvedValueOnce({ Items: [{ id: 'user-789', email: 'complaint@example.com' }] })
            .mockResolvedValueOnce({});

         const result = await handler(event);

         expect(result.statusCode).toBe(200);
         expect(mockDdbSend).toHaveBeenCalledTimes(2);
         
         const updateCall = mockDdbSend.mock.calls[1][0];
         const prefs = updateCall.ExpressionAttributeValues[':prefs'];
         expect(prefs.allOptOut).toBe(true);
         expect(prefs.optOutReason).toBe('COMPLAINT');
         expect(prefs.optOutAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
         expect(prefs.softBounceCount).toBe(0);
      });

      test('handles user not found gracefully', async () =>
      {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Permanent',
                        bouncedRecipients: [{ emailAddress: 'notfound@example.com' }]
                     }
                  })
               }
            }]
         };

         mockDdbSend.mockResolvedValueOnce({ Items: [] });

         const result = await handler(event);

         expect(result.statusCode).toBe(200);
         expect(mockDdbSend).toHaveBeenCalledTimes(1);
      });

      test('handles DynamoDB query errors gracefully', async () =>
      {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Permanent',
                        bouncedRecipients: [{ emailAddress: 'error@example.com' }]
                     }
                  })
               }
            }]
         };

         mockDdbSend.mockRejectedValueOnce(new Error('DynamoDB error'));

         const result = await handler(event);

         expect(result.statusCode).toBe(200);
         expect(mockDdbSend).toHaveBeenCalledTimes(1);
      });
   });

   describe('AppSync getPublicUserEmailPreferences', () =>
   {
      test('returns user preferences', async () =>
      {
         const event = {
            info: { fieldName: 'getPublicUserEmailPreferences' },
            arguments: { email: 'test@example.com' }
         };

         mockDdbSend.mockResolvedValueOnce({
            Items: [{
               id: 'user-123',
               email: 'test@example.com',
               emailPreferences: { ...optOut, optOutReason: 'USER_CHOICE' }
            }]
         });

         const result = await handler(event);

         expect(result).toEqual({ ...optOut, optOutReason: 'USER_CHOICE' });
      });

      test('returns default preferences when user has none', async () =>
      {
         const event = {
            info: { fieldName: 'getPublicUserEmailPreferences' },
            arguments: { email: 'test@example.com' }
         };

         mockDdbSend.mockResolvedValueOnce({
            Items: [{ id: 'user-123', email: 'test@example.com' }]
         });

         const result = await handler(event);

         expect(result).toEqual({
            __typename:         'EmailPreferences' as const,
            allOptOut:          false,
            boxRequestOptOut:   false,
            collaboratorOptOut: false,
            systemOptOut:       false
         });
      });

      test('returns null when user not found', async () =>
      {
         const event = {
            info: { fieldName: 'getPublicUserEmailPreferences' },
            arguments: { email: 'notfound@example.com' }
         };

         mockDdbSend.mockResolvedValueOnce({ Items: [] });

         const result = await handler(event);

         expect(result).toBeNull();
      });
   });

   describe('AppSync updateUserEmailPreferences', () =>
   {
      test('updates preferences with valid JWT', async () =>
      {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'valid-jwt-token',
               preferences: { ...optOut, optOutReason: 'USER_CHOICE' }
            }
         };

         jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user-123', email: 'test@example.com' } as any);
         mockDdbSend
            .mockResolvedValueOnce({ Item: { id: 'user-123', email: 'test@example.com' } })
            .mockResolvedValueOnce({});

         const result = await handler(event as any);

         expect(result).toEqual({ ...optOut, optOutReason: 'USER_CHOICE' });
         expect(jwt.verify).toHaveBeenCalledWith('valid-jwt-token', 'test-secret');
      });

      test('throws error on invalid JWT', async () =>
      {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'invalid-token',
               preferences: optOut
            }
         };

         jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('Invalid token'); });

         await expect(handler(event)).rejects.toThrow('Invalid or expired token');
      });

      test('throws error on email mismatch', async () =>
      {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'valid-jwt-token',
               preferences: optOut
            }
         };

         jest.spyOn(jwt, 'verify')
             .mockReturnValue({ userId: 'user-123', email: 'different@example.com' } as any);

         await expect(handler(event as any)).rejects.toThrow('Email does not match token');
      });

      test('throws error when user not found', async () =>
      {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'valid-jwt-token',
               preferences: optOut
            }
         };

         jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user-123', email: 'test@example.com' } as any);
         mockDdbSend.mockResolvedValueOnce({ Item: null });

         await expect(handler(event as any)).rejects.toThrow('User not found');
      });

      test('throws error on user email mismatch', async () =>
      {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'valid-jwt-token',
               preferences: optOut
            }
         };

         jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user-123', email: 'test@example.com' } as any);
         mockDdbSend.mockResolvedValueOnce({ Item: { id: 'user-123', email: 'different@example.com' } });

         await expect(handler(event as any)).rejects.toThrow('Email does not match user record');
      });
   });

   describe('error handling', () =>
   {
      test('throws error on unknown event type', async () =>
      {
         const event = { unknown: 'event' };

         await expect(handler(event as any)).rejects.toThrow('Unknown event type');
      });
   });
});
