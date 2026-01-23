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
                     notificationType: 'Bounce',
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
         
         // Verify update call
         const updateCall = mockSend.mock.calls[1][0];
         expect(updateCall.input.UpdateExpression).toContain('emailPreferences');
         expect(updateCall.input.ExpressionAttributeValues[':val0']).toBe(true); // allOptOut
         expect(updateCall.input.ExpressionAttributeValues[':val1']).toBe('BOUNCE_HARD');
         expect(updateCall.input.ExpressionAttributeValues[':val2']).toMatch(/^\d{4}-\d{2}-\d{2}T/); // optOutAt ISO date
         expect(updateCall.input.ExpressionAttributeValues[':val3']).toBe(0); // softBounceCount reset
      });
   });

   describe('Soft Bounce', () => {
      it('should increment counter on first soft bounce', async () => {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     notificationType: 'Bounce',
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
         
         // Verify counter incremented
         const updateCall = mockSend.mock.calls[1][0];
         expect(updateCall.input.ExpressionAttributeValues[':val0']).toBe(1);
      });

      it('should opt out user after 5 soft bounces', async () =>
      {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     notificationType: 'Bounce',
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

         expect(mockSend).toHaveBeenCalledTimes(3); // 2 queries + 1 update
         
         // Verify opted out with BOUNCE_SOFT reason
         const updateCall = mockSend.mock.calls[2][0];
         expect(updateCall.input.ExpressionAttributeValues[':val0']).toBe(true); // allOptOut
         expect(updateCall.input.ExpressionAttributeValues[':val1']).toBe('BOUNCE_SOFT');
         expect(updateCall.input.ExpressionAttributeValues[':val2']).toMatch(/^\d{4}-\d{2}-\d{2}T/); // optOutAt
         expect(updateCall.input.ExpressionAttributeValues[':val3']).toBe(0); // softBounceCount reset
      });
   });

   describe('Complaint', () => {
      it('should opt out user on complaint', async () => {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     notificationType: 'Complaint',
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
         
         // Verify update call
         const updateCall = mockSend.mock.calls[1][0];
         expect(updateCall.input.ExpressionAttributeValues[':val0']).toBe(true); // allOptOut
         expect(updateCall.input.ExpressionAttributeValues[':val1']).toBe('COMPLAINT');
         expect(updateCall.input.ExpressionAttributeValues[':val2']).toMatch(/^\d{4}-\d{2}-\d{2}T/); // optOutAt
         expect(updateCall.input.ExpressionAttributeValues[':val3']).toBe(0); // softBounceCount reset
      });
   });

   describe('Error Handling', () => {
      it('should handle user not found gracefully', async () => {
         const event = {
            Records: [{
               Sns: {
                  Message: JSON.stringify({
                     notificationType: 'Bounce',
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
                     notificationType: 'Bounce',
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
});
