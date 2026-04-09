import { vi } from 'vitest';
import { call, put } from 'redux-saga/effects';
import { when } from 'vitest-when';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { generateClient } from '@aws-amplify/api';

import {
  handleGetBoxUserById,
  handleCreateBoxUser,
  handleUpdateBoxUser,
  handleRemoveBoxUser,
  handleRemoveBoxUserById,
  getBoxUserById,
  createBoxUser,
  updateBoxUser,
  removeBoxUserbyId
} from '../boxUserSaga';

import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildFriendlyErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';
import { BoxUser, buildBoxUser } from '../BoxUserType';
import { AccessLevel, Role } from '../../Role/roleTypes';
import { emptyUser } from '../../User/userType';
import { emptyBox } from '../../Box/boxTypes';
import { boxUserActions } from '../BoxUserSlice';
import { uiActions } from '../../UI/uiSlice';

const client = generateClient();

const mockBoxUser: BoxUser = buildBoxUser(
  { ...emptyUser,  id: 'user-id' },
  { ...emptyBox, id: 'box-id' },
  Role.Write
);
mockBoxUser.id = 'boxuser-id';

describe('boxUserSaga', () =>
{
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBoxUserById', () =>
  {
    test('calls GraphQL with correct parameters', async () =>
    {
      const mockResponse = { data: { getBoxUser: mockBoxUser } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getBoxUserById('boxuser-id');

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { id: 'boxuser-id' }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createBoxUser', () =>
  {
    test('calls GraphQL with correct parameters and generates UUID when missing',
         async () =>
    {
      const boxUserWithoutId = { ...mockBoxUser, id: '' };
      const mockResponse = { data: { createBoxUser: mockBoxUser } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      await createBoxUser(boxUserWithoutId);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { 
          input: {
            id: expect.any(String), // UUID generated
            userId: mockBoxUser.boxUserUserId,
            boxId: mockBoxUser.boxUserBoxId,
            role: mockBoxUser.role
          }
        }
      });
    });

    test('uses existing ID when provided', async () => {
      const mockResponse = { data: { createBoxUser: mockBoxUser } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      await createBoxUser(mockBoxUser);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { 
          input: {
            id: mockBoxUser.id,
            userId: mockBoxUser.boxUserUserId,
            boxId: mockBoxUser.boxUserBoxId,
            role: mockBoxUser.role
          }
        }
      });
    });
  });

  describe('handleGetBoxUserById', () =>
  {
    test('handles successful retrieval', async () =>
    {
      const action = boxUserActions.getBoxUserById('boxuser-id');
      const mockResponse = { data: { getBoxUser: mockBoxUser } };
      
      const gen = handleGetBoxUserById(action);
      
      expect(gen.next().value).toEqual(call(getBoxUserById, 'boxuser-id'));
      expect(gen.next(mockResponse).value).toEqual(put(boxUserActions.setBoxUser(mockBoxUser)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error', async () =>
    {
      const action = boxUserActions.getBoxUserById('boxuser-id');
      const error = new Error('GraphQL Error');
      
      const gen = handleGetBoxUserById(action);
      
      expect(gen.next().value).toEqual(call(getBoxUserById, 'boxuser-id'));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `Failed to GET BoxUser: ${JSON.stringify(error)}`
        )))
      );
    });

    test('handles permission denied error', async () =>
    {
      const action = boxUserActions.getBoxUserById('boxuser-id');
      const permissionError = new Error('Access Denied');
      permissionError.name = 'AccessDenied';
      
      const gen = handleGetBoxUserById(action);
      
      expect(gen.next().value).toEqual(call(getBoxUserById, 'boxuser-id'));
      expect(gen.throw(permissionError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `Failed to GET BoxUser: ${JSON.stringify(permissionError)}`
        )))
      );
    });
  });

  describe('handleCreateBoxUser', () =>
  {
    test('dispatches setProcessing(true) at start', () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const mockResponse = { data: { createBoxUserGuarded: mockBoxUser } };
      
      return expectSaga(handleCreateBoxUser, action)
        .provide([
          [call(createBoxUser, mockBoxUser), mockResponse]
        ])
        .put(uiActions.setProcessing(true))
        .run();
    });

    test('dispatches Success action with response data on success', () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const mockResponse = { data: { createBoxUserGuarded: mockBoxUser } };
      
      return expectSaga(handleCreateBoxUser, action)
        .provide([
          [call(createBoxUser, mockBoxUser), mockResponse]
        ])
        .put(boxUserActions.createBoxUserSuccess(mockBoxUser))
        .run();
    });

    test('dispatches success alert on success', () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const mockResponse = { data: { createBoxUserGuarded: mockBoxUser } };
      
      return expectSaga(handleCreateBoxUser, action)
        .provide([
          [call(createBoxUser, mockBoxUser), mockResponse]
        ])
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxUser Created')))
        .run();
    });

    test('dispatches setProcessing(false) in finally block on success', () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const mockResponse = { data: { createBoxUserGuarded: mockBoxUser } };
      
      return expectSaga(handleCreateBoxUser, action)
        .provide([
          [call(createBoxUser, mockBoxUser), mockResponse]
        ])
        .put(uiActions.setProcessing(false))
        .run();
    });

    test('dispatches Failure action with error message on error', () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const error = new Error('Creation failed');
      
      return expectSaga(handleCreateBoxUser, action)
        .provide([
          [call(createBoxUser, mockBoxUser), throwError(error)]
        ])
        .put(boxUserActions.createBoxUserFailure(error.message))
        .run();
    });

    test('dispatches friendly error alert on error', () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const error = new Error('Creation failed');
      
      return expectSaga(handleCreateBoxUser, action)
        .provide([
          [call(createBoxUser, mockBoxUser), throwError(error)]
        ])
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to create BoxUser', error)
        ))
        .run();
    });

    test('dispatches setProcessing(false) in finally block on error', () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const error = new Error('Creation failed');
      
      return expectSaga(handleCreateBoxUser, action)
        .provide([
          [call(createBoxUser, mockBoxUser), throwError(error)]
        ])
        .put(uiActions.setProcessing(false))
        .run();
    });
  });

  describe('handleUpdateBoxUser', () =>
  {
    test('dispatches setProcessing(true) at start', () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const mockResponse = { data: { updateBoxUserGuarded: mockBoxUser } };
      
      return expectSaga(handleUpdateBoxUser, action)
        .provide([
          [call(updateBoxUser, mockBoxUser), mockResponse]
        ])
        .put(uiActions.setProcessing(true))
        .run();
    });

    test('dispatches Success action with response data on success', () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const mockResponse = { data: { updateBoxUserGuarded: mockBoxUser } };
      
      return expectSaga(handleUpdateBoxUser, action)
        .provide([
          [call(updateBoxUser, mockBoxUser), mockResponse]
        ])
        .put(boxUserActions.updateBoxUserSuccess(mockBoxUser))
        .run();
    });

    test('dispatches success alert on success', () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const mockResponse = { data: { updateBoxUserGuarded: mockBoxUser } };
      
      return expectSaga(handleUpdateBoxUser, action)
        .provide([
          [call(updateBoxUser, mockBoxUser), mockResponse]
        ])
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxUser Updated')))
        .run();
    });

    test('dispatches setProcessing(false) in finally block on success', () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const mockResponse = { data: { updateBoxUserGuarded: mockBoxUser } };
      
      return expectSaga(handleUpdateBoxUser, action)
        .provide([
          [call(updateBoxUser, mockBoxUser), mockResponse]
        ])
        .put(uiActions.setProcessing(false))
        .run();
    });

    test('dispatches Failure action with error message on error', () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const error = new Error('Update failed');
      
      return expectSaga(handleUpdateBoxUser, action)
        .provide([
          [call(updateBoxUser, mockBoxUser), throwError(error)]
        ])
        .put(boxUserActions.updateBoxUserFailure(error.message))
        .run();
    });

    test('dispatches friendly error alert on error', () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const error = new Error('Update failed');
      
      return expectSaga(handleUpdateBoxUser, action)
        .provide([
          [call(updateBoxUser, mockBoxUser), throwError(error)]
        ])
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to update BoxUser', error)
        ))
        .run();
    });

    test('dispatches setProcessing(false) in finally block on error', () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const error = new Error('Update failed');
      
      return expectSaga(handleUpdateBoxUser, action)
        .provide([
          [call(updateBoxUser, mockBoxUser), throwError(error)]
        ])
        .put(uiActions.setProcessing(false))
        .run();
    });

    // src/BoxUser/__tests__/boxUserSaga.test.ts - add to updateBoxUser describe block
    test('removes role field when updating owner BoxUser', async () =>
    {
      const owner    = { ...emptyUser, id: 'owner-id' };
      const ownerBox = { ...emptyBox, id: 'box-id', boxOwnerId: 'owner-id', owner };
      const boxOwner = buildBoxUser(owner, ownerBox, Role.Read);

      const mockResponse = { data: { updateBoxUser: boxOwner } };
      when(client.graphql).calledWith(expect.anything()).thenResolve(mockResponse);

      await updateBoxUser(boxOwner);

      expect(client.graphql)
        .toHaveBeenCalledWith({ query: expect.any(String),
                                variables: {
                                  input: {
                                    id: boxOwner.id,
                                    userId: boxOwner.boxUserUserId,
                                    boxId: boxOwner.boxUserBoxId,
                                    // Owners ALWAYS have WRITE access
                                    role: AccessLevel.WRITE
                                  }
                                }
                              });
    });

  });

  describe('handleRemoveBoxUser', () =>
  {
    test('dispatches setProcessing(true) at start', () =>
    {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const mockResponse = { data: { deleteBoxUser: mockBoxUser } };
      
      return expectSaga(handleRemoveBoxUser, action)
        .provide([
          [call(removeBoxUserbyId, mockBoxUser.id), mockResponse]
        ])
        .put(uiActions.setProcessing(true))
        .run();
    });

    test('dispatches Success action on success', () =>
    {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const mockResponse = { data: { deleteBoxUser: mockBoxUser } };
      
      return expectSaga(handleRemoveBoxUser, action)
        .provide([
          [call(removeBoxUserbyId, mockBoxUser.id), mockResponse]
        ])
        .put(boxUserActions.removeBoxUserSuccess())
        .run();
    });

    test('dispatches success alert on success', () =>
    {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const mockResponse = { data: { deleteBoxUser: mockBoxUser } };
      
      return expectSaga(handleRemoveBoxUser, action)
        .provide([
          [call(removeBoxUserbyId, mockBoxUser.id), mockResponse]
        ])
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxUser Removed.')))
        .run();
    });

    test('dispatches setProcessing(false) in finally block on success', () =>
    {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const mockResponse = { data: { deleteBoxUser: mockBoxUser } };
      
      return expectSaga(handleRemoveBoxUser, action)
        .provide([
          [call(removeBoxUserbyId, mockBoxUser.id), mockResponse]
        ])
        .put(uiActions.setProcessing(false))
        .run();
    });

    test('dispatches Failure action with error message on error', () =>
    {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const error = new Error('Removal failed');
      
      return expectSaga(handleRemoveBoxUser, action)
        .provide([
          [call(removeBoxUserbyId, mockBoxUser.id), throwError(error)]
        ])
        .put(boxUserActions.removeBoxUserFailure(error.message))
        .run();
    });

    test('dispatches friendly error alert on error', () =>
    {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const error = new Error('Removal failed');
      
      return expectSaga(handleRemoveBoxUser, action)
        .provide([
          [call(removeBoxUserbyId, mockBoxUser.id), throwError(error)]
        ])
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to remove BoxUser', error)
        ))
        .run();
    });

    test('dispatches setProcessing(false) in finally block on error', () =>
    {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const error = new Error('Removal failed');
      
      return expectSaga(handleRemoveBoxUser, action)
        .provide([
          [call(removeBoxUserbyId, mockBoxUser.id), throwError(error)]
        ])
        .put(uiActions.setProcessing(false))
        .run();
    });

    test('prevents removal of box owner', () =>
    {
      const owner = { ...emptyUser, id: 'user-id' };
      const boxOwner = buildBoxUser(
        owner,
        { ...emptyBox, id: 'box-id', owner: owner, boxOwnerId: owner.id },
        Role.Write
      );
      const action = boxUserActions.removeBoxUser(boxOwner);

      return expectSaga(handleRemoveBoxUser, action)
        .put(boxUserActions.removeBoxUserFailure('Cannot remove owner from box.'))
        .put(alertBarActions.DisplayAlertBox(buildErrorAlert('Cannot remove owner from box.')))
        .run();
    });
  });

  describe('handleRemoveBoxUserById', () =>
  {
    test('dispatches setProcessing(true) at start', () =>
    {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const mockResponse = { data: { deleteBoxUser: { id: 'boxuser-id' } } };
      
      return expectSaga(handleRemoveBoxUserById, action)
        .provide([
          [call(removeBoxUserbyId, 'boxuser-id'), mockResponse]
        ])
        .put(uiActions.setProcessing(true))
        .run();
    });

    test('dispatches Success action on success', () =>
    {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const mockResponse = { data: { deleteBoxUser: { id: 'boxuser-id' } } };
      
      return expectSaga(handleRemoveBoxUserById, action)
        .provide([
          [call(removeBoxUserbyId, 'boxuser-id'), mockResponse]
        ])
        .put(boxUserActions.removeBoxUserByIdSuccess())
        .run();
    });

    test('dispatches success alert on success', () =>
    {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const mockResponse = { data: { deleteBoxUser: { id: 'boxuser-id' } } };
      
      return expectSaga(handleRemoveBoxUserById, action)
        .provide([
          [call(removeBoxUserbyId, 'boxuser-id'), mockResponse]
        ])
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxUser Removed.')))
        .run();
    });

    test('dispatches setProcessing(false) in finally block on success', () =>
    {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const mockResponse = { data: { deleteBoxUser: { id: 'boxuser-id' } } };
      
      return expectSaga(handleRemoveBoxUserById, action)
        .provide([
          [call(removeBoxUserbyId, 'boxuser-id'), mockResponse]
        ])
        .put(uiActions.setProcessing(false))
        .run();
    });

    test('dispatches Failure action with error message on error', () =>
    {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const error = new Error('Removal failed');
      
      return expectSaga(handleRemoveBoxUserById, action)
        .provide([
          [call(removeBoxUserbyId, 'boxuser-id'), throwError(error)]
        ])
        .put(boxUserActions.removeBoxUserByIdFailure(error.message))
        .run();
    });

    test('dispatches friendly error alert on error', () =>
    {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const error = new Error('Removal failed');
      
      return expectSaga(handleRemoveBoxUserById, action)
        .provide([
          [call(removeBoxUserbyId, 'boxuser-id'), throwError(error)]
        ])
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to remove BoxUser', error)
        ))
        .run();
    });

    test('dispatches setProcessing(false) in finally block on error', () =>
    {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const error = new Error('Removal failed');
      
      return expectSaga(handleRemoveBoxUserById, action)
        .provide([
          [call(removeBoxUserbyId, 'boxuser-id'), throwError(error)]
        ])
        .put(uiActions.setProcessing(false))
        .run();
    });
  });

});