import { call, put } from 'redux-saga/effects';
import { when } from 'jest-when';
import { generateClient } from '@aws-amplify/api';

import {
  handleGetAllDocuments,
  handleGetOwnedDocuments,
  handleGetRecentDocuments,
  handleSearchDocuments,
  handleAdvancedSearch,
  getAllDocuments,
  getAllVisibleDocuments,
  getOwnedDocuments,
  getRecentDocuments,
  SearchForDocuments,
  AdvancedSearch,
  buildBoxListFilterForBoxUsers,
  attemptDocListFix,
  attemptSearchFix
} from '../documentListSaga';

import { documentListActions } from '../documentListSlice';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import { buildErrorAlert } from '../../../AlertBar/AlertBarTypes';
import { DocumentDetails } from '../../DocumentTypes';
import { emptyDocumentDetails } from '../../initialDocumentDetails';
import { SearchParams } from '../documentListTypes';
import { User, emptyUser } from '../../../User/userType';
import { BoxUserList, emptyBoxUserList } from '../../../BoxUser/BoxUserList/BoxUserListType';
import { getAllBoxUsersForUserId } from '../../../BoxUser/BoxUserList/BoxUserListSaga';
import { getCurrentAmplifyUser } from '../../../User/userSaga';
import { DefaultBox } from '../../../Box/boxTypes';
import { unknownAuthor } from '../../../Author/AuthorType';
import { buildBoxUser } from '../../../BoxUser/BoxUserType';
import { Role } from '../../../Role/roleTypes';

jest.mock('@aws-amplify/api');
jest.mock('../../../BoxUser/BoxUserList/BoxUserListSaga');
jest.mock('../../../User/userSaga', () => ({
  getCurrentAmplifyUser: jest.fn()
}));

const client = generateClient();

const mockDocument: DocumentDetails = {
  ...emptyDocumentDetails,
  id: 'doc-1',
  eng_title: 'Test Document',
  documentDetailsDocOwnerId: 'user-1',
  documentDetailsAuthorId: 'author-1',
  documentDetailsBoxId: 'box-1'
};

const mockDocumentList = {
  items: [mockDocument],
  nextToken: null
};

const mockSearchResults = {
  items: [mockDocument],
  nextToken: null,
  total: 1
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

const mockAmplifyUser = {
  username: 'user-1'
};

const mockBoxUsers: BoxUserList = {
  ...emptyBoxUserList,
  items: [buildBoxUser(mockUser, DefaultBox, Role.Read)]
};

describe('documentListSaga', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDocuments', () => {
    test('calls GraphQL with correct parameters', async () => {
      const mockResponse = { data: { listDocumentDetails: mockDocumentList } };
      when(client.graphql).mockResolvedValue(mockResponse);

      const result = await getAllDocuments();

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String)
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllVisibleDocuments', () => {
    test('calls GraphQL with box filter', async () => {
      const mockResponse = { data: { listDocumentDetails: mockDocumentList } };
      when(client.graphql).mockResolvedValue(mockResponse);

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
      const mockResponse = { data: { listDocumentDetails: mockDocumentList } };
      when(client.graphql).mockResolvedValue(mockResponse);

      const result = await getOwnedDocuments('user-1');

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: { 
          filter: { documentDetailsDocOwnerId: { eq: 'user-1' } }
        }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('SearchForDocuments', () => {
    test('calls GraphQL with search parameters', async () => {
      const searchParams: SearchParams = {
        keyword: 'test',
        field: 'keywords',
        sortField: 'created',
        sortDirection: 'ASC'
      };
      const mockResponse = { data: { searchDocumentDetails: mockSearchResults } };
      when(client.graphql).mockResolvedValue(mockResponse);

      const result = await SearchForDocuments(searchParams, mockBoxUsers);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: {
          filter: expect.objectContaining({
            and: expect.arrayContaining([
              { keywords: { match: 'test' } }
            ])
          }),
          sort: expect.any(Array)
        }
      });
      expect(result).toEqual(mockResponse);
    });

    test('handles search without box users filter', async () => {
      const searchParams: SearchParams = {
        keyword: 'test',
        field: 'keywords'
      };
      const mockResponse = { data: { searchDocumentDetails: mockSearchResults } };
      when(client.graphql).mockResolvedValue(mockResponse);

      await SearchForDocuments(searchParams, null);

      expect(client.graphql).toHaveBeenCalledWith({
        query: expect.any(String),
        variables: {
          filter: { keywords: { match: 'test' } },
          sort: expect.any(Array)
        }
      });
    });
  });

  describe('handleGetAllDocuments', () => {
    test('handles admin user - gets all documents', async () => {
      const action = { payload: [], type: 'test' };
      const mockResponse = { data: { listDocumentDetails: mockDocumentList } };
      
      const gen = handleGetAllDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect
      expect(gen.next(mockAdminUser).value).toEqual(call(getAllDocuments));
      expect(gen.next(mockResponse).value).toEqual(put(documentListActions.setDocumentsList(mockDocumentList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles non-admin user - gets visible documents', async () => {
      const action = { payload: [], type: 'test' };
      const mockBoxUsersResponse = { data: { listBoxUsers: mockBoxUsers } };
      const mockResponse = { data: { listDocumentDetails: mockDocumentList } };
      
      const gen = handleGetAllDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect
      expect(gen.next(mockUser).value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.next(mockBoxUsersResponse).value).toEqual(call(getAllVisibleDocuments, mockBoxUsers));
      expect(gen.next(mockResponse).value).toEqual(put(documentListActions.setDocumentsList(mockDocumentList)));
      expect(gen.next().done).toBe(true);
    });

    test('handles GraphQL error with data recovery', async () => {
      const action = { payload: [], type: 'test' };
      const errorWithData = {
        data: { listDocumentDetails: mockDocumentList },
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



  describe('handleSearchDocuments', () => {
    test('handles keyword search for non-admin user', async () => {
      const searchParams: SearchParams = { keyword: 'test' };
      const action = { payload: searchParams, type: 'test' };
      const mockBoxUsersResponse = { data: { listBoxUsers: mockBoxUsers } };
      const mockResponse = { data: { searchDocumentDetails: mockSearchResults } };
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockUser).value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.next(mockBoxUsersResponse).value).toEqual(call(SearchForDocuments, searchParams, mockBoxUsers));
      expect(gen.next(mockResponse).value).toEqual(put(documentListActions.setDocumentsList(mockSearchResults)));
      expect(gen.next().done).toBe(true);
    });

    test('handles empty keyword search - gets all visible documents', async () => {
      const searchParams: SearchParams = { keyword: '' };
      const action = { payload: searchParams, type: 'test' };
      const mockBoxUsersResponse = { data: { listBoxUsers: mockBoxUsers } };
      const mockResponse = { data: { listDocumentDetails: mockDocumentList } };
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockUser).value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      expect(gen.next(mockBoxUsersResponse).value).toEqual(expect.any(Object)); // appSelect boxUserList
      
      expect(gen.next(mockBoxUsers).value).toEqual(call(getAllVisibleDocuments, expect.objectContaining({
        items: expect.arrayContaining([expect.any(Object)])
      })));
      expect(gen.next(mockResponse).value).toEqual(put(documentListActions.setDocumentsList(undefined)));
      expect(gen.next().done).toBe(true);
    });

    test('handles admin user search', async () => {
      const searchParams: SearchParams = { keyword: 'test' };
      const action = { payload: searchParams, type: 'test' };
      const mockResponse = { data: { searchDocumentDetails: mockSearchResults } };
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockAdminUser).value).toEqual(call(SearchForDocuments, searchParams, null));
      expect(gen.next(mockResponse).value).toEqual(put(documentListActions.setDocumentsList(mockSearchResults)));
      expect(gen.next().done).toBe(true);
    });

    test('handles search error with data recovery', async () => {
      const searchParams: SearchParams = { keyword: 'test' };
      const action = { payload: searchParams, type: 'test' };
      const errorWithData = {
        data: { searchDocumentDetails: mockSearchResults },
        errors: [{ message: 'Search partial failure' }]
      };
      
      const gen = handleSearchDocuments(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(SearchForDocuments, searchParams, null));
      expect(gen.throw(errorWithData).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert('Failed to GET DocumentList: Search partial failure')))
      );
      expect(gen.next().value).toEqual(call(attemptSearchFix, mockSearchResults));
      expect(gen.next(mockSearchResults).value).toEqual(put(documentListActions.setDocumentsList(mockSearchResults)));
    });
  });

  describe('handleAdvancedSearch', () => {
    test('handles advanced search for admin user', async () => {
      const query = { filter: { eng_title: { match: 'test' } } };
      const action = { payload: query, type: 'test' };
      const mockResponse = { data: { searchDocumentDetails: mockSearchResults } };
      
      const gen = handleAdvancedSearch(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockAdminUser).value).toEqual(call(AdvancedSearch, query, null));
      expect(gen.next(mockResponse).value).toEqual(put(documentListActions.setDocumentsList(mockSearchResults)));
      expect(gen.next().done).toBe(true);
    });

    test('handles advanced search for non-admin user with box filtering', async () => {
      const query = { filter: { eng_title: { match: 'test' } } };
      const action = { payload: query, type: 'test' };
      const mockBoxUsersResponse = { data: { listBoxUsers: mockBoxUsers } };
      const mockResponse = { data: { searchDocumentDetails: mockSearchResults } };
      
      const gen = handleAdvancedSearch(action);
      
      expect(gen.next().value).toEqual(expect.any(Object)); // appSelect currentUser
      expect(gen.next(mockUser).value).toEqual(call(getAllBoxUsersForUserId, 'user-1'));
      
      const expectedQuery = {
        ...query,
        filter: {
          and: [
            query.filter,
            expect.objectContaining({ or: expect.any(Array) })
          ]
        }
      };
      expect(gen.next(mockBoxUsersResponse).value).toEqual(call(AdvancedSearch, expectedQuery, mockBoxUsers));
      expect(gen.next(mockResponse).value).toEqual(put(documentListActions.setDocumentsList(mockSearchResults)));
      expect(gen.next().done).toBe(true);
    });

    test('handles advanced search error', async () => {
      const query = { filter: { eng_title: { match: 'test' } } };
      const action = { payload: query, type: 'test' };
      const error = new Error('Advanced search failed');
      
      const gen = handleAdvancedSearch(action);
      
      expect(gen.next().value).toEqual(expect.any(Object));
      expect(gen.next(mockAdminUser).value).toEqual(call(AdvancedSearch, query, null));
      expect(gen.throw(error).value).toEqual(
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Advanced Search Failed: ${JSON.stringify(error)}`)))
      );
    });
  });

  describe('buildBoxListFilterForBoxUsers', () => {
    test('builds filter with default box and user boxes', () => {
      const result = buildBoxListFilterForBoxUsers(mockBoxUsers);
      
      expect(result).toEqual({
        or: [
          { documentDetailsBoxId: { eq: DefaultBox.id } },
          { documentDetailsBoxId: { eq: DefaultBox.id } } // from mockBoxUsers
        ]
      });
    });

    test('handles empty box users list', () => {
      const emptyBoxUsers = { ...emptyBoxUserList, items: [] };
      const result = buildBoxListFilterForBoxUsers(emptyBoxUsers);
      
      expect(result).toEqual({
        or: [{ documentDetailsBoxId: { eq: DefaultBox.id } }]
      });
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
        documentDetailsDocOwnerId: null,
        documentDetailsAuthorId: null,
        documentDetailsBoxId: null,
        docOwner: null,
        author: null,
        box: null
      };
      const brokenList = { items: [brokenDoc], nextToken: null };
      
      const result = attemptDocListFix(brokenList);
      
      expect(result.items[0]).toEqual(expect.objectContaining({
        documentDetailsDocOwnerId: DefaultBox.xbiisOwnerId,
        documentDetailsAuthorId: unknownAuthor.id,
        documentDetailsBoxId: DefaultBox.id,
        docOwner: DefaultBox.owner,
        author: unknownAuthor,
        box: DefaultBox
      }));
    });

    test('skips null items', () => {
      const listWithNulls = { items: [null, mockDocument, null], nextToken: null };
      
      const result = attemptDocListFix(listWithNulls);
      
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(mockDocument);
    });

    test('preserves valid documents unchanged', () => {
      const validList = { items: [mockDocument], nextToken: null };
      
      const result = attemptDocListFix(validList);
      
      expect(result.items[0]).toEqual(mockDocument);
    });
  });

  describe('attemptSearchFix', () => {
    test('fixes missing required fields in search results', () => {
      const brokenDoc = {
        ...mockDocument,
        documentDetailsDocOwnerId: null,
        documentDetailsAuthorId: null,
        documentDetailsBoxId: null
      };
      const brokenSearchResults = { items: [brokenDoc], nextToken: null, total: 1 };
      
      const result = attemptSearchFix(brokenSearchResults);
      
      expect(result.items[0]).toEqual(expect.objectContaining({
        documentDetailsDocOwnerId: DefaultBox.xbiisOwnerId,
        documentDetailsAuthorId: unknownAuthor.id,
        documentDetailsBoxId: DefaultBox.id
      }));
    });

    test('handles empty search results', () => {
      const emptyResults = { items: [], nextToken: null, total: 0 };
      
      const result = attemptSearchFix(emptyResults);
      
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });
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
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET DocumentList: ${JSON.stringify(throttleError)}`)))
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
        put(alertBarActions.DisplayAlertBox(buildErrorAlert(`Failed to GET DocumentList: ${JSON.stringify(timeoutError)}`)))
      );
    });
  });
});