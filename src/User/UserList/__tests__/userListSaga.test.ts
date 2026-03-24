import { vi } from 'vitest';
import { call, put } from 'redux-saga/effects';
import { when } from 'vitest-when';
import type { UserFilterInput } from '../../../graphql/API';
import { OptOutReason } from '../../../graphql/API';

import { generateClient } from '@aws-amplify/api';

import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../../../AlertBar/AlertBarTypes';

import { handleGetAllUsers, getAllUsers } from '../userListSaga';
import { userListActions } from '../userListSlice';
import type { userList } from '../userListType';
import { emptyUserList } from '../userListType';
import type { User } from '../../userType';
import { emptyUser } from '../../userType';

const client = generateClient();

const mockUsers: User[] = [
  { ...emptyUser, id: 'user-1', name: 'User One', email: 'user1@example.com' },
  { ...emptyUser, id: 'user-2', name: 'User Two', email: 'user2@example.com' }
];

const mockUserList: userList = {
  ...emptyUserList,
  items: mockUsers,
  nextToken: null
};

describe('userListSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllUsers', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { listUsers: mockUserList } };
      when(client.graphql).calledWith(expect.anything()).thenResolve(mockResponse);

      const result = await getAllUsers();

      expect(client.graphql).toHaveBeenCalledWith({ query: expect.any(String) });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('handleGetAllUsers', () => {
    test('handles successful retrieval', async () => {
      const action = { payload: mockUserList, type: 'test' };
      const mockResponse = { data: { listUsers: mockUserList } };
      
      const gen = handleGetAllUsers(action);
      
      expect(gen.next().value).toEqual(call(getAllUsers));
      expect(gen.next(mockResponse).value).toEqual(put(userListActions.setAllUsers(mockUserList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error', async () => {
      const action = { payload: mockUserList, type: 'test' };
      const error = new Error('GraphQL Error');
      
      const gen = handleGetAllUsers(action);
      
      expect(gen.next().value).toEqual(call(getAllUsers));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET ALL Users: ${JSON.stringify(error)}`)))
      );
    });

    test('handles network timeout error', async () => {
      const action = { payload: mockUserList, type: 'test' };
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      
      const gen = handleGetAllUsers(action);
      
      expect(gen.next().value).toEqual(call(getAllUsers));
      expect(gen.throw(timeoutError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET ALL Users: ${JSON.stringify(timeoutError)}`)))
      );
    });

    test('handles empty user list', async () => {
      const action = { payload: mockUserList, type: 'test' };
      const emptyResponse = { data: { listUsers: { items: [], nextToken: null } } };
      
      const gen = handleGetAllUsers(action);
      
      expect(gen.next().value).toEqual(call(getAllUsers));
      expect(gen.next(emptyResponse).value).toEqual(put(userListActions.setAllUsers(emptyResponse.data.listUsers)));
      expect(gen.next().done).toBe(true);
    });

    test('handles DynamoDB throttling error', async () => {
      const action = { payload: mockUserList, type: 'test' };
      const throttleError = {
        errors: [{ errorType: 'DynamoDB:ProvisionedThroughputExceededException' }]
      };
      
      const gen = handleGetAllUsers(action);
      
      expect(gen.next().value).toEqual(call(getAllUsers));
      expect(gen.throw(throttleError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET ALL Users: ${JSON.stringify(throttleError)}`)))
      );
    });

    test('handles malformed response gracefully', async () => {
      const action = { payload: mockUserList, type: 'test' };
      const malformedResponse = { data: null };
      
      const gen = handleGetAllUsers(action);
      
      expect(gen.next().value).toEqual(call(getAllUsers));
      expect(() => gen.next(malformedResponse)).not.toThrow();
    });
  });

  describe('filter construction', () => {
    it('constructs filter with email opt-out status', () => {
      const filter: UserFilterInput = {
        emailPreferences: { allOptOut: { eq: true } }
      };
      
      expect(filter.emailPreferences?.allOptOut?.eq).toBe(true);
    });

    it('constructs filter with bounce count', () => {
      const filter: UserFilterInput = {
        emailPreferences: { softBounceCount: { gte: 3 } }
      };
      
      expect(filter.emailPreferences?.softBounceCount?.gte).toBe(3);
    });

    it('constructs filter with opt-out reason', () => {
      const filter: UserFilterInput = {
        emailPreferences: { optOutReason: { eq: OptOutReason.BOUNCE_HARD } }
      };
      
      expect(filter.emailPreferences?.optOutReason?.eq).toBe(OptOutReason.BOUNCE_HARD);
    });
  });
});