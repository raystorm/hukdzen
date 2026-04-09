import { handler } from '../BoxUserHydrator';
import { graphql } from '../../../../shared/graphql';
import { logger } from '../../../../shared/logger';
import type { BoxUser, BoxUserList } from '../../../../shared/types';

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

describe('BoxUserHydrator', () =>
{
   beforeEach(() =>
   {
      jest.clearAllMocks();
   });

   describe('list operation', () =>
   {
      it('should hydrate BoxUser list with user and box', async () =>
      {
         const mockBoxUsers = {
            data: {
               listBoxUsers: {
                  items: [
                     {
                        id: 'bu-1',
                        boxUserUserId: 'user-1',
                        boxUserBoxId: 'box-1',
                        role: 'WRITE'
                     }
                  ],
                  nextToken: null
               }
            }
         };

         const mockUser = {
            data: {
               getUser: {
                  id: 'user-1',
                  name: 'Test User',
                  email: 'test@example.com'
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
            .mockResolvedValueOnce(mockBoxUsers)
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockBox)
            .mockResolvedValueOnce(mockOwner);

         const event = {
            operation: 'list' as const,
            arguments: {
               filter: { boxUserBoxId: { eq: 'box-1' } },
               limit: null,
               nextToken: null
            }
         };

         const result = await handler(event);

         expect(result).toEqual({
            items: [
               {
                  id: 'bu-1',
                  boxUserUserId: 'user-1',
                  boxUserBoxId: 'box-1',
                  role: 'WRITE',
                  user: mockUser.data.getUser,
                  box: {
                     ...mockBox.data.getBox,
                     owner: mockOwner.data.getUser
                  }
               }
            ],
            nextToken: null
         });

         expect(mockGraphql).toHaveBeenCalledTimes(4);
      });

      it('should filter out BoxUsers with missing user', async () =>
      {
         const mockBoxUsers = {
            data: {
               listBoxUsers: {
                  items: [
                     {
                        id: 'bu-1',
                        boxUserUserId: 'user-1',
                        boxUserBoxId: 'box-1',
                        role: 'WRITE'
                     }
                  ],
                  nextToken: null
               }
            }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxUsers)
            .mockResolvedValueOnce({ data: { getUser: null } })
            .mockResolvedValueOnce({ data: { getBox: { id: 'box-1', name: 'Box' } } });

         const event = {
            operation: 'list' as const,
            arguments: { filter: null, limit: null, nextToken: null }
         };

         const result = await handler(event);

         expect(result).toBeDefined();
         expect(result).toHaveProperty('items');
         expect((result as BoxUserList).items).toEqual([]);
      });

      it('should filter out BoxUsers with missing box', async () =>
      {
         const mockBoxUsers = {
            data: {
               listBoxUsers: {
                  items: [
                     {
                        id: 'bu-1',
                        boxUserUserId: 'user-1',
                        boxUserBoxId: 'box-1',
                        role: 'WRITE'
                     }
                  ],
                  nextToken: null
               }
            }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxUsers)
            .mockResolvedValueOnce({ data: { getUser: { id: 'user-1', name: 'User' } } })
            .mockResolvedValueOnce({ data: { getBox: null } });

         const event = {
            operation: 'list' as const,
            arguments: { filter: null, limit: null, nextToken: null }
         };

         const result = await handler(event);

         expect(result).toBeDefined();
         expect(result).toHaveProperty('items');
         expect((result as BoxUserList).items).toEqual([]);
      });

      it('should handle pagination', async () =>
      {
         const mockBoxUsers = {
            data: {
               listBoxUsers: {
                  items: [
                     {
                        id: 'bu-1',
                        boxUserUserId: 'user-1',
                        boxUserBoxId: 'box-1',
                        role: 'WRITE'
                     }
                  ],
                  nextToken: 'next-token-123'
               }
            }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxUsers)
            .mockResolvedValueOnce({ data: { getUser: { id: 'user-1', name: 'User' } } })
            .mockResolvedValueOnce({ data: { getBox: { id: 'box-1', name: 'Box' } } });

         const event = {
            operation: 'list' as const,
            arguments: {
               filter: null,
               limit: 10,
               nextToken: 'prev-token'
            }
         };

         const result = await handler(event);

         expect(result).toBeDefined();
         expect(result).toHaveProperty('nextToken');
         expect((result as BoxUserList).nextToken).toBe('next-token-123');
      });

      it('should handle empty list', async () =>
      {
         const mockBoxUsers = {
            data: {
               listBoxUsers: {
                  items: [],
                  nextToken: null
               }
            }
         };

         mockGraphql.mockResolvedValueOnce(mockBoxUsers);

         const event = {
            operation: 'list' as const,
            arguments: { filter: null, limit: null, nextToken: null }
         };

         const result = await handler(event);

         expect(result).toEqual({ items: [], nextToken: null });
         expect(mockGraphql).toHaveBeenCalledTimes(1);
      });
   });

   describe('get operation', () =>
   {
      it('should hydrate single BoxUser', async () =>
      {
         const mockBoxUser = {
            data: {
               getBoxUser: {
                  id: 'bu-1',
                  boxUserUserId: 'user-1',
                  boxUserBoxId: 'box-1',
                  role: 'WRITE'
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
                  boxOwnerId: null
               }
            }
         };

         mockGraphql
            .mockResolvedValueOnce(mockBoxUser)
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockBox);

         const event = {
            operation: 'get' as const,
            arguments: { id: 'bu-1' }
         };

         const result = await handler(event);

         expect(result).toEqual({
            id: 'bu-1',
            boxUserUserId: 'user-1',
            boxUserBoxId: 'box-1',
            role: 'WRITE',
            user: mockUser.data.getUser,
            box: mockBox.data.getBox
         });
      });

      it('should return null when BoxUser not found', async () =>
      {
         mockGraphql.mockResolvedValueOnce({ data: { getBoxUser: null } });

         const event = {
            operation: 'get' as const,
            arguments: { id: 'nonexistent' }
         };

         const result = await handler(event);

         expect(result).toBeNull();
      });

      it('should hydrate BoxUser with box owner', async () =>
      {
         const mockBoxUser = {
            data: {
               getBoxUser: {
                  id: 'bu-1',
                  boxUserUserId: 'user-1',
                  boxUserBoxId: 'box-1',
                  role: 'WRITE'
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
            .mockResolvedValueOnce(mockBoxUser)
            .mockResolvedValueOnce(mockUser)
            .mockResolvedValueOnce(mockBox)
            .mockResolvedValueOnce(mockOwner);

         const event = {
            operation: 'get' as const,
            arguments: { id: 'bu-1' }
         };

         const result = await handler(event);

         expect(result).toEqual({
            id: 'bu-1',
            boxUserUserId: 'user-1',
            boxUserBoxId: 'box-1',
            role: 'WRITE',
            user: mockUser.data.getUser,
            box: {
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
