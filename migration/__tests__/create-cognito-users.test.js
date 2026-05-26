import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
   createCognitoUsers,
   createUserInCognito,
   detectProvider,
   extractProviderSubject
} from '../create-cognito-users.js';
import {
   AdminCreateUserCommand,
   AdminLinkProviderForUserCommand,
   AdminGetUserCommand
} from '@aws-sdk/client-cognito-identity-provider';

vi.mock('@aws-sdk/client-cognito-identity-provider');

describe('create-cognito-users', () => {
   let mockCognitoClient;
   
   beforeEach(() => {
      mockCognitoClient = {
         send: vi.fn()
      };
   });
   
   describe('Create Native Cognito User Successfully', () => {
      // Scenario 1.1
      test('creates native user with correct parameters', async () => {
         const user = {
            id: 'uuid-123',
            email: 'native@example.com',
            name: 'Native User'
         };
         
         mockCognitoClient.send.mockResolvedValueOnce({
            User: {
               Attributes: [{ Name: 'sub', Value: 'gen2-sub-123' }],
               Username: 'native@example.com'
            }
         });
         
         const result = await createUserInCognito(
            user,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mockCognitoClient.send).toHaveBeenCalledWith(
            expect.any(AdminCreateUserCommand)
         );
         
         expect(AdminCreateUserCommand).toHaveBeenCalledWith(
            expect.objectContaining({
               UserPoolId: 'us-east-1_TEST',
               Username: 'native@example.com',
               UserAttributes: expect.arrayContaining([
                  { Name: 'email', Value: 'native@example.com' },
                  { Name: 'email_verified', Value: 'true' },
                  { Name: 'name', Value: 'Native User' }
               ]),
               MessageAction: 'SUPPRESS',
               TemporaryPassword: expect.any(String)
            })
         );
         
         expect(result.sub).toBe('gen2-sub-123');
         expect(result.username).toBe('native@example.com');
      });
   });
   
   describe('Create OAuth User (Google) Successfully', () => {
      // Scenario 1.2
      test('creates Google user with provider linking', async () => {
         const user = {
            id: 'google_123456789',
            email: 'google@example.com',
            name: 'Google User'
         };
         
         mockCognitoClient.send
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'gen2-sub-google' }],
                  Username: 'google@example.com'
               }
            })
            .mockResolvedValueOnce({});
         
         const result = await createUserInCognito(
            user,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mockCognitoClient.send).toHaveBeenCalledTimes(2);
         expect(mockCognitoClient.send).toHaveBeenNthCalledWith(
            2,
            expect.any(AdminLinkProviderForUserCommand)
         );
         
         expect(AdminLinkProviderForUserCommand).toHaveBeenCalledWith(
            expect.objectContaining({
               SourceUser: expect.objectContaining({
                  ProviderName: 'Google',
                  ProviderAttributeValue: '123456789'
               })
            })
         );
         
         expect(result.sub).toBe('gen2-sub-google');
      });
   });
   
   describe('Create OAuth User (Facebook) Successfully', () => {
      // Scenario 1.3
      test('creates Facebook user with provider linking', async () => {
         const user = {
            id: 'facebook_987654321',
            email: 'fb@example.com',
            name: 'FB User'
         };
         
         mockCognitoClient.send
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'gen2-sub-fb' }],
                  Username: 'fb@example.com'
               }
            })
            .mockResolvedValueOnce({});
         
         const result = await createUserInCognito(
            user,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mockCognitoClient.send).toHaveBeenNthCalledWith(
            2,
            expect.any(AdminLinkProviderForUserCommand)
         );
         
         expect(AdminLinkProviderForUserCommand).toHaveBeenCalledWith(
            expect.objectContaining({
               SourceUser: expect.objectContaining({
                  ProviderName: 'Facebook',
                  ProviderAttributeValue: '987654321'
               })
            })
         );
         
         expect(result.sub).toBe('gen2-sub-fb');
      });
   });
   
   describe('Create OAuth User (Amazon) Successfully', () => {
      // Scenario 1.4
      test('creates Amazon user with provider linking', async () => {
         const user = {
            id: 'loginwithamazon_amzn1.account.xxx',
            email: 'amazon@example.com',
            name: 'Amazon User'
         };
         
         mockCognitoClient.send
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'gen2-sub-amzn' }],
                  Username: 'amazon@example.com'
               }
            })
            .mockResolvedValueOnce({});
         
         const result = await createUserInCognito(
            user,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mockCognitoClient.send).toHaveBeenNthCalledWith(
            2,
            expect.any(AdminLinkProviderForUserCommand)
         );
         
         expect(AdminLinkProviderForUserCommand).toHaveBeenCalledWith(
            expect.objectContaining({
               SourceUser: expect.objectContaining({
                  ProviderName: 'LoginWithAmazon',
                  ProviderAttributeValue: 'amzn1.account.xxx'
               })
            })
         );
         
         expect(result.sub).toBe('gen2-sub-amzn');
      });
   });
   
   describe('Handle Duplicate Email (Seed User Conflict)', () => {
      // Scenario 1.5
      test('queries existing user when email already exists', async () => {
         const user = {
            id: 'uuid-admin',
            email: 'admin@example.com',
            name: 'Admin'
         };
         
         const error = new Error('User already exists');
         error.name = 'UsernameExistsException';
         
         mockCognitoClient.send
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce({
               UserAttributes: [{ Name: 'sub', Value: 'existing-sub-123' }],
               Username: 'admin@example.com'
            });
         
         const result = await createUserInCognito(
            user,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mockCognitoClient.send).toHaveBeenCalledTimes(2);
         expect(mockCognitoClient.send).toHaveBeenNthCalledWith(
            2,
            expect.any(AdminGetUserCommand)
         );
         
         expect(result.sub).toBe('existing-sub-123');
      });
   });
   
   describe('Handle Rate Limit with Retry', () => {
      // Scenario 1.6
      test('retries on LimitExceededException', async () => {
         const user = {
            id: 'uuid-123',
            email: 'test@example.com',
            name: 'Test User'
         };
         
         const error = new Error('Rate limit exceeded');
         error.name = 'LimitExceededException';
         
         mockCognitoClient.send
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'gen2-sub-retry' }],
                  Username: 'test@example.com'
               }
            });
         
         const result = await createUserInCognito(
            user,
            'us-east-1_TEST',
            mockCognitoClient,
            3
         );
         
         expect(mockCognitoClient.send).toHaveBeenCalledTimes(2);
         expect(result.sub).toBe('gen2-sub-retry');
      });
   });
   
   describe('Handle Unrecoverable Error', () => {
      // Scenario 1.7
      test('logs error and adds to failures for unrecoverable errors', async () => {
         const users = [
            { id: 'uuid-1', email: 'user1@example.com', name: 'User 1' },
            { id: 'uuid-2', email: 'user2@example.com', name: 'User 2' }
         ];
         
         const error = new Error('Invalid parameter');
         error.name = 'InvalidParameterException';
         
         mockCognitoClient.send
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'gen2-sub-2' }],
                  Username: 'user2@example.com'
               }
            });
         
         const { mapping, failures } = await createCognitoUsers(
            users,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mapping.size).toBe(1);
         expect(mapping.get('uuid-2')).toBe('gen2-sub-2');
         expect(failures).toHaveLength(1);
         expect(failures[0].userId).toBe('uuid-1');
         expect(failures[0].email).toBe('user1@example.com');
      });
   });
   
   describe('Handle OAuth Provider Linking Failure', () => {
      // Scenario 1.8
      test('logs error when provider linking fails', async () => {
         const user = {
            id: 'google_123',
            email: 'google@example.com',
            name: 'Google User'
         };
         
         const linkError = new Error('Provider linking failed');
         
         mockCognitoClient.send
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'gen2-sub-google' }],
                  Username: 'google@example.com'
               }
            })
            .mockRejectedValueOnce(linkError);
         
         const { mapping, failures } = await createCognitoUsers(
            [user],
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mapping.size).toBe(0);
         expect(failures).toHaveLength(1);
         expect(failures[0].error.message).toBe('Provider linking failed');
      });
   });
   
   describe('Batch Processing with Mixed Results', () => {
      // Scenario 1.9
      test('processes all users with mixed success and failures', async () => {
         const users = [
            { id: 'uuid-1', email: 'native1@example.com', name: 'Native 1' },
            { id: 'uuid-2', email: 'native2@example.com', name: 'Native 2' },
            { id: 'google_123', email: 'google@example.com', name: 'Google' },
            { id: 'facebook_456', email: 'fb@example.com', name: 'FB' },
            { id: 'uuid-dup', email: 'admin@example.com', name: 'Admin' }
         ];
         
         const linkError = new Error('Link failed');
         const dupError = new Error('Duplicate');
         dupError.name = 'UsernameExistsException';
         
         mockCognitoClient.send
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'sub-1' }],
                  Username: 'native1@example.com'
               }
            })
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'sub-2' }],
                  Username: 'native2@example.com'
               }
            })
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'sub-google' }],
                  Username: 'google@example.com'
               }
            })
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({
               User: {
                  Attributes: [{ Name: 'sub', Value: 'sub-fb' }],
                  Username: 'fb@example.com'
               }
            })
            .mockRejectedValueOnce(linkError)
            .mockRejectedValueOnce(dupError)
            .mockResolvedValueOnce({
               UserAttributes: [{ Name: 'sub', Value: 'existing-sub' }],
               Username: 'admin@example.com'
            });
         
         const { mapping, failures } = await createCognitoUsers(
            users,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mapping.size).toBe(4);
         expect(mapping.get('uuid-1')).toBe('sub-1');
         expect(mapping.get('uuid-2')).toBe('sub-2');
         expect(mapping.get('google_123')).toBe('sub-google');
         expect(mapping.get('uuid-dup')).toBe('existing-sub');
         expect(failures).toHaveLength(1);
         expect(failures[0].userId).toBe('facebook_456');
      });
   });
   
   describe('Detect Provider from Gen1 ID', () => {
      // Scenario 1.10
      test('correctly detects provider from user ID', () => {
         expect(detectProvider('google_123456')).toBe('Google');
         expect(detectProvider('facebook_987654')).toBe('Facebook');
         expect(detectProvider('loginwithamazon_amzn1')).toBe('LoginWithAmazon');
         expect(detectProvider('uuid-format-id')).toBeNull();
         expect(detectProvider('12345678-1234-1234-1234-123456789012')).toBeNull();
      });
      
      test('correctly extracts provider subject', () => {
         expect(extractProviderSubject('google_123456')).toBe('123456');
         expect(extractProviderSubject('facebook_987654')).toBe('987654');
         expect(extractProviderSubject('loginwithamazon_amzn1.account.xxx')).toBe('amzn1.account.xxx');
      });
   });
});
