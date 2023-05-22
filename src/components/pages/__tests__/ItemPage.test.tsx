import react from 'react'
import { MemoryRouter, Route, Routes } from 'react-router';
import { screen,  } from '@testing-library/react'

import { renderWithProviders, contains, renderWithState } from '../../../__utils__/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyGyet, Gyet} from '../../../User/userType';
import ItemPage from '../ItemPage';
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";

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
  id:    'SOME_DOC_GUID_HERE',
  eng_title: 'Test Document',
  eng_description: 'Testing Item Page',
  
  bc_title: 'BC-title', bc_description: 'BC-Desc',
  ak_title: 'AK-title', ak_description: 'AK-Desc',

  author:   author,
  docOwner: author,
  documentDetailsAuthorId: author.id,
  documentDetailsDocOwnerId: author.id,

  box: initBox,
  documentDetailsBoxId: initBox.id,
  
  fileKey: '/',
  type: 'no',
  version: 1,

  created: new Date().toISOString(), //TODO set specific dates/times
  updated: new Date().toISOString(),
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
    
    expect(screen.getByDisplayValue(document.eng_title)).toBeInTheDocument();

    expect(screen.queryByText('No Document to Render')).not.toBeInTheDocument();
  });

  test('renders correctly when fileKey is null', () => {
    const noPathState = { document: { ...document, fileKey: null } };
    const itemUrl = `/test/item/${document.id}`;
    renderWithState(noPathState,
          <MemoryRouter initialEntries={[{pathname: itemUrl}]} >
            <Routes>
              <Route path='/test/item/:itemId' element={<ItemPage />} />
            </Routes>
          </MemoryRouter>
    );
    
    expect(screen.getByDisplayValue(document.eng_title)).toBeInTheDocument();

    expect(screen.getByText('No Document to Display')).toBeInTheDocument();
  });
});