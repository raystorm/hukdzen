import react from 'react'
import { vi } from 'vitest';
import { MemoryRouter  } from 'react-router';
import { screen, waitFor } from '@testing-library/react'
import { when } from "vitest-when";
import userEvnt from '@testing-library/user-event';

import { generateClient } from '@aws-amplify/api';

import authorList from '../../../__utils__/__fixtures__/authorList.json';
import userList from '../../../__utils__/__fixtures__/userList.json';
import boxList from '../../../__utils__/__fixtures__/boxList.json';

import {
  renderWithState, LocationDisplay, renderPageWithPath, stopSagas,
} from '../../../__utils__/testUtilities';
import { getCell } from '../../../__utils__/dataGridHelperFunctions';
import {
  setupBoxUserListMocking, setupBoxUserMocking
} from "../../../__utils__/__setup__/BoxUserAPI.helper";
import { setupSearchMocking } from "../../../__utils__/__setup__/DocumentAPI.helper";

import { DocumentDetails } from '../../../docs/DocumentTypes';
import type { Xbiis } from "../../../Box/boxTypes";
import type { User } from '../../../User/userType';

import { emptyDocumentDetails } from "../../../docs/initialDocumentDetails";
import { Author, emptyAuthor } from "../../../Author/AuthorType";
import { emptyDocList } from "../../../docs/docList/documentListTypes";
import { buildErrorAlert } from "../../../AlertBar/AlertBarTypes";
import { wrapAlertForTest } from "../../../AlertBar/__tests__/AlertBar.helper";

import * as queries from "../../../graphql/queries";
import {SEARCH_PATH} from "../../shared/constants";
import errorAdvancedSearch from "../../../__utils__/__fixtures__/ErrorAdvancedSearch.json";
import docList from '../../../__utils__/__fixtures__/docList.json';

import {documentListActions} from "../../../docs/docList/documentListSlice";
import {attemptDocListFix, searchBandaid} from "../../../docs/docList/documentListSaga";

import SearchResults, { searchTitle, searchResultsTableTitle } from '../SearchResults';
import { searchPlaceholder } from '../../../Search/search.utilities'
import type { SearchQueryVariables } from "../../../Search/searchTypes";

const client = generateClient();

const author: Author = authorList.items[0] as Author;
const user: User = userList.items[0] as User;
const initBox: Xbiis = boxList.items[0] as Xbiis;

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
  boxList: boxList,
  userList: userList,
  authorList: authorList,
  document: document,
  documentList: { ...emptyDocList, items: [document] },
}

const userEvent = userEvnt.setup();

describe('Search Results', () => {

  beforeEach(() => {
    setupBoxUserListMocking();
    setupBoxUserMocking();
    setupSearchMocking();
  });

  afterEach(() => { stopSagas(); });

  test('renders correctly', async () =>
  {
    const searchUrl = `${SEARCH_PATH}?q=${searchParams}`;
    const { store } = renderPageWithPath(searchUrl, SEARCH_PATH, <SearchResults />,
                                         state);
    
    expect(screen.getByText(searchTitle)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(searchPlaceholder)).toBeInTheDocument();
    
    expect(screen.getByText(searchResultsTableTitle)).toBeInTheDocument();
    expect(screen.getByText(document.eng_title)).toBeInTheDocument();

    //Validate that the search field is populated with the search term
    expect(screen.getByPlaceholderText(searchPlaceholder)).toHaveValue(searchParams);

    //const searchFilter = { filter: { keywords: { match: searchParams } } };
    const searchFilter: SearchQueryVariables = { query: searchParams, field: 'keywords' }
    //verify that the search results are displayed
    await waitFor(() => {
      expect(store?.dispatch).toHaveBeenCalledWith(
        documentListActions.advancedSearch(searchFilter));
    });

    //initial doc from search results, different from preloaded state
    const doc = docList.items[0];

    //document.id is stored but not displayed, validating Redux State instead
    await waitFor(() => {
       expect(store.getState().documentList.items[0].id).toBe(doc.id);
       //expect(store.getState().search.items[0].id).toBe(doc.id);
    });

    await waitFor(() =>
    { expect(getCell(0, 0)).toHaveTextContent(doc.eng_title); });

    expect(getCell(0, 1)).toHaveTextContent(doc.bc_title);
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
       const filter = { query: ' ', field: 'keywords' };
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
      const search = { query: 'test', field: 'keywords' };
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
      const search = expect.objectContaining({ query: 'test', field: 'eng_title' });
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
       .calledWith(expect.objectContaining({query: queries.search} ))
       .thenReject(errorAdvancedSearch);

    const fixed = attemptDocListFix(searchBandaid(errorAdvancedSearch.data.search as any));

    //for state not propagating bug
    const errorState = {
      ...state,
      document: fixed.items[0]!,
      documentList: { ...emptyDocList, items: fixed.items, },
    };

    const searchUrl = `${SEARCH_PATH}?q=${searchParams}`;
    const { store} =
          renderPageWithPath(searchUrl, SEARCH_PATH, <SearchResults />, errorState);

    expect(screen.getByText(searchTitle)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(searchPlaceholder)).toBeInTheDocument();
    expect(screen.getByText(searchResultsTableTitle)).toBeInTheDocument();

    const errorMessage = buildErrorAlert(`Advanced Search Failed: ${errorAdvancedSearch.errors[0].message}`);
    await waitFor(() => {
      expect(store.getState().alertMessage).toEqual(wrapAlertForTest(errorMessage));
    });

    const search = { query: 'SearchTerm', field: 'keywords' };
    const action = documentListActions.advancedSearch(search);
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

    const doc = errorAdvancedSearch.data.search.items[0]!.document!;

    const title = getCell(0,0);
    expect(title).toHaveTextContent(doc.eng_title);

    expect(screen.getByText(doc.eng_title)).toBeInTheDocument();
    expect(screen.getByText(doc.bc_title)).toBeInTheDocument();
    expect(screen.getByText(doc.ak_title)).toBeInTheDocument();
  });

});