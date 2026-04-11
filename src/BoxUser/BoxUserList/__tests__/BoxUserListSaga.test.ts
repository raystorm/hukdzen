import { vi } from 'vitest';
import { call, put, race, take } from 'redux-saga/effects';
import { when } from 'vitest-when';
import { generateClient } from '@aws-amplify/api';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';

import {
  handleGetBoxUserList,
  handleGetBoxUserListForUser,
  handleGetBoxUserListForUserId,
  handleGetBoxUserListForBox,
  handleGetBoxUserListForBoxId,
  handleRemoveBoxUserListForUser,
  handleRemoveBoxUserListForUserId,
  handleRemoveBoxUserListForBox,
  handleRemoveBoxUserListForBoxId,
  handleUpdateAllBoxUsersForUser,
  getAllBoxUsers,
  getAllBoxUsersForUserId,
  getAllBoxUsersForBoxId,
  removeBoxUser
} from '../BoxUserListSaga';

import { boxUserListActions } from '../BoxUserListSlice';
import { boxUserActions } from '../../BoxUserSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildFriendlyErrorAlert, buildSuccessAlert } from '../../../AlertBar/AlertBarTypes';
import { BoxUserList, emptyBoxUserList } from '../BoxUserListType';
import { User, emptyUser } from '../../../User/userType';
import { Box, emptyBox } from '../../../Box/boxTypes';
import { buildBoxUser } from '../../BoxUserType';
import { Role } from '../../../Role/roleTypes';

const client = generateClient();

const mockUser: User = {
  ...emptyUser,
  id: 'user-1',
  name: 'Test User'
};

const mockBox: Box = {
  ...emptyBox,
  id: 'box-1',
  name: 'Test Box'
};

const mockBoxUser = buildBoxUser(mockUser, mockBox, Role.Read);
mockBoxUser.id = 'boxuser-1';

const mockBoxUserList: BoxUserList = {
  ...emptyBoxUserList,
  items: [mockBoxUser]
};

describe('BoxUserListSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllBoxUsers', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { listBoxUsers: mockBoxUserList } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getAllBoxUsers();

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String)
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllBoxUsersForUserId', () => {
    test('calls GraphQL with user filter', async () => {
      const mockResponse = { data: { listBoxUsers: mockBoxUserList } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getAllBoxUsersForUserId('user-1');

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { filter: { userUserId: { eq: 'user-1' } } }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('handleGetBoxUserList', () => {
    test('handles successful retrieval', async () => {
      const action = { payload: mockBoxUserList, type: 'test' };
      const mockResponse = { data: { listBoxUsers: mockBoxUserList } };
      
      const gen = handleGetBoxUserList(action);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsers));
      expect(gen.next(mockResponse).value)
         .toEqual(put(boxUserListActions.setAllBoxUsers(mockBoxUserList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error', async () => {
      const action = { payload: mockBoxUserList, type: 'test' };
      const error = new Error('GraphQL Error');
      
      const gen = handleGetBoxUserList(action);

      const alertMessage = buildFriendlyErrorAlert('Failed to GET List of BoxUsers',
                                                   error);

      expect(gen.next().value).toEqual(call(getAllBoxUsers));
      expect(gen.throw(error).value)
        .toEqual(put(alertBarActions.DisplayAlertBox(alertMessage))
      );
    });
  });

  describe('handleGetBoxUserListForUser', () => {
    test('handles successful retrieval for user', async () =>
    {
      const action = { payload: mockUser, type: 'test' };
      const mockResponse = { data: { listBoxUsers: mockBoxUserList } };
      
      const gen = handleGetBoxUserListForUser(action);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.next(mockResponse).value)
        .toEqual(put(boxUserListActions.setAllBoxUsers(mockBoxUserList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles error for user retrieval', async () => {
      const action = { payload: mockUser, type: 'test' };
      const error = new Error('User retrieval failed');
      
      const gen = handleGetBoxUserListForUser(action);

      const alertMessage = buildFriendlyErrorAlert('Failed to GET List of BoxUsers',
                                                   error);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(alertMessage))
      );
    });
  });

  describe('handleGetBoxUserListForBox', () => {
    test('handles successful retrieval for box', async () => {
      const action = { payload: mockBox, type: 'test' };
      const mockResponse = { data: { listBoxUsers: mockBoxUserList } };
      
      const gen = handleGetBoxUserListForBox(action);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForBoxId, 'box-1'));
      expect(gen.next(mockResponse).value).toEqual(put(boxUserListActions.setAllBoxUsers(mockBoxUserList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles error for box retrieval', async () => {
      const action = { payload: mockBox, type: 'test' };
      const error = new Error('Box retrieval failed');
      
      const gen = handleGetBoxUserListForBox(action);

      const alertMessage = buildFriendlyErrorAlert('Failed to GET List of BoxUsers',
                                                   error);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForBoxId, 'box-1'));
      expect(gen.throw(error).value)
        .toEqual(put(alertBarActions.DisplayAlertBox(alertMessage)));
    });
  });

  describe('handleRemoveBoxUserListForUser', () =>
  {
    test('handles successful bulk removal for user', async () =>
    {
      const action = { payload: mockUser, type: 'test' };
      const mockResponse = { data: { listBoxUsers: mockBoxUserList } };
      
      return expectSaga(handleRemoveBoxUserListForUser, action)
         .provide([
            [call(getAllBoxUsersForUserId, 'user-1'), mockResponse],
            [call(removeBoxUser, 'boxuser-1'), {}],
         ])
         .put(boxUserListActions.removeAllBoxUsersForUserIdSuccess())
         .run();
    });

    test('handles error during bulk removal', async () => {
      const action = { payload: mockUser, type: 'test' };
      const errorMsg = 'Bulk removal failed'
      const error = new Error(errorMsg);
      
      const failureAction = boxUserListActions
                               .removeAllBoxUsersForUserIdFailure(errorMsg);
      const alertMessage = buildFriendlyErrorAlert('Failed to Remove List of BoxUsers',
                                                   error);

      return expectSaga(handleRemoveBoxUserListForUser, action)
         .provide([
            [call(getAllBoxUsersForUserId, 'user-1'), throwError(error)],
         ])
         .put(failureAction)
         .put(alertBarActions.DisplayAlertBox(alertMessage))
         .run();
    });
  });

  describe('handleRemoveBoxUserListForUserId RSF', () => {
    test('dispatches success after removing all BoxUsers', async () => {
      const action = { payload: 'user-1', type: 'test' };
      const mockResponse = { data: { listBoxUsers: mockBoxUserList } };
      
      const gen = handleRemoveBoxUserListForUserId(action);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.next(mockResponse).value).toEqual(call(removeBoxUser, 'boxuser-1'));
      expect(gen.next().value).toEqual(put(boxUserListActions.removeAllBoxUsersForUserIdSuccess()));
      expect(gen.next().done).toBe(true);
    });

    test('dispatches failure when remove fails', async () => {
      const action = { payload: 'user-1', type: 'test' };
      const error = new Error('GraphQL error');
      
      const gen = handleRemoveBoxUserListForUserId(action);

      const alertMessage = buildFriendlyErrorAlert('Failed to Remove List of BoxUsers', error);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.throw(error).value).toEqual(put(boxUserListActions.removeAllBoxUsersForUserIdFailure('GraphQL error')));
    });
  });

  describe('handleUpdateAllBoxUsersForUser', () => {
    test('waits for removes before creates', async () => {
      const action = { payload: mockBoxUserList, type: 'test' };
      
      const gen = handleUpdateAllBoxUsersForUser(action);
      
      expect(gen.next().value).toEqual(put(boxUserListActions.removeAllBoxUsersForUserId('user-1')));
      expect(gen.next().value).toEqual(race({
         success: take(boxUserListActions.removeAllBoxUsersForUserIdSuccess.type),
         failure: take(boxUserListActions.removeAllBoxUsersForUserIdFailure.type),
      }));
      expect(gen.next({ success: true }).value).toEqual(put(boxUserActions.createBoxUser(mockBoxUser)));
      expect(gen.next().done).toBe(true);
    });

    test('stops on remove failure', async () => {
      const action = { payload: mockBoxUserList, type: 'test' };
      
      const gen = handleUpdateAllBoxUsersForUser(action);

      const errorAlert = buildErrorAlert('Failed to remove existing BoxUsers');
      
      expect(gen.next().value).toEqual(put(boxUserListActions.removeAllBoxUsersForUserId('user-1')));
      expect(gen.next().value).toEqual(race({
         success: take(boxUserListActions.removeAllBoxUsersForUserIdSuccess.type),
         failure: take(boxUserListActions.removeAllBoxUsersForUserIdFailure.type),
      }));
      expect(gen.next({ failure: true }).value).toEqual(put(alertBarActions.DisplayAlertBox(errorAlert)));
      expect(gen.next().done).toBe(true);
    });

    test('handles successful bulk update', async () => {
      const action = { payload: mockBoxUserList, type: 'test' };
      
      const gen = handleUpdateAllBoxUsersForUser(action);
      
      expect(gen.next().value).toEqual(put(boxUserListActions.removeAllBoxUsersForUserId('user-1')));
      expect(gen.next().value).toEqual(race({
         success: take(boxUserListActions.removeAllBoxUsersForUserIdSuccess.type),
         failure: take(boxUserListActions.removeAllBoxUsersForUserIdFailure.type),
      }));
      expect(gen.next({ success: true }).value).toEqual(put(boxUserActions.createBoxUser(mockBoxUser)));
      expect(gen.next().done).toBe(true);
    });

    test('handles empty box user list', async () => {
      const emptyList = { ...emptyBoxUserList, items: [] };
      const action = { payload: emptyList, type: 'test' };
      
      const gen = handleUpdateAllBoxUsersForUser(action);
      
      const result = gen.next();
      expect(result.done).toBe(true);
    });

    test('handles error during bulk update', async () => {
      const action = { payload: mockBoxUserList, type: 'test' };
      const error = new Error('Bulk update failed');
      
      const gen = handleUpdateAllBoxUsersForUser(action);

      const errorAlert = buildFriendlyErrorAlert('Failed to UPDATE List of BoxUsers:', error);
      
      expect(gen.next().value).toEqual(put(boxUserListActions.removeAllBoxUsersForUserId('user-1')));
      expect(gen.throw(error).value).toEqual(put(alertBarActions.DisplayAlertBox(errorAlert))
      );
    });
  });

  describe('error recovery scenarios', () => {
    test('handles DynamoDB throttling error', async () => {
      const action = { payload: mockBoxUserList, type: 'test' };
      const throttleError = {
        errors: [{ errorType: 'DynamoDB:ProvisionedThroughputExceededException' }]
      };
      
      const gen = handleGetBoxUserList(action);

      const alertMessage = buildFriendlyErrorAlert('Failed to GET List of BoxUsers',
                                                   throttleError);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsers));
      expect(gen.throw(throttleError).value)
        .toEqual(put(alertBarActions.DisplayAlertBox(alertMessage)));
    });

    test('handles network timeout', async () => {
      const action = { payload: 'user-1', type: 'test' };
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      
      const gen = handleGetBoxUserListForUserId(action);

      const alertMessage = buildFriendlyErrorAlert('Failed to GET List of BoxUsers',
                                                   timeoutError);
      
      expect(gen.next().value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.throw(timeoutError).value)
         .toEqual(put(alertBarActions.DisplayAlertBox(alertMessage)));
    });
  });
});