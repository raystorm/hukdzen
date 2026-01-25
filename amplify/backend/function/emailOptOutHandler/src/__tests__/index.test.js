// Mock AWS SDK before requiring index
const mockSend = jest.fn();
jest.mock('@aws-sdk/client-dynamodb', () => ({ DynamoDBClient: jest.fn() }));
jest.mock('@aws-sdk/lib-dynamodb', () => ({
   DynamoDBDocumentClient: { from: jest.fn(() => ({ send: mockSend })) },
   QueryCommand: jest.fn((params) => ({ input: params })),
   UpdateCommand: jest.fn((params) => ({ input: params }))
}));

// Set env vars before requiring index
process.env.API_HUKDZEN_USERTABLE_NAME = 'User-test';
process.env.REGION = 'us-west-2';
process.env.ENV = 'test';

const { handler } = require('../index');

describe('emailOptOutHandler', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Hard Bounce', () => {
      it('should opt out user on permanent bounce', async () => {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Permanent',
                        bouncedRecipients: [ { emailAddress: 'bounce@example.com' } ]
                     }
                  })
               }
            }]
         };

         // Mock getUserByEmail
         mockSend.mockResolvedValueOnce({
            Items: [{ id: 'user-123', email: 'bounce@example.com' }]
         });
         
         // Mock updateUserPreferences
         mockSend.mockResolvedValueOnce({});

         const result = await handler(event);

         expect(result.statusCode).toBe(200);
         expect(mockSend).toHaveBeenCalledTimes(2);
         
         const updateCall = mockSend.mock.calls[1][0];
         expect(updateCall.input.UpdateExpression).toBe('SET emailPreferences = :prefs');
         const prefs = updateCall.input.ExpressionAttributeValues[':prefs'];
         expect(prefs.allOptOut).toBe(true);
         expect(prefs.optOutReason).toBe('BOUNCE_HARD');
         expect(prefs.optOutAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
         expect(prefs.softBounceCount).toBe(0);
      });
   });

   describe('Soft Bounce', () => {
      it('should increment counter on first soft bounce', async () => {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Transient',
                        bouncedRecipients: [ { emailAddress: 'softbounce@example.com' } ]
                     }
                  })
               }
            }]
         };

         // Mock getUserByEmail
         mockSend.mockResolvedValueOnce({
            Items: [{ 
               id: 'user-456', 
               email: 'softbounce@example.com',
               emailPreferences: { softBounceCount: 0 }
            }]
         });
         
         // Mock updateUserPreferences
         mockSend.mockResolvedValueOnce({});

         await handler(event);

         expect(mockSend).toHaveBeenCalledTimes(2);
         
         const updateCall = mockSend.mock.calls[1][0];
         expect(updateCall.input.ExpressionAttributeValues[':prefs'].softBounceCount).toBe(1);
      });

      it('should opt out user after 5 soft bounces', async () =>
      {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Transient',
                        bouncedRecipients: [ { emailAddress: 'softbounce@example.com' } ]
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

         // Mock getUserByEmail twice (called in handleSoftBounces and optOutUsers)
         mockSend.mockResolvedValueOnce(userWith4Bounces);
         mockSend.mockResolvedValueOnce(userWith4Bounces);
         
         // Mock updateUserPreferences
         mockSend.mockResolvedValueOnce({});

         await handler(event);

         expect(mockSend).toHaveBeenCalledTimes(3);
         
         const updateCall = mockSend.mock.calls[2][0];
         const prefs = updateCall.input.ExpressionAttributeValues[':prefs'];
         expect(prefs.allOptOut).toBe(true);
         expect(prefs.optOutReason).toBe('BOUNCE_SOFT');
         expect(prefs.optOutAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
         expect(prefs.softBounceCount).toBe(0);
      });
   });

   describe('Complaint', () => {
      it('should opt out user on complaint', async () => {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Complaint',
                     complaint: {
                        complainedRecipients: [ { emailAddress: 'complaint@example.com' } ]
                     }
                  })
               }
            }]
         };

         // Mock getUserByEmail
         mockSend.mockResolvedValueOnce({
            Items: [{ id: 'user-789', email: 'complaint@example.com' }]
         });
         
         // Mock updateUserPreferences
         mockSend.mockResolvedValueOnce({});

         const result = await handler(event);

         expect(result.statusCode).toBe(200);
         expect(mockSend).toHaveBeenCalledTimes(2);
         
         const updateCall = mockSend.mock.calls[1][0];
         const prefs = updateCall.input.ExpressionAttributeValues[':prefs'];
         expect(prefs.allOptOut).toBe(true);
         expect(prefs.optOutReason).toBe('COMPLAINT');
         expect(prefs.optOutAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
         expect(prefs.softBounceCount).toBe(0);
      });
   });

   describe('Error Handling', () => {
      it('should handle user not found gracefully', async () => {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Permanent',
                        bouncedRecipients: [ { emailAddress: 'notfound@example.com' } ]
                     }
                  })
               }
            }]
         };

         // Mock getUserByEmail - no user found
         mockSend.mockResolvedValueOnce({ Items: [] });

         const result = await handler(event);

         expect(result.statusCode).toBe(200);
         expect(mockSend).toHaveBeenCalledTimes(1); // Only query, no update
      });

      it('should handle DynamoDB query errors gracefully', async () => {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     eventType: 'Bounce',
                     bounce: {
                        bounceType: 'Permanent',
                        bouncedRecipients: [ { emailAddress: 'error@example.com' } ]
                     }
                  })
               }
            }]
         };

         // Mock DynamoDB error - getUserByEmail catches it and returns null
         mockSend.mockRejectedValueOnce(new Error('DynamoDB error'));

         const result = await handler(event);

         // Lambda should succeed even if user lookup fails
         expect(result.statusCode).toBe(200);
         expect(mockSend).toHaveBeenCalledTimes(1); // Only failed query, no update
      });
   });

   describe('AppSync Query - getPublicUserEmailPreferences', () => {
      it('returns user preferences', async () => {
         const event = {
            info: { fieldName: 'getPublicUserEmailPreferences' },
            arguments: { email: 'test@example.com' }
         };

         mockSend.mockResolvedValueOnce({
            Items: [{
               id: 'user-123',
               email: 'test@example.com',
               emailPreferences: { allOptOut: true, optOutReason: 'USER_CHOICE' }
            }]
         });

         const result = await handler(event);

         expect(result).toEqual({ allOptOut: true, optOutReason: 'USER_CHOICE' });
      });

      it('returns default preferences when user has none', async () => {
         const event = {
            info: { fieldName: 'getPublicUserEmailPreferences' },
            arguments: { email: 'test@example.com' }
         };

         mockSend.mockResolvedValueOnce({
            Items: [{ id: 'user-123', email: 'test@example.com' }]
         });

         const result = await handler(event);

         expect(result).toEqual({
            allOptOut: false,
            boxRequestOptOut: false,
            collaboratorOptOut: false,
            systemOptOut: false
         });
      });

      it('returns null when user not found', async () => {
         const event = {
            info: { fieldName: 'getPublicUserEmailPreferences' },
            arguments: { email: 'notfound@example.com' }
         };

         mockSend.mockResolvedValueOnce({ Items: [] });

         const result = await handler(event);

         expect(result).toBeNull();
      });
   });

   describe('AppSync Mutation - updateUserEmailPreferences', () => {
      const jwt = require('jsonwebtoken');
      
      beforeEach(() => {
         process.env.JWT_SECRET = 'test-secret';
      });

      it('updates preferences with valid JWT', async () => {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'valid-jwt-token',
               preferences: { allOptOut: true, optOutReason: 'USER_CHOICE' }
            }
         };

         jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user-123', email: 'test@example.com' });
         mockSend.mockResolvedValueOnce({ Items: [{ id: 'user-123', email: 'test@example.com' }] });
         mockSend.mockResolvedValueOnce({});

         const result = await handler(event);

         expect(result).toEqual({ allOptOut: true, optOutReason: 'USER_CHOICE' });
         expect(jwt.verify).toHaveBeenCalledWith('valid-jwt-token', 'test-secret');
      });

      it('throws error on invalid JWT', async () => {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'invalid-token',
               preferences: { allOptOut: true }
            }
         };

         jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('Invalid token'); });

         await expect(handler(event)).rejects.toThrow('Invalid or expired token');
      });

      it('throws error on email mismatch', async () => {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'valid-jwt-token',
               preferences: { allOptOut: true }
            }
         };

         jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user-123', email: 'different@example.com' });

         await expect(handler(event)).rejects.toThrow('Email does not match token');
      });

      it('throws error on userId mismatch', async () => {
         const event = {
            info: { fieldName: 'updateUserEmailPreferences' },
            arguments: {
               email: 'test@example.com',
               token: 'valid-jwt-token',
               preferences: { allOptOut: true }
            }
         };

         jest.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user-456', email: 'test@example.com' });
         mockSend.mockResolvedValueOnce({ Items: [{ id: 'user-123', email: 'test@example.com' }] });

         await expect(handler(event)).rejects.toThrow('User ID does not match token');
      });
   });
});
