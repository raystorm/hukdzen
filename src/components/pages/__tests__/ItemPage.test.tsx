import react from 'react'
import { MemoryRouter, Route, Routes } from 'react-router';
import { screen,  } from '@testing-library/react'

import { renderWithProviders, contains, renderWithState } from '../../../utilities/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import { Gyet } from '../../../User/userType';
import ItemPage from '../ItemPage';
import { doc } from 'prettier';

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

const state = {
  document: document,
}

describe('Item Page', () => { 
  test('renders correctly', () => {
    const itemUrl = `/test/item/${document.id}`;
    renderWithState(state,
          <MemoryRouter initialEntries={[{pathname: itemUrl}]} >
            <Routes>
              <Route path='/test/item/:itemId' element={<ItemPage />} />
            </Routes>
          </MemoryRouter>
    );
    
    expect(screen.getByDisplayValue(document.title)).toBeInTheDocument();

    expect(screen.queryByText('No Document to Render')).not.toBeInTheDocument();
  });
  test('renders correctly when filePath is null', () => {
    const noPathState = { document: { ...document, filePath: null } };
    const itemUrl = `/test/item/${document.id}`;
    renderWithState(noPathState,
          <MemoryRouter initialEntries={[{pathname: itemUrl}]} >
            <Routes>
              <Route path='/test/item/:itemId' element={<ItemPage />} />
            </Routes>
          </MemoryRouter>
    );
    
    expect(screen.getByDisplayValue(document.title)).toBeInTheDocument();

    expect(screen.getByText('No Document to Render')).toBeInTheDocument();
  });
});