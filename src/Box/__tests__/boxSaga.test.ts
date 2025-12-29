import { vi } from 'vitest';
import { when } from 'vitest-when';
import { call, put } from 'redux-saga/effects';
import { generateClient } from '@aws-amplify/api';

import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';

import {
  getBoxById, createBox, removeBoxById, updateBox,
  handleGetBoxById, handleCreateBox, handleRemoveBox, handleUpdateBox,
} from '../boxSaga';
import { boxActions } from '../boxSlice';
import type { Xbiis } from '../boxTypes';
import { AccessLevel, BoxPurpose, emptyXbiis } from '../boxTypes';
import { emptyUser } from '../../User/userType';

const client = generateClient();

const mockBox: Xbiis = {
  ...emptyXbiis,
  id: 'box-id',
  name: 'Test Box',
  waa: 'Test Waa',
  purpose: BoxPurpose.GROUP,
  defaultRole: AccessLevel.READ,
  xbiisOwnerId: 'owner-id',
  owner: { ...emptyUser, id: 'owner-id' }
};

describe('boxSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getBoxById', () => {
    test('calls GraphQL with correct parameters', async () =>
    {
      const mockResponse = { data: { getXbiis: mockBox } };
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

  describe('createBox', () => {
    test('calls GraphQL with correct parameters and generates UUID', async () =>
    {
      const mockResponse = { data: { createXbiis: mockBox } };
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
            xbiisOwnerId: mockBox.xbiisOwnerId
          }
        }
      });
    });
  });

  describe('handleGetBoxById', () => {
    test('handles successful retrieval', async () => {
      const action = boxActions.getBoxById('box-id');
      const mockResponse = { data: { getXbiis: mockBox } };

      const gen = handleGetBoxById(action);
      
      expect(gen.next().value).toEqual(call(getBoxById, 'box-id'));
      expect(gen.next(mockResponse).value).toEqual(put(boxActions.setBox(mockBox)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error', async () => {
      const action = boxActions.getBoxById('box-id');
      const error = new Error('GraphQL Error');
      
      const gen = handleGetBoxById(action);
      
      expect(gen.next().value).toEqual(call(getBoxById, 'box-id'));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(
           buildErrorAlert(`Failed to GET Box: ${JSON.stringify(error)}`)
        ))
      );
    });

    test('handles access denied error', async () => {
      const action = boxActions.getBoxById('box-id');
      const accessError = new Error('Access Denied');
      accessError.name = 'AccessDenied';
      
      const gen = handleGetBoxById(action);
      
      expect(gen.next().value).toEqual(call(getBoxById, 'box-id'));
      expect(gen.throw(accessError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(
           buildErrorAlert(`Failed to GET Box: ${JSON.stringify(accessError)}`)
        ))
      );
    });
  });

  describe('handleCreateBox', () => {
    test('handles successful creation', async () => {
      const action = boxActions.createBox(mockBox);
      const mockResponse = { data: { createXbiis: mockBox } };
      
      const gen = handleCreateBox(action);
      
      expect(gen.next().value).toEqual(call(createBox, mockBox));
      expect(gen.next(mockResponse).value).toEqual(put(boxActions.setBox(mockResponse)));
      expect(gen.next().value).toEqual(put(alertBarActions.DisplayAlertBox(
         buildSuccessAlert('Box Created')
      )));
      expect(gen.next().done).toBe(true);
    });

    test('handles creation error', async () => {
      const action = boxActions.createBox(mockBox);
      const error = new Error('Creation failed');
      
      const gen = handleCreateBox(action);
      
      expect(gen.next().value).toEqual(call(createBox, mockBox));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(
           buildErrorAlert(`ERROR Creating Box: ${JSON.stringify(error)}`)
        ))
      );
    });

    test('handles duplicate name error', async () => {
      const action = boxActions.createBox(mockBox);
      const duplicateError = {
        errors: [{ errorType: 'DynamoDB:ConditionalCheckFailedException',
                   message: 'Box name already exists' }]
      };
      
      const gen = handleCreateBox(action);
      
      expect(gen.next().value).toEqual(call(createBox, mockBox));
      expect(gen.throw(duplicateError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(
           buildErrorAlert(`ERROR Creating Box: ${JSON.stringify(duplicateError)}`)
        ))
      );
    });
  });

  describe('handleUpdateBox', () => {
    test('handles successful update', async () => {
      const action = boxActions.updateBox(mockBox);
      const mockResponse = { data: { updateXbiis: mockBox } };
      
      const gen = handleUpdateBox(action);
      
      expect(gen.next().value).toEqual(call(updateBox, mockBox));
      expect(gen.next(mockResponse).value).toEqual(put(boxActions.setBox(mockResponse)));
      expect(gen.next().value).toEqual(put(alertBarActions.DisplayAlertBox(
         buildSuccessAlert('Box Updated')
      )));
      expect(gen.next().done).toBe(true);
    });

    test('handles update error', async () => {
      const action = boxActions.updateBox(mockBox);
      const error = new Error('Update failed');
      
      const gen = handleUpdateBox(action);
      
      expect(gen.next().value).toEqual(call(updateBox, mockBox));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(
           buildErrorAlert(`ERROR Updating Box: ${JSON.stringify(error)}`)
        ))
      );
    });

    test('handles permission denied error', async () => {
      const action = boxActions.updateBox(mockBox);
      const permissionError = {
        errors: [{ errorType: 'Unauthorized', message: 'Not authorized to update this box' }]
      };
      
      const gen = handleUpdateBox(action);
      
      expect(gen.next().value).toEqual(call(updateBox, mockBox));
      expect(gen.throw(permissionError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(
           buildErrorAlert(`ERROR Updating Box: ${JSON.stringify(permissionError)}`)
        ))
      );
    });
  });

  describe('handleRemoveBox', () => {
    test('handles successful removal', async () => {
      const action = boxActions.removeBox(mockBox);
      const mockResponse = { data: { deleteXbiis: mockBox } };
      
      const gen = handleRemoveBox(action);
      
      expect(gen.next().value).toEqual(call(removeBoxById, mockBox.id));
      expect(gen.next(mockResponse).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Box Removed.')))
      );
      expect(gen.next().done).toBe(true);
    });

    test('handles removal error', async () => {
      const action = boxActions.removeBox(mockBox);
      const error = new Error('Removal failed');
      
      const gen = handleRemoveBox(action);
      
      expect(gen.next().value).toEqual(call(removeBoxById, mockBox.id));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(
           buildErrorAlert(`ERROR Removing Box: ${JSON.stringify(error)}`)
        ))
      );
    });

    test('handles box has dependencies error', async () => {
      const action = boxActions.removeBox(mockBox);
      const dependencyError = {
        errors: [{ errorType: 'DependencyViolation', message: 'Box contains documents' }]
      };
      
      const gen = handleRemoveBox(action);
      
      expect(gen.next().value).toEqual(call(removeBoxById, mockBox.id));
      expect(gen.throw(dependencyError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(
           buildErrorAlert(`ERROR Removing Box: ${JSON.stringify(dependencyError)}`)
        ))
      );
    });
  });

  describe('error recovery scenarios', () => {
    test('handles malformed response gracefully', async () => {
      const action = boxActions.getBoxById('box-id');
      const malformedResponse = { data: null };
      
      const gen = handleGetBoxById(action);
      
      expect(gen.next().value).toEqual(call(getBoxById, 'box-id'));
      expect(() => gen.next(malformedResponse)).not.toThrow();
    });

    test('handles empty box data', async () => {
      const emptyBox = { ...mockBox, name: '' };
      const action = boxActions.createBox(emptyBox);
      const mockResponse = { data: { createXbiis: emptyBox } };
      
      const gen = handleCreateBox(action);
      
      expect(gen.next().value).toEqual(call(createBox, emptyBox));
      expect(gen.next(mockResponse).value).toEqual(put(boxActions.setBox(mockResponse)));
    });
  });
});