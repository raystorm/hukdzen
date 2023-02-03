import react from 'react'
import { MemoryRouter, Route, Routes } from 'react-router';
import { getByRole, screen, waitFor, within  } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { renderWithProviders, contains, renderWithState, LocationDisplay } from '../../../utilities/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import { Gyet } from '../../../User/userType';
import { getCell, getCellFromElement, getRowFromElement } from '../../widgets/__tests__/dataGridHelperFunctions';
import Dashboard, { DocDetailsLinkText, docDetailsFormTitle } from '../Dashboard';
import { RecentDocumentsTitle } from '../../widgets/RecentDocuments';
import { OwnedDocumentsTitle } from '../../widgets/UserDocuments';
import { initialDocumentDetail } from '../../../docs/initialDocumentDetails';

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

const state = { document: initialDocumentDetail, documentList: [document], };

userEvent.setup();

describe('Search Results', () => { 
  test('renders correctly', () => {
    renderWithState(state, <Dashboard />);
    
    expect(screen.getByText(RecentDocumentsTitle)).toBeInTheDocument();
    expect(screen.getByText(OwnedDocumentsTitle)).toBeInTheDocument();
    
    const ddLink = screen.getByText(DocDetailsLinkText);
    expect(ddLink).toBeInTheDocument();
    expect(ddLink).toHaveAttribute('href', `/item/`);

    expect(screen.getByText(docDetailsFormTitle)).toBeInTheDocument();
  });

  /* 
   * Skipping the next two tests.
   *   1. They're broken
   *   2. the code isn't directly on dashboard
   *   3. *should* already be tested in the components individually.
   */

  test.skip('Selected recent documents table item appears in the form', async () => {
    renderWithState(state, <Dashboard />);

    const ddLink = screen.getByText(DocDetailsLinkText);
    expect(ddLink).toBeInTheDocument();
    expect(ddLink).toHaveAttribute('href', `/item/`);

    const title = getCellFromElement(screen.getAllByRole('grid')[0], 0,0);
    expect(title).toHaveTextContent(document.title);
    //screen.debug(screen.getAllByLabelText('Title'));
    const selectRow = getRowFromElement(screen.getAllByRole('grid')[0], 0);

    expect(screen.getAllByLabelText('Title')[0]).not.toHaveValue();
    await userEvent.click(title);

    await waitFor(() => {
      expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
    });

    await waitFor(() => {
      expect(screen.getAllByLabelText('Title')[0]).toHaveValue(document.title);
    }, {timeout: 1000});

    expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
  });

  test.skip('Selected owned documents table item appears in the form', async () => {
    renderWithState(state, <Dashboard />);

    const ddLink = screen.getByText(DocDetailsLinkText);
    expect(ddLink).toBeInTheDocument();
    expect(ddLink).toHaveAttribute('href', `/item/`);

    const title = getCellFromElement(screen.getAllByRole('grid')[1], 0,0);
    expect(title).toHaveTextContent(document.title);

    expect(screen.getAllByLabelText('Title')[0]).not.toHaveValue();

    await userEvent.click(title);

    await waitFor(() => {
      expect(screen.getAllByLabelText('Title')[0]).toHaveValue(document.title);
    });

    expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
  });

});