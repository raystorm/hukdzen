import { call, put } from 'redux-saga/effects';
import { when } from 'jest-when';
import { generateClient } from '@aws-amplify/api';

import {
  handleGetAllUsers,
  getAllUsers
} from '../userListSaga';

import { userListActions } from '../userListSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../../../AlertBar/AlertBarTypes';
import { userList } from '../userListType';
import { User, emptyUser } from '../../userType';

jest.mock('@aws-amplify/api');

const client = generateClient();

const mockUsers: User[] = [
  { ...emptyUser, id: 'user-1', name: 'User One', email: 'user1@example.com' },
  { ...emptyUser, id: 'user-2', name: 'User Two', email: 'user2@example.com' }
];

const mockUserList: userList = {
  items: mockUsers,
  nextToken: null
};

describe('userListSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { listUsers: mockUserList } };
      when(client.graphql).mockResolvedValue(mockResponse);

      const result = await getAllUsers();

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String)
      });
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
});