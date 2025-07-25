import { call, put } from 'redux-saga/effects';
import { when } from 'jest-when';
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
import { buildErrorAlert, buildSuccessAlert } from '../../AlertBar/AlertBarTypes';
import { Author, emptyAuthor } from '../AuthorType';

jest.mock('@aws-amplify/api');

const client = generateClient();

const mockAuthor: Author = {
  ...emptyAuthor,
  id: 'author-id',
  name: 'Test Author',
  email: 'test@example.com',
  waa: 'Test Waa',
  clan: 'Test Clan'
};

describe('authorSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthorById', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { getAuthor: mockAuthor } };
      when(client.graphql).mockResolvedValue(mockResponse);

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
      const mockResponse = { data: { createAuthor: mockAuthor } };
      when(client.graphql).mockResolvedValue(mockResponse);

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
    test('handles successful retrieval', async () => {
      const action = { payload: 'author-id' };
      const mockResponse = { data: { getAuthor: mockAuthor } };
      
      const gen = handleGetAuthorById(action);
      
      expect(gen.next().value).toEqual(call(getAuthorById, 'author-id'));
      expect(gen.next(mockResponse).value).toEqual(put(authorActions.setAuthor(mockAuthor)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error', async () => {
      const action = { payload: 'author-id' };
      const error = new Error('GraphQL Error');
      
      const gen = handleGetAuthorById(action);
      
      expect(gen.next().value).toEqual(call(getAuthorById, 'author-id'));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET Author: ${JSON.stringify(error)}`)))
      );
    });

    test('handles network timeout', async () => {
      const action = { payload: 'author-id' };
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      
      const gen = handleGetAuthorById(action);
      
      expect(gen.next().value).toEqual(call(getAuthorById, 'author-id'));
      expect(gen.throw(timeoutError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET Author: ${JSON.stringify(timeoutError)}`)))
      );
    });
  });

  describe('handleCreateAuthor', () => {
    test('handles successful creation', async () => {
      const action = { payload: mockAuthor };
      const mockResponse = { data: { createAuthor: mockAuthor } };
      
      const gen = handleCreateAuthor(action);
      
      expect(gen.next().value).toEqual(call(createAuthor, mockAuthor));
      expect(gen.next(mockResponse).value).toEqual(put(authorActions.setAuthor(mockAuthor)));
      expect(gen.next().value).toEqual(put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Author Created'))));
      expect(gen.next().done).toBe(true);
    });

    test('handles creation error', async () => {
      const action = { payload: mockAuthor };
      const error = new Error('Creation failed');
      
      const gen = handleCreateAuthor(action);
      
      expect(gen.next().value).toEqual(call(createAuthor, mockAuthor));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Create Author: ${JSON.stringify(error)}`)))
      );
    });

    test('handles DynamoDB validation error', async () => {
      const action = { payload: mockAuthor };
      const validationError = {
        errors: [{ errorType: 'DynamoDB:ValidationException', message: 'Invalid input' }]
      };
      
      const gen = handleCreateAuthor(action);
      
      expect(gen.next().value).toEqual(call(createAuthor, mockAuthor));
      expect(gen.throw(validationError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to Create Author: ${JSON.stringify(validationError)}`)))
      );
    });
  });

  describe('handleUpdateAuthor', () => {
    test('handles successful update', async () => {
      const action = { payload: mockAuthor };
      const mockResponse = { data: { updateAuthor: mockAuthor } };
      
      const gen = handleUpdateAuthor(action);
      
      expect(gen.next().value).toEqual(call(updateAuthor, mockAuthor));
      expect(gen.next(mockResponse).value).toEqual(put(authorActions.setAuthor(mockAuthor)));
      expect(gen.next().value).toEqual(put(alertBarActions.DisplayAlertBox(buildSuccessAlert('Author Updated'))));
      expect(gen.next().done).toBe(true);
    });

    test('handles update error', async () => {
      const action = { payload: mockAuthor };
      const error = new Error('Update failed');
      
      const gen = handleUpdateAuthor(action);
      
      expect(gen.next().value).toEqual(call(updateAuthor, mockAuthor));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Error Updating Author: ${JSON.stringify(error)}`)))
      );
    });

    test('handles concurrent update conflict', async () => {
      const action = { payload: mockAuthor };
      const conflictError = {
        errors: [{ errorType: 'DynamoDB:ConditionalCheckFailedException' }]
      };
      
      const gen = handleUpdateAuthor(action);
      
      expect(gen.next().value).toEqual(call(updateAuthor, mockAuthor));
      expect(gen.throw(conflictError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Error Updating Author: ${JSON.stringify(conflictError)}`)))
      );
    });
  });

  describe('error recovery scenarios', () => {
    test('handles malformed response gracefully', async () => {
      const action = { payload: 'author-id' };
      const malformedResponse = { data: null };
      
      const gen = handleGetAuthorById(action);
      
      expect(gen.next().value).toEqual(call(getAuthorById, 'author-id'));
      expect(() => gen.next(malformedResponse)).not.toThrow();
    });

    test('handles empty author data', async () => {
      const action = { payload: { ...mockAuthor, name: '' } };
      const mockResponse = { data: { createAuthor: { ...mockAuthor, name: '' } } };
      
      const gen = handleCreateAuthor(action);
      
      expect(gen.next().value).toEqual(call(createAuthor, action.payload));
      expect(gen.next(mockResponse).value).toEqual(put(authorActions.setAuthor(mockResponse.data.createAuthor)));
    });
  });
});