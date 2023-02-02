import react from 'react'
import { MemoryRouter, Route, Routes } from 'react-router';
import { getByRole, screen, waitFor, within  } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { renderWithProviders, contains, renderWithState, LocationDisplay } from '../../../utilities/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import { Gyet } from '../../../User/userType';
import ItemPage from '../ItemPage';
import SearchResults,
       { searchFields, searchTitle, searchPlaceholder, searchResultsTableTitle }
       from '../SearchResults';
import { getCell } from '../../widgets/__tests__/dataGridHelperFunctions';

const author: Gyet = {
  id: 'USER_GUID',
  name: 'example',
  email: 'author@example.com'  
}

const document: DocumentDetails = {
  id:    'SOME_DOC_GUID_HERE',
  title: 'Test Document',
  description: 'Testing Item Page',
  
  bc: { title: 'BC-title', description: 'BC-Desc' },
  ak: { title: 'AK-title', description: 'AK-Desc' },

  authorId: author.id,
  ownerId: author.id,
  
  created: new Date(),
  filePath: '/',
  version: 1,
  type: 'no',
}

const searchParams = 'SearchTerm';

const state = {
  document: document,
  documentList: [document],
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
    expect(screen.getByText(document.title)).toBeInTheDocument();
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

    expect(screen.getByTestId('location-display')).toHaveTextContent(searchUrl);

    const searchField = screen.getByPlaceholderText(searchPlaceholder);

    await userEvent.clear(searchField);
    await userEvent.type(searchField, '[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location-display'))
      .toHaveTextContent('/search');
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

    expect(screen.getByTestId('location-display')).toHaveTextContent(searchUrl);

    const searchField = screen.getByPlaceholderText(searchPlaceholder);

    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'test[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location-display'))
      .toHaveTextContent('/search?q=test');
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

    expect(screen.getByTestId('location-display')).toHaveTextContent(searchUrl);

    const searchField = screen.getByPlaceholderText(searchPlaceholder);

    await userEvent.clear(searchField);
    await userEvent.type(searchField, 'test[Enter]');

    await waitFor(() => {
      expect(screen.getByTestId('location-display'))
        .toHaveTextContent('/search?q=test&field=title');
    });
  });
  
  test('Selected documents table item appears in the form', async () => {
    const searchUrl = `/test/search?q=${searchParams}`;
    renderWithState(state,
          <MemoryRouter initialEntries={[{pathname: searchUrl}]} >
            <SearchResults />
          </MemoryRouter>
    );

    const title = getCell(0,0);
    expect(title).toHaveTextContent(document.title);

    expect(screen.getAllByLabelText('Title')[0]).toHaveValue(undefined);

    await userEvent.click(title);

    await waitFor(() => {
      expect(screen.getAllByLabelText('Title')[0]).toHaveValue(document.title);
    });
  });

});