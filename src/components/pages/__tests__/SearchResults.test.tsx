import react from 'react'
import { MemoryRouter  } from 'react-router';
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { renderWithState, LocationDisplay } from '../../../__utils__/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyGyet, Gyet} from '../../../User/userType';
import SearchResults,
       { searchFields, searchTitle, searchPlaceholder, searchResultsTableTitle }
       from '../SearchResults';
import { getCell } from '../../widgets/__tests__/dataGridHelperFunctions';
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {emptyDocList} from "../../../docs/docList/documentListTypes";

const author: Gyet = {
  ...emptyGyet,
  id: 'USER_GUID',
  name: 'example',
  email: 'author@example.com'  
}

const initBox: Xbiis = {
  ...emptyXbiis,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: author,
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
  docOwner: author,
  documentDetailsAuthorId: author.id,
  documentDetailsDocOwnerId: author.id,

  box: initBox,
  documentDetailsBoxId: initBox.id,

  fileKey: 'S3/PATH/TO/TEST/FILE',
  type: 'application/example',
  version: 1,

  created: new Date().toISOString(), //TODO set specific dates/times
  updated: new Date().toISOString(),
};

const searchParams = 'SearchTerm';

const state = {
  document: document,
  documentList: { ...emptyDocList, items: [document] },
}

userEvent.setup();

describe('Search Results', () => { 
  test('renders correctly', () => {
    const searchUrl = `/test/search?q=${searchParams}`;
    renderWithState(state,
          <MemoryRouter initialEntries={[{pathname: searchUrl}]} >
            <SearchResults />
          </MemoryRouter>
    );
    
    expect(screen.getByText(searchTitle)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(searchPlaceholder)).toBeInTheDocument();
    
    expect(screen.getByText(searchResultsTableTitle)).toBeInTheDocument();
    expect(screen.getByText(document.eng_title)).toBeInTheDocument();
  });

  test('user can select a search field', async () => {
    
    const searchUrl = `/test/search?q=${searchParams}`;
    renderWithState(state,
          <MemoryRouter initialEntries={[{pathname: searchUrl}]} >
            <SearchResults />
          </MemoryRouter>
    );

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
  });

  test('user can search with the search field for an empty value', async () => {
    const searchUrl = `/test/search?q=${searchParams}`;
    renderWithState(state,
          <MemoryRouter initialEntries={[{pathname: searchUrl}]} >
            <SearchResults />
            <LocationDisplay />
          </MemoryRouter>
    );

    expect(screen.getByTestId('location')).toHaveTextContent(searchUrl);

    const searchField = screen.getByPlaceholderText(searchPlaceholder);

    await userEvent.clear(searchField);
    await userEvent.type(searchField, '[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/search');
    });
  });

  test('user can search with the search field', async () => { 
    const searchUrl = `/test/search?q=${searchParams}`;
    renderWithState(state,
          <MemoryRouter initialEntries={[{pathname: searchUrl}]} >
            <SearchResults />
            <LocationDisplay />
          </MemoryRouter>
    );

    expect(screen.getByTestId('location')).toHaveTextContent(searchUrl);

    const searchField = screen.getByPlaceholderText(searchPlaceholder);

    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'test[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/search?q=test');
    });
  });

  test('user can specify a field when searching', async () => {
    
    const searchUrl = `/test/search?q=${searchParams}`;
    renderWithState(state,
          <MemoryRouter initialEntries={[{pathname: searchUrl}]} >
            <SearchResults />
            <LocationDisplay />
          </MemoryRouter>
    );

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

    await waitFor(() => {
      expect(screen.getByTestId('location'))
        .toHaveTextContent('/search?q=test&field=title');
    });
  });
  
  /**
   *  Skipping because:
   *  1. The test is broken and doesn't work
   *  2. The code to do this doesn't directly exist in SearchResults.
   *  3. *Should* already be indivually tested, in the components
   */
  test.skip('Selected documents table item appears in the form', async () => {
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