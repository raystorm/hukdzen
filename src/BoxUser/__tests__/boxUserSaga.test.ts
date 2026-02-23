import { vi } from 'vitest';
import { call, put } from 'redux-saga/effects';
import { when } from 'vitest-when';
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
import { buildErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';
import { BoxUser, buildBoxUser } from '../BoxUserType';
import { AccessLevel, Role } from '../../Role/roleTypes';
import { emptyUser } from '../../User/userType';
import { emptyXbiis } from '../../Box/boxTypes';
import { boxUserActions } from "../BoxUserSlice";
import { expectSaga } from "redux-saga-test-plan";

const client = generateClient();

const mockBoxUser: BoxUser = buildBoxUser(
  { ...emptyUser,  id: 'user-id' },
  { ...emptyXbiis, id: 'box-id' },
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
      expect(gen.next(mockResponse).done).toBe(true);
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
    test('handles successful creation', async () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const mockResponse = { data: { createBoxUser: mockBoxUser } };
      
      const gen = handleCreateBoxUser(action);
      
      expect(gen.next().value).toEqual(call(createBoxUser, mockBoxUser));
      expect(gen.next(mockResponse).done).toBe(true); // Success path doesn't yield alert
    });

    test('handles creation error and displays alert immediately', async () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const error = new Error('Creation failed');
      
      const gen = handleCreateBoxUser(action);
      
      expect(gen.next().value).toEqual(call(createBoxUser, mockBoxUser));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `ERROR Creating BoxUser:\n${JSON.stringify(error)}`
        )))
      );
    });

    test('handles duplicate user-box combination error', async () =>
    {
      const action = boxUserActions.createBoxUser(mockBoxUser);
      const duplicateError = {
        errors: [{ errorType: 'DynamoDB:ConditionalCheckFailedException',
                   message: 'User already has access to this box' }]
      };
      
      const gen = handleCreateBoxUser(action);
      
      expect(gen.next().value).toEqual(call(createBoxUser, mockBoxUser));
      expect(gen.throw(duplicateError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `ERROR Creating BoxUser:\n${JSON.stringify(duplicateError)}`
        )))
      );
    });
  });

  describe('handleUpdateBoxUser', () =>
  {
    test('handles successful update', async () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const mockResponse = { data: { updateBoxUser: mockBoxUser } };
      
      const gen = handleUpdateBoxUser(action);
      
      expect(gen.next().value).toEqual(call(updateBoxUser, mockBoxUser));
      expect(gen.next(mockResponse).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxUser Updated')))
      );
      expect(gen.next().done).toBe(true);
    });

    test('handles update error', async () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const error = new Error('Update failed');
      
      const gen = handleUpdateBoxUser(action);
      
      expect(gen.next().value).toEqual(call(updateBoxUser, mockBoxUser));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `ERROR Updating BoxUser: ${JSON.stringify(error)}`
        )))
      );
    });

    test('handles role validation error', async () =>
    {
      const action = boxUserActions.updateBoxUser(mockBoxUser);
      const validationError = {
        errors: [{ errorType: 'ValidationException', message: 'Invalid role specified' }]
      };
      
      const gen = handleUpdateBoxUser(action);
      
      expect(gen.next().value).toEqual(call(updateBoxUser, mockBoxUser));
      expect(gen.throw(validationError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `ERROR Updating BoxUser: ${JSON.stringify(validationError)}`
        )))
      );
    });

    // src/BoxUser/__tests__/boxUserSaga.test.ts - add to updateBoxUser describe block
    test('removes role field when updating owner BoxUser', async () =>
    {
      const owner    = { ...emptyUser, id: 'owner-id' };
      const ownerBox = { ...emptyXbiis, id: 'box-id', xbiisOwnerId: 'owner-id', owner };
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
    test('handles successful removal', async () => {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const mockResponse = { data: { deleteBoxUser: mockBoxUser } };
      
      const gen = handleRemoveBoxUser(action);
      
      expect(gen.next().value).toEqual(call(removeBoxUserbyId, mockBoxUser.id));
      expect(gen.next(mockResponse).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxUser Removed.')))
      );
      expect(gen.next().done).toBe(true);
    });

    test('handles removal error', async () => {
      const action = boxUserActions.removeBoxUser(mockBoxUser);
      const error = new Error('Removal failed');
      
      const gen = handleRemoveBoxUser(action);
      
      expect(gen.next().value).toEqual(call(removeBoxUserbyId, mockBoxUser.id));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Error Removing boxUser: ${JSON.stringify(error)}`)))
      );
    });

    test('Prevents Permissions removal for BoxOwner', async () =>
    {
      const owner = { ...emptyUser,  id: 'user-id' };

      const boxOwner = buildBoxUser(owner,
                                    { ...emptyXbiis, id: 'box-id',
                                      owner: owner, xbiisOwnerId: owner.id },
                                    Role.Write);

      const action = boxUserActions.removeBoxUser(boxOwner);

      const error = buildErrorAlert('Cannot remove owner from box.');

      return expectSaga(handleRemoveBoxUser, action)
               .put(alertBarActions.DisplayAlertBox(error))
               .run()
    });
  });

  describe('handleRemoveBoxUserById', () =>
  {
    test('handles successful removal by ID', async () => {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const mockResponse = { data: { deleteBoxUser: { id: 'boxuser-id' } } };
      
      const gen = handleRemoveBoxUserById(action);
      
      expect(gen.next().value).toEqual(call(removeBoxUserbyId, 'boxuser-id'));
      expect(gen.next(mockResponse).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildSuccessAlert('BoxUser Removed.')))
      );
      expect(gen.next().done).toBe(true);
    });

    test('handles removal error by ID', async () => {
      const action = boxUserActions.removeBoxUserById('boxuser-id');
      const error = new Error('Removal failed');
      
      const gen = handleRemoveBoxUserById(action);
      
      expect(gen.next().value).toEqual(call(removeBoxUserbyId, 'boxuser-id'));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Error Removing boxUser: ${JSON.stringify(error)}`)))
      );
    });

    test('handles not found error', async () => {
      const action = boxUserActions.removeBoxUserById('nonexistent-id');
      const notFoundError = {
        errors: [{ errorType: 'DynamoDB:ResourceNotFoundException',
                   message: 'BoxUser not found' }]
      };
      
      const gen = handleRemoveBoxUserById(action);
      
      expect(gen.next().value).toEqual(call(removeBoxUserbyId, 'nonexistent-id'));
      expect(gen.throw(notFoundError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `Error Removing boxUser: ${JSON.stringify(notFoundError)}`
        )))
      );
    });
  });

  describe('error recovery scenarios', () =>
  {
    test('handles malformed response gracefully', async () => {
      const action = boxUserActions.getBoxUserById('boxuser-id');
      const malformedResponse = { data: null };
      
      const gen = handleGetBoxUserById(action);
      
      expect(gen.next().value).toEqual(call(getBoxUserById, 'boxuser-id'));
      expect(() => gen.next(malformedResponse)).not.toThrow();
    });

    test('handles invalid role enum', async () => {
      //@ts-expect-error testing invalid Role
      const invalidBoxUser = { ...mockBoxUser, role: 'InvalidRole' as typeof Role };
      //@ts-expect-error testing invalid Role
      const action = boxUserActions.createBoxUser(invalidBoxUser);
      const validationError = {
        errors: [{ errorType: 'ValidationException', message: 'Invalid role' }]
      };
      
      const gen = handleCreateBoxUser(action);

      //@ts-expect-error testing invalid Role
      expect(gen.next().value).toEqual(call(createBoxUser, invalidBoxUser));
      expect(gen.throw(validationError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `ERROR Creating BoxUser:\n${JSON.stringify(validationError)}`
        )))
      );
    });
  });
});