const { handler, isValidEmail, validateEmails, getAvailableTemplates } = require('../handler');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

jest.mock('@aws-sdk/client-ses');

describe('emailNotifier Lambda', () =>
{
   let mockSend;
   let mockSendEmailCommand;
   let capturedParams;

   beforeEach(() =>
   {
      capturedParams = null;
      mockSend = jest.fn().mockResolvedValue({ MessageId: 'test-id' });
      mockSendEmailCommand = jest.fn((params) => {
         capturedParams = params;
         return { input: params };
      });
      SESClient.prototype.send = mockSend;
      SendEmailCommand.mockImplementation(mockSendEmailCommand);
      process.env.SENDER_EMAIL = 'noreply@hukdzen.org';
      process.env.ENV = 'test';
   });

   afterEach(() =>
   {
      jest.clearAllMocks();
   });

   describe('successful email sending', () =>
   {
      it('sends email using template', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_SUBMITTED',
            templateArgs: {
               requesterName: 'John Doe',
               boxName: 'My Documents',
               reason: 'Need storage',
               requestListUrl: 'https://example.com/admin',
               requestDetailUrl: 'https://example.com/boxRequest'
            }
         };

         const result = await handler(event);

         expect(mockSend).toHaveBeenCalledTimes(1);
         expect(capturedParams.Source).toBe('noreply@hukdzen.org');
         expect(capturedParams.Destination.ToAddresses).toEqual(['user@example.com']);
         expect(capturedParams.Message.Subject.Data).toContain('John Doe');
         expect(capturedParams.Message.Body.Text.Data).toContain('My Documents');
         expect(result.statusCode).toBe(200);
         expect(JSON.parse(result.body).messageId).toBe('test-id');
      });

      it('sends email with CC recipients', async () =>
      {
         const event = {
            to: ['user@example.com'],
            cc: ['admin@example.com', 'manager@example.com'],
            templateName: 'BOX_REQUEST_APPROVED',
            templateArgs: {
               requesterName: 'Jane Doe',
               boxName: 'Test Box',
               approverName: 'Admin User',
               boxUrl: 'localhost',
            }
         };

         const result = await handler(event);

         expect(mockSend).toHaveBeenCalledTimes(1);
         expect(capturedParams.Destination.ToAddresses).toEqual(['user@example.com']);
         expect(capturedParams.Destination.CcAddresses).toEqual(['admin@example.com', 'manager@example.com']);
         expect(result.statusCode).toBe(200);
      });

      it('sends email to multiple recipients', async () =>
      {
         const event = {
            to: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
            templateName: 'BOX_REQUEST_DENIED',
            templateArgs: {
               requesterName: 'Bob Smith',
               boxName: 'Denied Box',
               denialReason: 'Duplicate request'
            }
         };

         const result = await handler(event);

         expect(mockSend).toHaveBeenCalledTimes(1);
         expect(capturedParams.Destination.ToAddresses).toEqual(['user1@example.com', 'user2@example.com', 'user3@example.com']);
         expect(capturedParams.Message.Subject.Data).toBe('Box Request Update');
         expect(capturedParams.Message.Body.Text.Data).toContain('Bob Smith');
         expect(result.statusCode).toBe(200);
      });

      it('appends unsubscribe footer when globalParams provided', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_SUBMITTED',
            templateArgs: {
               requesterName: 'John Doe',
               boxName: 'My Documents',
               reason: 'Need storage',
               requestListUrl: 'https://example.com/admin',
               requestDetailUrl: 'https://example.com/boxRequest'
            },
            globalParams: {
               unsubscribeUrl: 'https://example.com/unsubscribe?token=abc123'
            }
         };

         const result = await handler(event);

         expect(mockSend).toHaveBeenCalledTimes(1);
         expect(capturedParams.Message.Body.Text.Data).toContain('---');
         expect(capturedParams.Message.Body.Text.Data).toContain('To unsubscribe:');
         expect(capturedParams.Message.Body.Text.Data).toContain('https://example.com/unsubscribe?token=abc123');
         expect(result.statusCode).toBe(200);
      });
   });

   describe('validation errors', () =>
   {
      it('throws error when "to" field is missing', async () =>
      {
         const event = {
            subject: 'Test',
            body: 'Test body'
         };

         await expect(handler(event)).rejects.toThrow('Missing or invalid "to" field');
      });

      it('throws error when "to" field is empty array', async () =>
      {
         const event = {
            to: [],
            subject: 'Test',
            body: 'Test body'
         };

         await expect(handler(event)).rejects.toThrow('Missing or invalid "to" field');
      });

      it('throws error when "to" field is not an array', async () =>
      {
         const event = {
            to: 'user@example.com',
            subject: 'Test',
            body: 'Test body'
         };

         await expect(handler(event)).rejects.toThrow('Missing or invalid "to" field');
      });

      it('throws error when "to" contains invalid email', async () =>
      {
         const event = {
            to: ['invalid-email'],
            subject: 'Test',
            body: 'Test body'
         };

         await expect(handler(event)).rejects.toThrow('Invalid email address format in "to" field');
      });

      it('throws error when "cc" contains invalid email', async () =>
      {
         const event = {
            to: ['user@example.com'],
            cc: ['not-an-email'],
            subject: 'Test',
            body: 'Test body'
         };

         await expect(handler(event)).rejects.toThrow('Invalid email address format in "cc" field');
      });

      it('throws error when subject is missing', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateArgs: { requesterName: 'Test' }
         };

         await expect(handler(event)).rejects.toThrow('templateName is required');
      });

      it('throws error when body is missing', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_SUBMITTED'
         };

         await expect(handler(event)).rejects.toThrow('templateArgs required');
      });

      it('throws error when SENDER_EMAIL is not configured', async () =>
      {
         delete process.env.SENDER_EMAIL;

         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_APPROVED',
            templateArgs: {
               requesterName: 'Test',
               boxName: 'Test Box',
               approverName: 'Admin',
               boxUrl: 'localhost',
            }
         };

         await expect(handler(event)).rejects.toThrow('SENDER_EMAIL environment variable not configured');
      });
   });

   describe('template mode', () =>
   {
      it('sends email using template', async () =>
      {
         const event = {
            to: ['admin@example.com'],
            templateName: 'BOX_REQUEST_SUBMITTED',
            templateArgs: {
               requesterName: 'John Doe',
               boxName: 'My Documents',
               reason: 'Need storage',
               requestListUrl: 'https://example.com/admin',
               requestDetailUrl: 'https://example.com/boxRequest'
            }
         };

         const result = await handler(event);

         expect(mockSend).toHaveBeenCalledTimes(1);
         expect(capturedParams.Source).toBe('noreply@hukdzen.org');
         expect(capturedParams.Message.Subject.Data).toContain('John Doe');
         expect(capturedParams.Message.Body.Text.Data).toContain('My Documents');
         expect(result.statusCode).toBe(200);
      });

      it('throws error when templateArgs missing', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_SUBMITTED'
         };

         await expect(handler(event)).rejects.toThrow('templateArgs required');
      });

      it('throws error for invalid template args', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_SUBMITTED',
            templateArgs: { requesterName: 'Test' }
         };

         await expect(handler(event)).rejects.toThrow('Missing required argument');
      });

      it('throws error for unknown template', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'UNKNOWN_TEMPLATE',
            templateArgs: {}
         };

         await expect(handler(event)).rejects.toThrow('Unknown template');
      });
   });

   describe('email validation', () =>
   {
      describe('isValidEmail', () =>
      {
         it('validates correct email addresses', () =>
         {
            expect(isValidEmail('user@example.com')).toBe(true);
            expect(isValidEmail('test.user@example.co.uk')).toBe(true);
            expect(isValidEmail('user+tag@example.com')).toBe(true);
            expect(isValidEmail('user_@example.com')).toBe(true);
         });

         it('rejects invalid email addresses', () =>
         {
            expect(isValidEmail('not-an-email')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('user@')).toBe(false);
            expect(isValidEmail('user @example.com')).toBe(false);
            expect(isValidEmail('')).toBe(false);
            expect(isValidEmail(null)).toBe(false);
            expect(isValidEmail(undefined)).toBe(false);

            expect(isValidEmail(' user@example.com ')).toBe(false);
         });
      });

      describe('validateEmails', () =>
      {
         it('validates array of valid emails', () =>
         {
            expect(validateEmails(['user@example.com'])).toBe(true);
            expect(validateEmails(['user1@example.com', 'user2@example.com'])).toBe(true);
         });

         it('rejects array with any invalid email', () =>
         {
            expect(validateEmails(['user@example.com', 'invalid'])).toBe(false);
         });

         it('rejects empty array', () =>
         {
            expect(validateEmails([])).toBe(false);
         });

         it('rejects non-array', () =>
         {
            expect(validateEmails('user@example.com')).toBe(false);
            expect(validateEmails(null)).toBe(false);
         });
      });
   });

   describe('email parameters', () =>
   {
      it('throws error when SES send fails', async () =>
      {
         mockSend.mockRejectedValue(new Error('SES service error'));

         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_APPROVED',
            templateArgs: {
               requesterName: 'Test',
               boxName: 'Test Box',
               boxUrl: 'localhost',
            }
         };

         await expect(handler(event)).rejects.toThrow('SES service error');
      });
   });

   describe('email parameters', () =>
   {
      it('uses correct sender email from environment', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_APPROVED',
            templateArgs: {
               requesterName: 'Test User',
               boxName: 'Test Box',
               boxUrl: 'localhost',
            }
         };

         const result = await handler(event);
         expect(result.statusCode).toBe(200);
      });

      it('sets correct subject and body from template', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_APPROVED',
            templateArgs: {
               requesterName: 'Jane Doe',
               boxName: 'Important Box',
               boxUrl: 'localhost',
            }
         };

         const result = await handler(event);
         expect(result.statusCode).toBe(200);
      });

      it('does not include CC when not provided', async () =>
      {
         const event = {
            to: ['user@example.com'],
            templateName: 'BOX_REQUEST_DENIED',
            templateArgs: {
               requesterName: 'Test',
               boxName: 'Test Box',
               denialReason: 'Test reason'
            }
         };

         const result = await handler(event);
         expect(result.statusCode).toBe(200);
      });

      it('does not include CC when empty array', async () =>
      {
         const event = {
            to: ['user@example.com'],
            cc: [],
            templateName: 'BOX_REQUEST_DENIED',
            templateArgs: {
               requesterName: 'Test',
               boxName: 'Test Box',
               denialReason: 'Test reason'
            }
         };

         const result = await handler(event);
         expect(result.statusCode).toBe(200);
      });
   });
});
