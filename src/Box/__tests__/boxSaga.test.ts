import { vi } from 'vitest';
import { when } from 'vitest-when';
import { call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { generateClient } from '@aws-amplify/api';

import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildFriendlyErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';

import {
  getBoxById, createBox, removeBox, updateBox,
  handleGetBoxById, handleCreateBox, handleRemoveBox, handleUpdateBox,
} from '../boxSaga';
import { boxActions } from '../boxSlice';
import type { Box } from '../boxTypes';
import { AccessLevel, BoxPurpose, emptyBox } from '../boxTypes';
import { emptyUser } from '../../User/userType';
import { buildDomainInvariantError } from "../../error";

const client = generateClient();

const mockBox: Box = {
  ...emptyBox,
  id: 'box-id',
  name: 'Test Box',
  waa: 'Test Waa',
  purpose: BoxPurpose.GROUP,
  defaultRole: AccessLevel.READ,
  boxOwnerId: 'owner-id',
  owner: { ...emptyUser, id: 'owner-id' }
};

describe('boxSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBoxById', () => {
    test('calls GraphQL with correct parameters', async () =>
    {
      const mockResponse = { data: { getBox: mockBox } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getBoxById('box-id');

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { id: 'box-id' }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createBox', () =>
  {
    test('calls GraphQL with correct parameters and generates UUID', async () =>
    {
      const mockResponse = { data: { createBox: mockBox } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      await createBox(mockBox);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { 
          input: {
            id: expect.any(String), // UUID generated
            name: mockBox.name,
            waa: mockBox.waa,
            purpose: mockBox.purpose,
            defaultRole: mockBox.defaultRole,
            boxOwnerId: mockBox.boxOwnerId
          }
        }
      });
    });

    test('throws error for DEFAULT purpose', () =>
    {
      const defaultBox = { ...mockBox, purpose: BoxPurpose.DEFAULT };

      const error = buildDomainInvariantError('Default Box is not creatable');
      expect(() => createBox(defaultBox)).toThrow(error);
    });
  });

  describe('updateBox', () =>
  {
    test('omits name when updating USER boxes', async () =>
    {
      const userBox: Box = {
        ...mockBox,
        purpose: BoxPurpose.USER,
        name: 'ShouldNotChange'
      };

      const mockResponse = { data: { updateBox: userBox } };

      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      await updateBox(userBox);

      expect(client.graphql)
        .toHaveBeenCalledWith({
            query: expect.any(String),
            variables: {
              input: {
                id: userBox.id,
                waa: userBox.waa,
                purpose: userBox.purpose,
                defaultRole: userBox.defaultRole,
                boxOwnerId: userBox.boxOwnerId
                // name should NOT be here
              }
            }
        });
    });

    test('includes name when updating non-USER boxes', async () =>
    {
      const groupBox: Box = {
        ...mockBox,
        purpose: BoxPurpose.GROUP,
        name: 'AllowedName'
      } as Box;

      const mockResponse = { data: { updateBox: groupBox } };

      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      await updateBox(groupBox);

      expect(client.graphql)
        .toHaveBeenCalledWith({
           query: expect.any(String),
           variables: {
              input: {
                id: groupBox.id,
                name: groupBox.name, // validates name is present
                waa: groupBox.waa,
                purpose: groupBox.purpose,
                defaultRole: groupBox.defaultRole,
                boxOwnerId: groupBox.boxOwnerId
              }
           }
        });
    });

    test('throws error for DEFAULT purpose', () =>
    {
      const defaultBox = { ...mockBox, purpose: BoxPurpose.DEFAULT };

      const error = buildDomainInvariantError('Default Box is not editable');
      expect(() => updateBox(defaultBox)).toThrow(error);
    });
  });

  describe('removeBox', () =>
  {
    test('calls GraphQL with correct parameters', async () =>
    {
      const groupBox = { ...mockBox, purpose: BoxPurpose.GROUP };
      const mockResponse = { data: { deleteBox: groupBox } };

      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      await removeBox(groupBox);

      expect(client.graphql)
        .toHaveBeenCalledWith({
                                 query: expect.any(String),
                                 variables: { input: { id: groupBox.id } }
                              });
    });

    test('throws error for USER purpose', () =>
    {
      const userBox = { ...mockBox, purpose: BoxPurpose.USER };

      const error = buildDomainInvariantError('User Boxes cannot be removed');
      expect(() => removeBox(userBox)).toThrow(error);
    });

    test('throws error for DEFAULT purpose', () =>
    {
      const defaultBox = { ...mockBox, purpose: BoxPurpose.DEFAULT };

      const error = buildDomainInvariantError('Default Box is not removable');
      expect(() => removeBox(defaultBox)).toThrow(error);
    });
  });

  describe('handleGetBoxById', () => {
    test('dispatches Success action with response data on success', () => {
      const action = boxActions.getBoxById('box-id');
      const mockResponse = { data: { getBox: mockBox } };

      return expectSaga(handleGetBoxById, action)
        .provide([
          [call(getBoxById, 'box-id'), mockResponse]
        ])
        .put(boxActions.getBoxByIdSuccess(mockBox))
        .run();
    });

    test('dispatches Failure action with error message on error', () => {
      const action = boxActions.getBoxById('box-id');
      const error = new Error('GraphQL Error');
      
      return expectSaga(handleGetBoxById, action)
        .provide([
          [call(getBoxById, 'box-id'), throwError(error)]
        ])
        .put(boxActions.getBoxByIdFailure(error.message))
        .run();
    });

    test('dispatches friendly error alert on error', () => {
      const action = boxActions.getBoxById('box-id');
      const error = new Error('GraphQL Error');
      
      return expectSaga(handleGetBoxById, action)
        .provide([
          [call(getBoxById, 'box-id'), throwError(error)]
        ])
        .put(alertBarActions.DisplayAlertBox(
           buildFriendlyErrorAlert('Failed to GET Box', error)
        ))
        .run();
    });

    test('does not dispatch setProcessing', () => {
      const action = boxActions.getBoxById('box-id');
      const mockResponse = { data: { getBox: mockBox } };

      return expectSaga(handleGetBoxById, action)
        .provide([
          [call(getBoxById, 'box-id'), mockResponse]
        ])
        .not.put.like({ action: { type: 'ui/setProcessing' } })
        .run();
    });
  });

  describe('handleCreateBox', () => {
    test('dispatches Success action with response data on success', () => {
      const action = boxActions.createBox(mockBox);
      const mockResponse = { data: { createBox: mockBox } };
      
      return expectSaga(handleCreateBox, action)
        .provide([
          [call(createBox, mockBox), mockResponse]
        ])
        .put(boxActions.createBoxSuccess(mockBox))
        .run();
    });

    test('dispatches success alert for GROUP box creation', () => {
      const action = boxActions.createBox(mockBox);
      const mockResponse = { data: { createBox: mockBox } };
      
      return expectSaga(handleCreateBox, action)
        .provide([
          [call(createBox, mockBox), mockResponse]
        ])
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Box Created')))
        .run();
    });

    test('does not dispatch alert for USER box creation', () => {
      const userBox = { ...mockBox, purpose: BoxPurpose.USER };
      const action = boxActions.createBox(userBox);
      const mockResponse = { data: { createBox: userBox } };
      
      return expectSaga(handleCreateBox, action)
        .provide([
          [call(createBox, userBox), mockResponse]
        ])
        .put(boxActions.createBoxSuccess(userBox))
        .not.put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Box Created')))
        .run();
    });

    test('dispatches Failure action with error message on error', () => {
      const action = boxActions.createBox(mockBox);
      const error = new Error('Creation failed');
      
      return expectSaga(handleCreateBox, action)
        .provide([
          [call(createBox, mockBox), throwError(error)]
        ])
        .put(boxActions.createBoxFailure(error.message))
        .run();
    });

    test('dispatches friendly error alert on error', () => {
      const action = boxActions.createBox(mockBox);
      const error = new Error('Creation failed');
      
      return expectSaga(handleCreateBox, action)
        .provide([
          [call(createBox, mockBox), throwError(error)]
        ])
        .put(alertBarActions.DisplayAlertBox(
           buildFriendlyErrorAlert('ERROR Creating Box', error)
        ))
        .run();
    });

    test('does not dispatch setProcessing', () => {
      const action = boxActions.createBox(mockBox);
      const mockResponse = { data: { createBox: mockBox } };
      
      return expectSaga(handleCreateBox, action)
        .provide([
          [call(createBox, mockBox), mockResponse]
        ])
        .not.put.like({ action: { type: 'ui/setProcessing' } })
        .run();
    });
  });

  describe('handleUpdateBox', () => {
    test('dispatches Success action with response data on success', () => {
      const action = boxActions.updateBox(mockBox);
      const mockResponse = { data: { updateBox: mockBox } };
      
      return expectSaga(handleUpdateBox, action)
        .provide([
          [call(updateBox, mockBox), mockResponse]
        ])
        .put(boxActions.updateBoxSuccess(mockBox))
        .run();
    });

    test('dispatches success alert on success', () => {
      const action = boxActions.updateBox(mockBox);
      const mockResponse = { data: { updateBox: mockBox } };
      
      return expectSaga(handleUpdateBox, action)
        .provide([
          [call(updateBox, mockBox), mockResponse]
        ])
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Box Updated')))
        .run();
    });

    test('dispatches Failure action with error message on error', () => {
      const action = boxActions.updateBox(mockBox);
      const error = new Error('Update failed');
      
      return expectSaga(handleUpdateBox, action)
        .provide([
          [call(updateBox, mockBox), throwError(error)]
        ])
        .put(boxActions.updateBoxFailure(error.message))
        .run();
    });

    test('dispatches friendly error alert on error', () => {
      const action = boxActions.updateBox(mockBox);
      const error = new Error('Update failed');
      
      return expectSaga(handleUpdateBox, action)
        .provide([
          [call(updateBox, mockBox), throwError(error)]
        ])
        .put(alertBarActions.DisplayAlertBox(
           buildFriendlyErrorAlert('ERROR Updating Box', error)
        ))
        .run();
    });

    test('does not dispatch setProcessing', () => {
      const action = boxActions.updateBox(mockBox);
      const mockResponse = { data: { updateBox: mockBox } };
      
      return expectSaga(handleUpdateBox, action)
        .provide([
          [call(updateBox, mockBox), mockResponse]
        ])
        .not.put.like({ action: { type: 'ui/setProcessing' } })
        .run();
    });
  });

  describe('handleRemoveBox', () => {
    test('dispatches Success action on success', () => {
      const action = boxActions.removeBox(mockBox);
      const mockResponse = { data: { deleteBox: mockBox } };
      
      return expectSaga(handleRemoveBox, action)
        .provide([
          [call(removeBox, mockBox), mockResponse]
        ])
        .put(boxActions.removeBoxSuccess(mockBox))
        .run();
    });

    test('dispatches success alert on success', () => {
      const action = boxActions.removeBox(mockBox);
      const mockResponse = { data: { deleteBox: mockBox } };
      
      return expectSaga(handleRemoveBox, action)
        .provide([
          [call(removeBox, mockBox), mockResponse]
        ])
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Box Removed.')))
        .run();
    });

    test('dispatches Failure action with error message on error', () => {
      const action = boxActions.removeBox(mockBox);
      const error = new Error('Removal failed');
      
      return expectSaga(handleRemoveBox, action)
        .provide([
          [call(removeBox, mockBox), throwError(error)]
        ])
        .put(boxActions.removeBoxFailure(error.message))
        .run();
    });

    test('dispatches friendly error alert on error', () => {
      const action = boxActions.removeBox(mockBox);
      const error = new Error('Removal failed');
      
      return expectSaga(handleRemoveBox, action)
        .provide([
          [call(removeBox, mockBox), throwError(error)]
        ])
        .put(alertBarActions.DisplayAlertBox(
           buildFriendlyErrorAlert('ERROR Removing Box', error)
        ))
        .run();
    });

    test('does not dispatch setProcessing', () => {
      const action = boxActions.removeBox(mockBox);
      const mockResponse = { data: { deleteBox: mockBox } };
      
      return expectSaga(handleRemoveBox, action)
        .provide([
          [call(removeBox, mockBox), mockResponse]
        ])
        .not.put.like({ action: { type: 'ui/setProcessing' } })
        .run();
    });
  });

});