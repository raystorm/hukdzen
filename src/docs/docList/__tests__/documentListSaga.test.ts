import { vi } from 'vitest';
import { call, put } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { when } from 'vitest-when';
import { generateClient } from '@aws-amplify/api';

import type { ModelDocumentConnection } from '../../../graphql/API';

import {
  AdvancedSearch,
  attemptDocListFix,
  buildBoxListFilterForBoxUsers,
  getAllDocuments,
  getAllVisibleDocuments,
  getOwnedDocuments,
  handleAdvancedSearch,
  handleGetAllDocuments,
  handleSearchDocuments,
  SearchForDocuments,
} from '../documentListSaga';
import { appSelect } from '../../../app/hooks';
import { documentListActions } from '../documentListSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../../../AlertBar/AlertBarTypes';
import type { Document } from '../../DocumentTypes';
import { emptyDocument } from '../../initialDocumentDetails';
import { DocumentList, emptyDocList, SearchParams } from '../documentListTypes';
import {
         SortDirection, emptySearchResults, emptySearchResultItem,
       } from "../../../Search/searchTypes";
import type {
              SearchQueryVariables, SearchResults, SearchResultItem,
            } from "../../../Search/searchTypes";
import type { User } from '../../../User/userType';
import { emptyUser } from '../../../User/userType';
import type { BoxUserList } from '../../../BoxUser/BoxUserList/BoxUserListType';
import { emptyBoxUserList } from '../../../BoxUser/BoxUserList/BoxUserListType';
import { getAllBoxUsersForUserId } from '../../../BoxUser/BoxUserList/BoxUserListSaga';
import { DefaultBox } from '../../../Box/boxTypes';
import { unknownAuthor } from '../../../Author/AuthorType';
import { buildBoxUser } from '../../../BoxUser/BoxUserType';
import { Role } from '../../../Role/roleTypes';
import { buildSummary } from "../../../Content/ContentType";

const client = generateClient();

const mockDocument: Document = {
  ...emptyDocument,
  id: 'doc-1',
  eng: buildSummary('Test Document'),
  documentContentOwnerUserId: 'user-1',
  documentAuthorId: 'author-1',
  documentBoxXbiisId: 'box-1'
};

const mockDocumentListReturned: ModelDocumentConnection = {
  __typename: 'ModelDocumentConnection',
  items: [mockDocument],
  nextToken: null,
};

const mockSearchResults: SearchResults = {
  ...emptySearchResults,
  items: [{ ...emptySearchResultItem, document: mockDocument }],
  nextToken: null,
  total: 1
};

const mockDocumentListSet: DocumentList = {
  ...mockDocumentListReturned,
  __typename: expect.any(String), //'EmptyDocList',
  items: [mockDocument],
};

const mockSearchResultItem: SearchResultItem = {
  ...emptySearchResultItem,
  document: mockDocument,
}

const mockSearchResultsSet: SearchResults = {
  ...mockSearchResults,
  items: [mockSearchResultItem],
};

const mockUser: User = {
  ...emptyUser,
  id: 'user-1',
  isAdmin: false
};

const mockAdminUser: User = {
  ...emptyUser,
  id: 'admin-1',
  isAdmin: true
};

const mockAmplifyUser = { username: 'user-1' };

const mockBoxUsers: BoxUserList = {
  ...emptyBoxUserList,
  items: [buildBoxUser(mockUser, DefaultBox, Role.Read)]
};

describe('documentListSaga', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllDocuments', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { listDocuments: mockDocumentListReturned } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getAllDocuments();

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String)
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllVisibleDocuments', () => {
    test('calls GraphQL with box filter', async () => {
      const mockResponse = { data: { listDocuments: mockDocumentListReturned } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getAllVisibleDocuments(mockBoxUsers);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { filter: expect.objectContaining({ or: expect.any(Array) }) }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getOwnedDocuments', () => {
    test('calls GraphQL with owner filter', async () => {
      const mockResponse = { data: { listDocuments: mockDocumentListReturned } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await getOwnedDocuments('user-1');

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: {  filter: { documentContentOwnerUserId: { eq: 'user-1' } } }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('SearchForDocuments', () =>
  {
    test('calls GraphQL with search parameters', async () =>
    {
      const searchParams: SearchParams = {
        keyword: 'test',
        field: 'keywords',
        sortField: 'created',
        sortDirection: SortDirection.ASC,
      };
      const mockResponse = { data: { search: mockSearchResults } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      const result = await SearchForDocuments(searchParams, mockBoxUsers);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { query: 'test', field: 'keywords',
                     sortDirection: SortDirection.ASC, sortField: 'created',
                     boxIds: expect.anything(),
          } as SearchQueryVariables
      });
      expect(result).toEqual(mockResponse);
    });

    test('handles search without box users filter', async () =>
    {
      const searchParams: SearchParams = { keyword: 'test', field: 'keywords' };
      const mockResponse = { data: { search: mockSearchResults } };
      when(client.graphql).calledWith(expect.anything())
                          .thenResolve(mockResponse);

      await SearchForDocuments(searchParams, null);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: expect.objectContaining(
                     { query: 'test', field: 'keywords', } as SearchQueryVariables
                   )
      });
    });
  });

  describe('handleGetAllDocuments', () => {
    test('handles admin user - gets all documents', async () => {
      const action = { payload: [], type: 'test' };
      const mockResponse = { data: { listDocuments: mockDocumentListReturned } };
      
      const gen = handleGetAllDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect
      expect(gen.next(mockAdminUser).value).toEqual(call(getAllDocuments));
      expect(gen.next(mockResponse).value).toEqual(
         put(documentListActions.setDocumentsList(mockDocumentListSet)
      ));
      expect(gen.next().done).toBe(true);
    });

    test('handles non-admin user - gets visible documents', async () =>
    {
      const action = { payload: [], type: 'test' };
      const mockBoxUsersResponse = { data: { listBoxUsers: mockBoxUsers } };
      const mockResponse = { data: { listDocuments: mockDocumentListReturned } };

      await expectSaga(handleGetAllDocuments, action)
              .provide([
                [appSelect(state => state.currentUser), mockUser],
                [call(getAllBoxUsersForUserId, 'user-1'), mockBoxUsersResponse],
                [call(getAllVisibleDocuments, mockBoxUsersResponse.data.listBoxUsers), mockResponse]
              ])
              .withState({ currentUser: mockUser })
              .call(getAllBoxUsersForUserId, 'user-1')
              .call(getAllVisibleDocuments, mockBoxUsers)
              .put(documentListActions.setDocumentsList({...mockDocumentListSet,
                                                          __typename: 'ModelDocumentConnection',
                                                         }))
              .run();
    });

    test('handles GraphQL error with data recovery', async () => {
      const action = { payload: [], type: 'test' };
      const errorWithData = {
        data: { listDocuments: mockDocumentListReturned },
        errors: [{ message: 'Partial failure' }]
      };
      
      const gen = handleGetAllDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(getAllDocuments));
      expect(gen.throw(errorWithData).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert('Failed to GET DocumentList: Partial failure')))
      );
      expect(gen.next().value).toEqual(put(documentListActions.setDocumentsList(expect.any(Object))));
    });

    test('handles network timeout error', async () => {
      const action = { payload: [], type: 'test' };
      const timeoutError = new Error('Network timeout');
      
      const gen = handleGetAllDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(getAllDocuments));
      expect(gen.throw(timeoutError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET DocumentList: ${JSON.stringify(timeoutError)}`)))
      );
    });
  });

  // Note: handleGetOwnedDocuments and handleGetRecentDocuments use getCurrentAmplifyUser()
  // which is difficult to test with generators. These would need integration testing.
  // Note: this is out of date w/ expectSaga style, getCurrentAmplifyUser() in a call()


  describe('handleSearchDocuments', () =>
  {
    test('handles keyword search for non-admin user', async () => {
      const searchParams: SearchParams = { keyword: 'test' };
      const action = { payload: searchParams, type: 'test' };
      const mockBoxUsersResponse = { data: { listBoxUsers: mockBoxUsers } };
      const mockResponse = { data: { search: mockSearchResults } };
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockUser).value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.next(mockBoxUsersResponse).value).toEqual(call(SearchForDocuments,
                                                                searchParams, mockBoxUsers));
      expect(gen.next(mockResponse).value)
        .toEqual(put(documentListActions.setDocumentsList(mockDocumentListSet)));

      expect(gen.next().done).toBe(true);
    });

    test('handles empty keyword search - gets all visible documents', async () => {
      const searchParams: SearchParams = { keyword: '' };
      const action = { payload: searchParams, type: 'test' };
      const mockBoxUsersResponse = { data: { listBoxUsers: mockBoxUsers } };
      const mockResponse = { data: { listDocuments: mockDocumentListReturned } };
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockUser).value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.next(mockBoxUsersResponse).value).toEqual(expect.any(Object)); // appSelect boxUserList
      
      expect(gen.next(mockBoxUsers).value)
        .toEqual(call(getAllVisibleDocuments,
                      expect.objectContaining({items: expect.arrayContaining([expect.any(Object)])})));
      expect(gen.next(mockResponse).value).toEqual(
         put(documentListActions.setDocumentsList(mockDocumentListSet)
         //put(documentListActions.setDocumentsList(emptyDocList)
      ));
      expect(gen.next().done).toBe(true);
    });

    test('handles admin user search', async () => {
      const searchParams: SearchParams = { keyword: 'test' };
      const action = { payload: searchParams, type: 'test' };
      const mockResponse = { data: { search: mockSearchResults } };
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockAdminUser).value).toEqual(call(SearchForDocuments,
                                                         searchParams, null));
      expect(gen.next(mockResponse).value).toEqual(
         put(documentListActions.setDocumentsList(mockDocumentListSet)
      ));
      expect(gen.next().done).toBe(true);
    });

    test('handles search error with data recovery', async () =>
    {
      const searchParams: SearchParams = { keyword: 'test' };
      const action = { payload: searchParams, type: 'test' };
      const errorWithData = {
        data: { search: mockSearchResults },
        errors: [{ message: 'Search partial failure' }]
      };
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(SearchForDocuments,
                                                         searchParams, null));
      expect(gen.throw(errorWithData).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           'Failed to GET DocumentList: Search partial failure'
        )))
      );
      expect(gen.next().value).toEqual(call(attemptDocListFix, mockDocumentListSet));
      //expect(gen.next(mockSearchResults).value).toEqual(
      expect(gen.next(mockDocumentListSet).value).toEqual(
         put(documentListActions.setDocumentsList(mockDocumentListSet)
         ));
    });
  });

  describe('handleAdvancedSearch', () =>
  {
    test('handles advanced search for admin user', async () =>
    {
      const query: SearchQueryVariables = { query: 'test', field: 'eng_title' };
      const action = { payload: query, type: 'test' };
      const mockResponse = { data: { search: mockSearchResults } };
      
      const gen = handleAdvancedSearch(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockAdminUser).value).toEqual(call(AdvancedSearch, query, null));
      expect(gen.next(mockResponse).value).toEqual(
         put(documentListActions.setDocumentsList(mockDocumentListSet)
      ));
      expect(gen.next().done).toBe(true);
    });

    test('handles advanced search for non-admin user with box filtering',
         async () =>
    {
      const query: SearchQueryVariables = { query: 'test', field: 'eng_title' };
      const action = { payload: query, type: 'test' };
      const mockBoxUsersResponse = { data: { listBoxUsers: mockBoxUsers } };
      const mockResponse = { data: { search: mockSearchResults } };
      
      const gen = handleAdvancedSearch(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockUser).value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      
      expect(gen.next(mockBoxUsersResponse).value)
         .toEqual(call(AdvancedSearch, expect.objectContaining(query), mockBoxUsers));
      expect(gen.next(mockResponse).value).toEqual(
         put(documentListActions.setDocumentsList(mockDocumentListSet)
      ));
      expect(gen.next().done).toBe(true);
    });

    test('handles advanced search error', async () =>
    {
      const query: SearchQueryVariables = { query: 'test', field: 'eng_title' };
      const action = { payload: query, type: 'test' };
      const error = new Error('Advanced search failed');
      
      const gen = handleAdvancedSearch(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(AdvancedSearch, query, null));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `Advanced Search Failed: ${JSON.stringify(error)}`
        )))
      );
    });
  });

  describe('buildBoxListFilterForBoxUsers', () => {
    test('builds filter with default box and user boxes', () => {
      const result = buildBoxListFilterForBoxUsers(mockBoxUsers);
      
      expect(result).toEqual({
        or: [
          { documentBoxXbiisId: { eq: DefaultBox.id } },
          { documentBoxXbiisId: { eq: DefaultBox.id } } // from mockBoxUsers
        ]
      });
    });

    test('handles empty box users list', () => {
      const emptyBoxUsers = { ...emptyBoxUserList, items: [] };
      const result = buildBoxListFilterForBoxUsers(emptyBoxUsers);
      
      expect(result).toEqual({ or: [{ documentBoxXbiisId: { eq: DefaultBox.id } }] });
    });

    test('skips users with None role', () => {
      const boxUsersWithNone = {
        ...mockBoxUsers,
        items: [
          buildBoxUser(mockUser, DefaultBox, Role.None),
          buildBoxUser(mockUser, DefaultBox, Role.Read)
        ]
      };
      
      const result = buildBoxListFilterForBoxUsers(boxUsersWithNone);
      
      expect(result.or).toHaveLength(2); // Default box + 1 valid user
    });
  });

  describe('attemptDocListFix', () => {
    test('fixes missing required fields', () => {
      const brokenDoc = {
        ...mockDocument,
        documentContentOwnerUserId: null,
        documentAuthorId: null,
        documentBoxXbiisId: null,
        contentOwner: null,
        author: null,
        box: null
      };
      const brokenList: ModelDocumentConnection = {
        // @ts-expect-error testing broken data
        __typename: "ModelDocumentConnection", items: [brokenDoc], nextToken: null
      };
      
      const result = attemptDocListFix(brokenList);
      
      expect(result.items[0]).toEqual(expect.objectContaining({
        documentContentOwnerUserId: DefaultBox.xbiisOwnerId,
        documentAuthorId: unknownAuthor.id,
        documentBoxXbiisId: DefaultBox.id,
        contentOwner: DefaultBox.owner,
        author: unknownAuthor,
        box: DefaultBox
      }));
    });

    test('skips null items', () => {
      const listWithNulls: ModelDocumentConnection = {
        __typename: "ModelDocumentConnection",
        items: [null, mockDocument, null], nextToken: null
      };
      
      const result = attemptDocListFix(listWithNulls);
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(mockDocument);
    });

    test('preserves valid documents unchanged', () => {
      const validList: ModelDocumentConnection = {
        __typename: "ModelDocumentConnection",
        items: [mockDocument], nextToken: null
      };
      
      const result = attemptDocListFix(validList);
      
      expect(result.items[0]).toEqual(mockDocument);
    });

    test('handles empty', () => {
      const emptyResults: ModelDocumentConnection = {
        __typename: "ModelDocumentConnection",
        items: [], nextToken: null,
      };

      const result = attemptDocListFix(emptyResults);

      expect(result.items).toHaveLength(0);
    });

    /*
    test('handles SearchableDocumentDetailsConnection', () => {
      const emptyResults: SearchableDocumentDetailsConnection = {
        __typename: "SearchableDocumentDetailsConnection",
        items: [], aggregateItems: [], nextToken: null,  total: 0,
      };

      const result = attemptDocListFix(emptyResults);

      expect(result.items).toHaveLength(0);
    });
    */
  });

  describe('error recovery scenarios', () => {
    test('handles DynamoDB throttling error', async () => {
      const action = { payload: [], type: 'test' };
      const throttleError = {
        errors: [{ errorType: 'DynamoDB:ProvisionedThroughputExceededException' }]
      };
      
      const gen = handleGetAllDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(getAllDocuments));
      expect(gen.throw(throttleError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `Failed to GET DocumentList: ${JSON.stringify(throttleError)}`
        )))
      );
    });

    test('handles OpenSearch timeout in search', async () => {
      const searchParams: SearchParams = { keyword: 'test' };
      const action = { payload: searchParams, type: 'test' };
      const timeoutError = new Error('OpenSearch timeout');
      timeoutError.name = 'TimeoutError';
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(SearchForDocuments, searchParams, null));
      expect(gen.throw(timeoutError).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(
           `Failed to GET DocumentList: ${JSON.stringify(timeoutError)}`
        )))
      );
    });
  });
});