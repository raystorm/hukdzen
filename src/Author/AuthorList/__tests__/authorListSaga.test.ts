import { vi } from 'vitest';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { when } from 'vitest-when';
import { generateClient } from '@aws-amplify/api';

import {
  handleGetAuthorList,
  getAllAuthors
} from '../authorListSaga';

import { authorListActions } from '../authorListSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildFriendlyErrorAlert } from '../../../AlertBar/AlertBarTypes';
import { authorList } from '../authorListType';
import { Author, emptyAuthor } from '../../AuthorType';

const client = generateClient();

const mockAuthors: Author[] = [
  { ...emptyAuthor, id: 'author-1', name: 'Author One' },
  { ...emptyAuthor, id: 'author-2', name: 'Author Two' }
];

const mockAuthorList: authorList = {
   __typename: "ModelAuthorConnection",
   items:      mockAuthors,
  nextToken:   null
};

describe('authorListSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllAuthors', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { listAuthorDetailed: mockAuthorList } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getAllAuthors();

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String)
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('handleGetAuthorList', () => {
    test('handles successful retrieval', () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const mockResponse = { data: { listAuthorDetailed: mockAuthorList } };
      
      return expectSaga(handleGetAuthorList, action)
        .provide([
          [call(getAllAuthors), mockResponse]
        ])
        .call(getAllAuthors)
        .put(authorListActions.setAllAuthors(mockAuthorList))
        .run();
    });

    test('handles GraphQL error', () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const error = new Error('GraphQL Error');
      
      return expectSaga(handleGetAuthorList, action)
        .provide([
          [call(getAllAuthors), throwError(error)]
        ])
        .call(getAllAuthors)
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to GET List of Authors', error)
        ))
        .run();
    });

    test('handles network timeout error', () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const timeoutError = new Error('Network timeout');
      timeoutError.name = 'TimeoutError';
      
      return expectSaga(handleGetAuthorList, action)
        .provide([
          [call(getAllAuthors), throwError(timeoutError)]
        ])
        .call(getAllAuthors)
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to GET List of Authors', timeoutError)
        ))
        .run();
    });

    test('handles empty author list', () =>
    {
      const action = { payload: mockAuthorList, type: 'test' };
      const emptyResponse = { data: { listAuthorDetailed: { items: [], nextToken: null } } };
      
      return expectSaga(handleGetAuthorList, action)
               .provide([ [call(getAllAuthors), emptyResponse] ])
               .call(getAllAuthors)
               .put(authorListActions.setAllAuthors(emptyResponse.data.listAuthorDetailed))
               .run();
    });

    test('handles null author list', () =>
    {
      const action = { payload: mockAuthorList, type: 'test' };
      const nullResponse = { data: { listAuthorDetailed: null } };

      return expectSaga(handleGetAuthorList, action)
               .provide([ [call(getAllAuthors), nullResponse] ])
               .call(getAllAuthors)
               .put(alertBarActions.DisplayAlertBox(
                  buildFriendlyErrorAlert('Failed to GET List of Authors',
                     new Error('AuthorList missing from GraphQL response.'))
               ))
               .run();
    });

    test('handles malformed response gracefully', () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const malformedResponse = { data: null };
      
      return expectSaga(handleGetAuthorList, action)
               .provide([ [call(getAllAuthors), malformedResponse] ])
               .call(getAllAuthors)
               .put(alertBarActions.DisplayAlertBox(
                  buildFriendlyErrorAlert('Failed to GET List of Authors',
                     new Error('AuthorList missing from GraphQL response.'))
               ))
               .run();
    });

    test('handles DynamoDB scan limit exceeded', () => {
      const action = { payload: mockAuthorList, type: 'test' };
      const limitError = new Error('Provisioned throughput exceeded');
      
      return expectSaga(handleGetAuthorList, action)
        .provide([
          [call(getAllAuthors), throwError(limitError)]
        ])
        .call(getAllAuthors)
        .put(alertBarActions.DisplayAlertBox(
          buildFriendlyErrorAlert('Failed to GET List of Authors', limitError)
        ))
        .run();
    });
  });
});