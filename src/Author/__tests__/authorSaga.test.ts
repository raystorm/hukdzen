import { vi } from 'vitest';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { when } from 'vitest-when';
import { generateClient } from '@aws-amplify/api';

import {
  handleGetAuthorById,
  handleCreateAuthor,
  handleUpdateAuthor,
  getAuthorById,
  createAuthor,
  updateAuthor
} from '../authorSaga';

import { authorActions } from '../authorSlice';
import { alertBarActions } from '../../AlertBar/AlertBarSlice';
import { buildFriendlyErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';
import { Author, emptyAuthor } from '../AuthorType';

const client = generateClient();

const mockAuthor: Author = {
  ...emptyAuthor,
  id: 'author-id',
  name: 'Test Author',
  email: 'test@example.com',
  waa: 'Test Waa',
  //clan: 'Test Clan'
};

describe('authorSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAuthorById', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { getAuthor: mockAuthor } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getAuthorById('author-id');

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { id: 'author-id' }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createAuthor', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { createAuthorGuarded: mockAuthor } };
      when(client.graphql).calledWith(expect.anything()).thenResolve(mockResponse);

      await createAuthor(mockAuthor);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { 
          input: {
            id: mockAuthor.id,
            email: mockAuthor.email,
            name: mockAuthor.name,
            waa: mockAuthor.waa,
            clan: mockAuthor.clan
          }
        }
      });
    });
  });

  describe('handleGetAuthorById', () => {
    test('handles successful retrieval', () => {
      const action = { payload: 'author-id' };
      const mockResponse = { data: { getAuthor: mockAuthor } };
      
      return expectSaga(handleGetAuthorById, action)
        .provide([
          [call(getAuthorById, 'author-id'), mockResponse]
        ])
        .call(getAuthorById, 'author-id')
        .put(authorActions.setAuthor(mockAuthor))
        .run();
    });

    test('handles GraphQL error', () => {
      const action = { payload: 'author-id' };
      const error = new Error('GraphQL Error');
      
      return expectSaga(handleGetAuthorById, action)
        .provide([
          [call(getAuthorById, 'author-id'), throwError(error)]
        ])
        .call(getAuthorById, 'author-id')
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to GET Author:', error)
        ))
        .run();
    });

    test('handles network timeout', () => {
      const action = { payload: 'author-id' };
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      
      return expectSaga(handleGetAuthorById, action)
        .provide([
          [call(getAuthorById, 'author-id'), throwError(timeoutError)]
        ])
        .call(getAuthorById, 'author-id')
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to GET Author:', timeoutError)
        ))
        .run();
    });
  });

  describe('handleCreateAuthor', () => {
    test('handles successful creation', () => {
      const action = { payload: mockAuthor };
      const mockResponse = { data: { createAuthorGuarded: mockAuthor } };
      
      return expectSaga(handleCreateAuthor, action)
        .provide([
          [call(createAuthor, mockAuthor), mockResponse]
        ])
        .call(createAuthor, mockAuthor)
        .put(authorActions.setAuthor(mockAuthor))
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Author Created')))
        .run();
    });

    test('handles creation error', () => {
      const action = { payload: mockAuthor };
      const error = new Error('Creation failed');
      
      return expectSaga(handleCreateAuthor, action)
        .provide([
          [call(createAuthor, mockAuthor), throwError(error)]
        ])
        .call(createAuthor, mockAuthor)
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to Create Author:', error)
        ))
        .run();
    });

    test('handles DynamoDB validation error', () => {
      const action = { payload: mockAuthor };
      const validationError = new Error('Invalid input');
      
      return expectSaga(handleCreateAuthor, action)
        .provide([
          [call(createAuthor, mockAuthor), throwError(validationError)]
        ])
        .call(createAuthor, mockAuthor)
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to Create Author:', validationError)
        ))
        .run();
    });
  });

  describe('handleUpdateAuthor', () => {
    test('handles successful update', () => {
      const action = { payload: mockAuthor };
      const mockResponse = { data: { updateAuthorGuarded: mockAuthor } };
      
      return expectSaga(handleUpdateAuthor, action)
        .provide([
          [call(updateAuthor, mockAuthor), mockResponse]
        ])
        .call(updateAuthor, mockAuthor)
        .put(authorActions.setAuthor(mockAuthor))
        .put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Author Updated')))
        .run();
    });

    test('handles update error', () => {
      const action = { payload: mockAuthor };
      const error = new Error('Update failed');
      
      return expectSaga(handleUpdateAuthor, action)
        .provide([
          [call(updateAuthor, mockAuthor), throwError(error)]
        ])
        .call(updateAuthor, mockAuthor)
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Error Updating Author:', error)
        ))
        .run();
    });

    test('handles concurrent update conflict', () => {
      const action = { payload: mockAuthor };
      const conflictError = new Error('Conditional check failed');
      
      return expectSaga(handleUpdateAuthor, action)
        .provide([
          [call(updateAuthor, mockAuthor), throwError(conflictError)]
        ])
        .call(updateAuthor, mockAuthor)
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Error Updating Author:', conflictError)
        ))
        .run();
    });
  });

  describe('error recovery scenarios', () => {
    test('handles malformed response gracefully', () => {
      const action = { payload: 'author-id' };
      const malformedResponse = { data: { getAuthor: null } };
      
      return expectSaga(handleGetAuthorById, action)
        .provide([
          [call(getAuthorById, 'author-id'), malformedResponse]
        ])
        .call(getAuthorById, 'author-id')
        .run();
    });

    test('handles empty author data', () => {
      const action = { payload: { ...mockAuthor, name: '' } };
      const mockResponse = { data: { createAuthorGuarded: { ...mockAuthor, name: '' } } };
      
      return expectSaga(handleCreateAuthor, action)
        .provide([
          [call(createAuthor, action.payload), mockResponse]
        ])
        .call(createAuthor, action.payload)
        .put(authorActions.setAuthor(mockResponse.data.createAuthorGuarded))
        .run();
    });
  });
});