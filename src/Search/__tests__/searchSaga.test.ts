import { vi } from 'vitest';
import { call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { when } from 'vitest-when';
import { generateClient } from '@aws-amplify/api';

import { handleSearchDocuments, searchDocuments } from '../searchSaga';
import { searchActions } from '../searchSlice';
import { uiActions } from '../../UI/uiSlice';
import { emptySearchResults, emptySearchResultItem } from '../searchTypes';
import type { SearchQueryVariables, SearchResults } from '../searchTypes';
import { emptyDocument } from '../../docs/initialDocumentDetails';
import { buildSummary } from '../../Content/ContentType';
import type { Document } from '../../docs/DocumentTypes';

const client = generateClient();

const mockDocument: Document = {
  ...emptyDocument,
  id: 'doc-1',
  eng: buildSummary('Test Document', 'Test Description'),
  bc: buildSummary('BC Test', 'BC Description'),
  ak: buildSummary('AK Test', 'AK Description'),
  documentContentOwnerUserId: 'user-1',
  documentAuthorId: 'author-1',
  documentBoxBoxId: 'box-1'
};

const mockSearchResults: SearchResults = {
  ...emptySearchResults,
  items: [{ ...emptySearchResultItem, document: mockDocument }],
  total: 1
};

describe('searchSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchDocuments', () => {
    test('calls GraphQL with search parameters', async () => {
      const params: SearchQueryVariables = {
        query: 'test',
        field: 'eng_title'
      };
      const mockResponse = { data: { search: mockSearchResults } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await searchDocuments(params);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: params
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('handleSearchDocuments', () => {
    test('handles search with nested Summary results', async () => {
      const params: SearchQueryVariables = {
        query: 'test',
        field: 'eng_title'
      };
      const action = { payload: params, type: 'test' };
      const mockResponse = { data: { searchDocuments: mockSearchResults } };

      await expectSaga(handleSearchDocuments, action)
              .provide([
                [call(searchDocuments, params), mockResponse]
              ])
              .put(uiActions.setProcessing(true))
              .call(searchDocuments, params)
              .put(searchActions.setSearchResults(mockSearchResults))
              .put(uiActions.setProcessing(false))
              .run();
    });

    test('handles search error', async () => {
      const params: SearchQueryVariables = {
        query: 'test',
        field: 'eng_title'
      };
      const action = { payload: params, type: 'test' };
      const error = new Error('Search failed');

      await expectSaga(handleSearchDocuments, action)
              .provide([
                [call(searchDocuments, params), Promise.reject(error)]
              ])
              .put(uiActions.setProcessing(true))
              .call(searchDocuments, params)
              .put(searchActions.setSearchError(error))
              .put(uiActions.setProcessing(false))
              .run();
    });

    test('handles GraphQL errors in response', async () => {
      const params: SearchQueryVariables = {
        query: 'test',
        field: 'eng_title'
      };
      const action = { payload: params, type: 'test' };
      const mockResponse = {
        data: { searchDocuments: mockSearchResults },
        errors: [{ message: 'Partial failure' }]
      };

      await expectSaga(handleSearchDocuments, action)
              .provide([
                [call(searchDocuments, params), mockResponse]
              ])
              .put(uiActions.setProcessing(true))
              .call(searchDocuments, params)
              .put(searchActions.setSearchError('Partial failure'))
              .put(uiActions.setProcessing(false))
              .run();
    });
  });
});
