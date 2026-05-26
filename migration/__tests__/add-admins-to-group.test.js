import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
   addAdminsToGroup,
   ensureGroupExists
} from '../add-admins-to-group.js';
import {
   AdminAddUserToGroupCommand,
   CreateGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';

vi.mock('@aws-sdk/client-cognito-identity-provider');

describe('add-admins-to-group', () => {
   let mockCognitoClient;
   
   beforeEach(() => {
      mockCognitoClient = {
         send: vi.fn()
      };
   });
   
   describe('Add Admin Users to WebAppAdmin Group', () => {
      // Scenario 4.1
      test('adds all admin users to group successfully', async () => {
         const users = [
            { id: 'user-1', email: 'admin1@example.com', isAdmin: true },
            { id: 'user-2', email: 'admin2@example.com', isAdmin: true },
            { id: 'user-3', email: 'admin3@example.com', isAdmin: true },
            { id: 'user-4', email: 'regular@example.com', isAdmin: false }
         ];
         
         mockCognitoClient.send.mockResolvedValue({});
         
         const result = await addAdminsToGroup(
            users,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(mockCognitoClient.send).toHaveBeenCalledTimes(3);
         expect(mockCognitoClient.send).toHaveBeenCalledWith(
            expect.any(AdminAddUserToGroupCommand)
         );
         
         expect(AdminAddUserToGroupCommand).toHaveBeenCalledWith(
            expect.objectContaining({
               UserPoolId: 'us-east-1_TEST',
               Username: 'admin1@example.com',
               GroupName: 'WebAppAdmin'
            })
         );
         
         expect(result.added).toBe(3);
         expect(result.failed).toBe(0);
      });
   });
   
   describe('Create WebAppAdmin Group if Missing', () => {
      // Scenario 4.2
      test('creates group when it does not exist', async () => {
         mockCognitoClient.send.mockResolvedValueOnce({});
         
         await ensureGroupExists('us-east-1_TEST', mockCognitoClient);
         
         expect(mockCognitoClient.send).toHaveBeenCalledWith(
            expect.any(CreateGroupCommand)
         );
         
         expect(CreateGroupCommand).toHaveBeenCalledWith(
            expect.objectContaining({
               UserPoolId: 'us-east-1_TEST',
               GroupName: 'WebAppAdmin',
               Description: 'Application administrators'
            })
         );
      });
   });
   
   describe('Handle Group Already Exists', () => {
      // Scenario 4.3
      test('continues when group already exists', async () => {
         const error = new Error('Group exists');
         error.name = 'GroupExistsException';
         
         mockCognitoClient.send.mockRejectedValueOnce(error);
         
         await expect(
            ensureGroupExists('us-east-1_TEST', mockCognitoClient)
         ).resolves.not.toThrow();
      });
   });
   
   describe('Handle Add User to Group Failure', () => {
      // Scenario 4.4
      test('continues processing despite individual failures', async () => {
         const users = [
            { id: 'user-1', email: 'admin1@example.com', isAdmin: true },
            { id: 'user-2', email: 'admin2@example.com', isAdmin: true },
            { id: 'user-3', email: 'admin3@example.com', isAdmin: true }
         ];
         
         const error = new Error('Add failed');
         
         mockCognitoClient.send
            .mockResolvedValueOnce({})
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce({});
         
         const result = await addAdminsToGroup(
            users,
            'us-east-1_TEST',
            mockCognitoClient
         );
         
         expect(result.added).toBe(2);
         expect(result.failed).toBe(1);
         expect(result.failures).toHaveLength(1);
         expect(result.failures[0].email).toBe('admin2@example.com');
      });
   });
});
