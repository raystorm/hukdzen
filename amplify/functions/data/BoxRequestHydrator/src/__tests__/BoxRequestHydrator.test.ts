import { handler } from '../BoxRequestHydrator';
import { graphql } from '../../../../shared/graphql';
import { logger } from '../../../../shared/logger';
import type { BoxRequestList } from '../../../../shared/types';

jest.mock('../../../../shared/graphql');
jest.mock('../../../../shared/logger', () => ({
   logger: {
      info: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn()
   }
}));

const mockGraphql = graphql as jest.MockedFunction<typeof graphql>;

describe('BoxRequestHydrator', () =>
{
   beforeEach(() =>
   {
      jest.clearAllMocks();
   });

   describe('list operation', () =>
   {
      it('should hydrate BoxRequest list with createdBy, approvedBy, and createdBox', async () =>
      {
         const mockBoxRequests = {
            data: {
               listBoxRequests: {
                  items: [
                     {
                        id: 'br-1',
                        boxRequestCreatedById: 'user-1',
                        boxRequestApprovedById: 'admin-1',
                        boxRequestCreatedBoxId: 'box-1',
                        status: 'APPROVED'
                     }
                  ],
                  nextToken: null
               }
            }
         };

         const mockCreatedBy = {
            data: {
               getUser: {
                  id: 'user-1',
                  name: 'Test User',
                  email: 'test@example.com'
               }
            }
         };

         const mockApprovedBy = {
            data: {
               getUser: {
                  id: 'admin-1',
                  name: 'Admin User',
                  email: 'admin@example.com'
               }
            }
         };

         const mockBox = {
            data: {
               getBox: {
                  id: 'box-1',
                  name: 'Test Box',
                  boxOwnerId: 'owner-1'
               }
            }
         };

         const mockOwner = {
            data: {
               getUser: {
                  id: 'owner-1',
                  name: 'Box Owner',
                  email: 'owner@example.com'
               }
            }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxRequests)
            .mockResolvedValueOnce(mockCreatedBy)
            .mockResolvedValueOnce(mockApprovedBy)
            .mockResolvedValueOnce(mockBox)
            .mockResolvedValueOnce(mockOwner);

         const event = {
            operation: 'list' as const,
            arguments: {
               filter: null,
               limit: null,
               nextToken: null
            }
         };

         const result = await handler(event);

         expect(result).toEqual({
            items: [
               {
                  id: 'br-1',
                  boxRequestCreatedById: 'user-1',
                  boxRequestApprovedById: 'admin-1',
                  boxRequestCreatedBoxId: 'box-1',
                  status: 'APPROVED',
                  createdBy: mockCreatedBy.data.getUser,
                  approvedBy: mockApprovedBy.data.getUser,
                  createdBox: {
                     ...mockBox.data.getBox,
                     owner: mockOwner.data.getUser
                  }
               }
            ],
            nextToken: null
         });

         expect(mockGraphql).toHaveBeenCalledTimes(5);
      });

      it('should handle pending request without approvedBy or createdBox', async () =>
      {
         const mockBoxRequests = {
            data: {
               listBoxRequests: {
                  items: [
                     {
                        id: 'br-1',
                        boxRequestCreatedById: 'user-1',
                        status: 'PENDING'
                     }
                  ],
                  nextToken: null
               }
            }
         };

         const mockCreatedBy = {
            data: { getUser: { id: 'user-1', name: 'Test User' } }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxRequests)
            .mockResolvedValueOnce(mockCreatedBy);

         const event = {
            operation: 'list' as const,
            arguments: { filter: null, limit: null, nextToken: null }
         };

         const result = await handler(event) as BoxRequestList;

         expect(result.items![0]).toEqual({
            id: 'br-1',
            boxRequestCreatedById: 'user-1',
            status: 'PENDING',
            createdBy: mockCreatedBy.data.getUser
         });
         expect(mockGraphql).toHaveBeenCalledTimes(2);
      });

      it('should handle empty list', async () =>
      {
         const mockBoxRequests = {
            data: {
               listBoxRequests: {
                  items: [],
                  nextToken: null
               }
            }
         };

         mockGraphql.mockResolvedValueOnce(mockBoxRequests);

         const event = {
            operation: 'list' as const,
            arguments: { filter: null, limit: null, nextToken: null }
         };

         const result = await handler(event);

         expect(result).toEqual({ items: [], nextToken: null });
         expect(mockGraphql).toHaveBeenCalledTimes(1);
      });

      it('should handle pagination', async () =>
      {
         const mockBoxRequests = {
            data: {
               listBoxRequests: {
                  items: [
                     {
                        id: 'br-1',
                        boxRequestCreatedById: 'user-1',
                        status: 'PENDING'
                     }
                  ],
                  nextToken: 'next-token-123'
               }
            }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxRequests)
            .mockResolvedValueOnce({ data: { getUser: { id: 'user-1', name: 'User' } } });

         const event = {
            operation: 'list' as const,
            arguments: {
               filter: null,
               limit: 10,
               nextToken: 'prev-token'
            }
         };

         const result = await handler(event) as BoxRequestList;

         expect(result.nextToken).toBe('next-token-123');
      });
   });

   describe('get operation', () =>
   {
      it('should hydrate single BoxRequest', async () =>
      {
         const mockBoxRequest = {
            data: {
               getBoxRequest: {
                  id: 'br-1',
                  boxRequestCreatedById: 'user-1',
                  status: 'PENDING'
               }
            }
         };

         const mockUser = {
            data: { getUser: { id: 'user-1', name: 'Test User' } }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxRequest)
            .mockResolvedValueOnce(mockUser);

         const event = {
            operation: 'get' as const,
            arguments: { id: 'br-1' }
         };

         const result = await handler(event);

         expect(result).toEqual({
            id: 'br-1',
            boxRequestCreatedById: 'user-1',
            status: 'PENDING',
            createdBy: mockUser.data.getUser
         });
      });

      it('should return null when BoxRequest not found', async () =>
      {
         mockGraphql.mockResolvedValueOnce({ data: { getBoxRequest: null } });

         const event = {
            operation: 'get' as const,
            arguments: { id: 'nonexistent' }
         };

         const result = await handler(event);

         expect(result).toBeNull();
      });

      it('should hydrate BoxRequest with box owner', async () =>
      {
         const mockBoxRequest = {
            data: {
               getBoxRequest: {
                  id: 'br-1',
                  boxRequestCreatedById: 'user-1',
                  boxRequestCreatedBoxId: 'box-1',
                  status: 'APPROVED'
               }
            }
         };

         const mockUser = {
            data: {
               getUser: {
                  id: 'user-1',
                  name: 'Test User'
               }
            }
         };

         const mockBox = {
            data: {
               getBox: {
                  id: 'box-1',
                  name: 'Test Box',
                  boxOwnerId: 'owner-1'
               }
            }
         };

         const mockOwner = {
            data: {
               getUser: {
                  id: 'owner-1',
                  name: 'Box Owner'
               }
            }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxRequest)
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockBox)
            .mockResolvedValueOnce(mockOwner);

         const event = {
            operation: 'get' as const,
            arguments: { id: 'br-1' }
         };

         const result = await handler(event);

         expect(result).toEqual({
            id: 'br-1',
            boxRequestCreatedById: 'user-1',
            boxRequestCreatedBoxId: 'box-1',
            status: 'APPROVED',
            createdBy: mockUser.data.getUser,
            createdBox: {
               ...mockBox.data.getBox,
               owner: mockOwner.data.getUser
            }
         });
         expect(mockGraphql).toHaveBeenCalledTimes(4);
      });
   });

   describe('error handling', () =>
   {
      it('should log and throw errors', async () =>
      {
         const error = new Error('GraphQL failed');
         mockGraphql.mockRejectedValueOnce(error);

         const event = {
            operation: 'list' as const,
            arguments: { filter: null, limit: null, nextToken: null }
         };

         await expect(handler(event)).rejects.toThrow('GraphQL failed');
         expect(logger.error).toHaveBeenCalledWith('Handler error:', error);
      });

      it('should throw on unknown operation', async () =>
      {
         const event = {
            operation: 'delete' as any,
            arguments: {}
         };

         await expect(handler(event)).rejects.toThrow('Unknown operation: delete');
      });
   });
});
