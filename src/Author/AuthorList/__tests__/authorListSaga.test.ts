import { call, put } from 'redux-saga/effects';
import { when } from 'jest-when';
import { generateClient } from '@aws-amplify/api';

import {
  handleGetAuthorList,
  getAllAuthors
} from '../authorListSaga';

import { authorListActions } from '../authorListSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../../../AlertBar/AlertBarTypes';
import { authorList } from '../authorListType';
import { Author, emptyAuthor } from '../../AuthorType';

jest.mock('@aws-amplify/api');

const client = generateClient();

const mockAuthors: Author[] = [
  { ...emptyAuthor, id: 'author-1', name: 'Author One' },
  { ...emptyAuthor, id: 'author-2', name: 'Author Two' }
];

const mockAuthorList: authorList = {
  items: mockAuthors,
  nextToken: null
};

describe('authorListSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAuthors', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { listAuthors: mockAuthorList } };
      when(client.graphql).mockResolvedValue(mockResponse);

      const result = await getAllAuthors();

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String)
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('handleGetAuthorList', () => {
    test('handles successful retrieval', async () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const mockResponse = { data: { listAuthors: mockAuthorList } };
      
      const gen = handleGetAuthorList(action);
      
      expect(gen.next().value).toEqual(call(getAllAuthors));
      expect(gen.next(mockResponse).value).toEqual(put(authorListActions.setAllAuthors(mockAuthorList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error', async () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const error = new Error('GraphQL Error');
      
      const gen = handleGetAuthorList(action);
      
      expect(gen.next().value).toEqual(call(getAllAuthors));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET ALL Authors: ${JSON.stringify(error)}`)))
      );
    });

    test('handles network timeout error', async () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      
      const gen = handleGetAuthorList(action);
      
      expect(gen.next().value).toEqual(call(getAllAuthors));
      expect(gen.throw(timeoutError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET ALL Authors: ${JSON.stringify(timeoutError)}`)))
      );
    });

    test('handles empty author list', async () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const emptyResponse = { data: { listAuthors: { items: [], nextToken: null } } };
      
      const gen = handleGetAuthorList(action);
      
      expect(gen.next().value).toEqual(call(getAllAuthors));
      expect(gen.next(emptyResponse).value).toEqual(put(authorListActions.setAllAuthors(emptyResponse.data.listAuthors)));
      expect(gen.next().done).toBe(true);
    });

    test('handles malformed response gracefully', async () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const malformedResponse = { data: null };
      
      const gen = handleGetAuthorList(action);
      
      expect(gen.next().value).toEqual(call(getAllAuthors));
      expect(() => gen.next(malformedResponse)).not.toThrow();
    });

    test('handles DynamoDB scan limit exceeded', async () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const limitError = {
        errors: [{ errorType: 'DynamoDB:ProvisionedThroughputExceededException' }]
      };
      
      const gen = handleGetAuthorList(action);
      
      expect(gen.next().value).toEqual(call(getAllAuthors));
      expect(gen.throw(limitError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET ALL Authors: ${JSON.stringify(limitError)}`)))
      );
    });
  });
});