import react from 'react'
import { MemoryRouter  } from 'react-router';
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import {renderWithState, LocationDisplay, renderPageWithPath} from '../../../__utils__/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import SearchResults,
  { searchTitle, searchPlaceholder, searchResultsTableTitle }
  from '../SearchResults';
import { getCell } from '../../../__utils__/dataGridHelperFunctions';
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {emptyDocList, SearchParams} from "../../../docs/docList/documentListTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {SEARCH_PATH} from "../../shared/constants";
import {documentListActions} from "../../../docs/docList/documentListSlice";
import {setupBoxUserListMocking, setupBoxUserMocking} from "../../../__utils__/__fixtures__/BoxUserAPI.helper";


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
  })

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

  test('user can search with the search field for an empty value', async () =>
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

    await userEvent.clear(searchField);
    await waitFor(() =>{ expect(searchField).toHaveValue(''); });
    await userEvent.type(searchField, ' [Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/search');
    });

    await waitFor(() => {
      const search: SearchParams = { keyword: ' ', field: '' };
      const action = documentListActions.searchForDocuments(search);
      expect(store?.dispatch).toHaveBeenLastCalledWith(action);
    });
  });

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
      const search: SearchParams = { keyword: 'test', field: '' };
      const action = documentListActions.searchForDocuments(search);
      expect(store?.dispatch).toHaveBeenLastCalledWith(action);
    });
  });

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

    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'test[Enter]');

    /* Search no longer updates location, should it?
    await waitFor(() => {
      expect(screen.getByTestId('location'))
        .toHaveTextContent('/search?q=test&field=eng_title');
    });
    */
    await waitFor(() => {
      const search: SearchParams = { keyword: 'test', field: 'eng_title' };
      const action = documentListActions.searchForDocuments(search);
      expect(store?.dispatch).toHaveBeenLastCalledWith(action);
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

});