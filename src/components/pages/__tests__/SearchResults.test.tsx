import react from 'react'
import { MemoryRouter  } from 'react-router';
import { screen, waitFor } from '@testing-library/react'
import {when} from "jest-when";
import userEvent from '@testing-library/user-event';

import {generateClient} from '@aws-amplify/api';

import {
  renderWithState, LocationDisplay, renderPageWithPath
} from '../../../__utils__/testUtilities';
import { getCell } from '../../../__utils__/dataGridHelperFunctions';
import {
  setupBoxUserListMocking, setupBoxUserMocking
} from "../../../__utils__/__fixtures__/BoxUserAPI.helper";
import {
  setupDocSearchMocking
} from "../../../__utils__/__fixtures__/DocumentAPI.helper";

import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyUser, User} from '../../../User/userType';

import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {emptyDocList} from "../../../docs/docList/documentListTypes";
import {buildErrorAlert} from "../../../AlertBar/AlertBarTypes";

import * as queries from "../../../graphql/queries";
import {SEARCH_PATH} from "../../shared/constants";
import errorAdvancedSearch from "../../../data/ErrorAdvancedSearch.json";

import {documentListActions} from "../../../docs/docList/documentListSlice";
import {attemptSearchFix} from "../../../docs/docList/documentListSaga";

import SearchResults,
  { searchTitle, searchPlaceholder, searchResultsTableTitle }
  from '../SearchResults';

jest.mock('@aws-amplify/api');
const client = generateClient();

const author: Author = {
  ...emptyAuthor,
  id: 'AUTHOR_GUID',
  name: 'example Author',
  email: 'author@example.com'
}

const user: User = {
  ...emptyUser,
  id: 'USER_GUID',
  name: 'example User',
  email: 'user@example.com'
}

const initBox: Xbiis = {
  ...emptyXbiis,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: user,
  xbiisOwnerId: author.id,
}

const document: DocumentDetails = {
  ...emptyDocumentDetails,
  id: 'DOCUMENT-GUID-HERE',
  eng_title: 'TEST DOCUMENT TITLE',
  eng_description: 'TEST DOCUMENT DESCRIPTION',

  bc_title: 'Nahawat-BC', bc_description: 'Magon-BC',
  ak_title: 'Nahawat-AK', ak_description: 'Magon-AK',

  author:   author,
  docOwner: user,
  documentDetailsAuthorId:   author.id,
  documentDetailsDocOwnerId: user.id,

  box: initBox,
  documentDetailsBoxId: initBox.id,

  fileKey: 'S3/PATH/TO/TEST/FILE',
  type: 'application/example',
  version: 1,

  //TODO: set specific dates/times
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
};

const searchParams = 'SearchTerm';

const state = {
  document: document,
  documentList: { ...emptyDocList, items: [document] },
}

userEvent.setup();

describe('Search Results', () => {

  beforeEach(() => {
    setupBoxUserListMocking();
    setupBoxUserMocking();
    setupDocSearchMocking();
  });

  test('renders correctly', () =>
  {
    const searchUrl = `${SEARCH_PATH}?q=${searchParams}`;
    renderPageWithPath(searchUrl, SEARCH_PATH, <SearchResults />, state);
    
    expect(screen.getByText(searchTitle)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(searchPlaceholder)).toBeInTheDocument();
    
    expect(screen.getByText(searchResultsTableTitle)).toBeInTheDocument();
    expect(screen.getByText(document.eng_title)).toBeInTheDocument();
  });

  test('user can select a search field', async () =>
  {
    const searchUrl = `${SEARCH_PATH}?q=${searchParams}`;
    renderPageWithPath(searchUrl, SEARCH_PATH, <SearchResults />, state);

    const field = screen.getByLabelText('Field');
    
    const changeField = 'Title';
    await userEvent.click(field);

    await waitFor(() => 
    {
      expect(screen.getByRole('option', { name: changeField }))
        .toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('option', { name: changeField }));

    await waitFor(() => 
    { expect(screen.getByLabelText('Field')).toHaveTextContent(changeField); });
  }, 10000);

  test('user can search with the search field for an empty value',
       async () =>
  {
     const searchUrl = `${SEARCH_PATH}?q=${searchParams}`;
     const { store } = renderPageWithPath(searchUrl, SEARCH_PATH,
                                          <>
                                            <SearchResults />
                                            <LocationDisplay />
                                          </>, state);

     expect(screen.getByTestId('location')).toHaveTextContent(searchUrl);

     const searchField = screen.getByPlaceholderText(searchPlaceholder);
     expect(searchField).toHaveValue(searchParams);

     // @ts-ignore
    store?.dispatch.mockClear();
     await userEvent.clear(searchField);
     await waitFor(() =>{ expect(searchField).toHaveValue(''); });
     await userEvent.type(searchField, ' [Enter]');

     await waitFor(() => {
       expect(screen.getByTestId('location')).toHaveTextContent('/search');
     });

     await waitFor(() => {
       const filter = {
         filter: { keywords: { match: ' ' } }
       };
       const action = documentListActions.advancedSearch(filter);
       expect(store?.dispatch).toHaveBeenCalledWith(action);
     }, {timeout: 5000});
  }, 10000);

  test('user can search with the search field', async () =>
  {
    const searchUrl = `${SEARCH_PATH}?q=${searchParams}`;
    const { store } =
          renderPageWithPath(searchUrl, SEARCH_PATH,
                             <>
                               <SearchResults />
                               <LocationDisplay />
                             </>, state);

    expect(screen.getByTestId('location')).toHaveTextContent(searchUrl);

    const searchField = screen.getByPlaceholderText(searchPlaceholder);

    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'test[Enter]');

    /* location doesn't update on search, should it?
    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/search?q=test');
    });
    */
    await waitFor(() => {
      const search = {
        filter: { keywords: { match: 'test' } }
      };
      const action = documentListActions.advancedSearch(search);
      expect(store?.dispatch).toHaveBeenCalledWith(action);
    });
  }, 20000);

  test('user can specify a field when searching', async () =>
  {
    const searchUrl = `${SEARCH_PATH}?q=${searchParams}`;
    const { store } =
          renderPageWithPath(searchUrl, SEARCH_PATH,
                             <>
                               <SearchResults />
                               <LocationDisplay />
                             </>, state);

    const field = screen.getByLabelText('Field');
    
    const changeField = 'Title';
    await userEvent.click(field);

    await waitFor(() =>
    {
      expect(screen.getByRole('option', { name: changeField }))
        .toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('option', { name: changeField }));

    await waitFor(() => 
    { expect(screen.getByLabelText('Field')).toHaveTextContent(changeField); });

    expect(screen.getByTestId('location')).toHaveTextContent(searchUrl);

    const searchField = screen.getByPlaceholderText(searchPlaceholder);

    // @ts-ignore
    store?.dispatch.mockClear();
    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'test[Enter]');

    /* Search no longer updates location, should it?
    await waitFor(() => {
      expect(screen.getByTestId('location'))
        .toHaveTextContent('/search?q=test&field=eng_title');
    });
    */
    await waitFor(() => {
      const search = expect.objectContaining(
         { filter: { eng_title: { match: 'test' } } }
      );
      const action = documentListActions.advancedSearch(search);
      expect(store?.dispatch).toHaveBeenCalledWith(action);
    });
  }, 10000);

  /**
   *  Skipping because:
   *  1. The test is broken and doesn't work
   *  2. The code to do this doesn't directly exist in SearchResults.
   *  3. *Should* already be individually tested, in the components
   */
  test.skip('Selected documents table item appears in the form', async () =>
  {
    const searchUrl = `/test/search?q=${searchParams}`;
    let noDocState = { documentList: [document] };
    renderWithState(noDocState,
          <MemoryRouter initialEntries={[{pathname: searchUrl}]} >
            <SearchResults />
          </MemoryRouter>
    );

    const title = getCell(0,0);
    expect(title).toHaveTextContent(document.eng_title);

    expect(title).not.toEqual(screen.getAllByLabelText('Title')[0]);
    expect(screen.getAllByLabelText('Title')[0]).not.toHaveValue();

    await userEvent.click(title);

    await waitFor(() => {
      expect(screen.getAllByLabelText('Title')[0]).toHaveValue(document.eng_title);
    });
  });

  test('Search Results Still display with Bad Data.', async () =>
  {
    //setup mocking for the page
    when(client.graphql)
       .calledWith(expect.objectContaining({query: queries.searchDocumentDetails} ))
       .mockRejectedValue(errorAdvancedSearch);

    const fixed = attemptSearchFix(errorAdvancedSearch.data.searchDocumentDetails as any);

    //for state not propagating bug
    const errorState = {
      document: fixed.items[0]!,
      documentList: { ...emptyDocList, items: fixed.items, },
    }


    const searchUrl = `${SEARCH_PATH}?q=${searchParams}`;
    const { store} =
          renderPageWithPath(searchUrl, SEARCH_PATH, <SearchResults />, errorState);

    expect(screen.getByText(searchTitle)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(searchPlaceholder)).toBeInTheDocument();
    expect(screen.getByText(searchResultsTableTitle)).toBeInTheDocument();

    const errorMessage = buildErrorAlert(`Advanced Search Failed: ${errorAdvancedSearch.errors[0].message}`);
    await waitFor(() => {
      expect(store.getState().alertMessage).toEqual(errorMessage);
    });

    const filter = {filter: { keywords: { match: 'SearchTerm' } }};
    const action = documentListActions.advancedSearch(filter);
    await waitFor(() => {
      expect(store?.dispatch).toHaveBeenCalledWith(action);
    });

    /* Bad Data is fixed in the back-end -- DATA not sent to fix.
    const update = { query: mutations.updateDocumentDetails };
    await waitFor(() => {
      expect(API.graphql).toHaveBeenLastCalledWith(expect.objectContaining(update));
    });// {timeout: 4000});
    */

    await waitFor(() => {
      expect(store?.getState().documentList).toEqual(fixed);
    });

    const doc = errorAdvancedSearch.data.searchDocumentDetails.items[0]!;

    const title = getCell(0,0);
    expect(title).toHaveTextContent(doc.eng_title);

    expect(screen.getByText(doc.eng_title)).toBeInTheDocument();
    expect(screen.getByText(doc.bc_title)).toBeInTheDocument();
    expect(screen.getByText(doc.ak_title)).toBeInTheDocument();
  });

});