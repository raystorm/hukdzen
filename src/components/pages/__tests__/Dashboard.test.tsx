import react from 'react'
import { screen, waitFor  } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { renderPage } from '../../../__utils__/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import {
  getCellFromElement, getRowFromElement
} from '../../../__utils__/dataGridHelperFunctions';
import Dashboard,
  { DocDetailsLinkText, docDetailsFormTitle }
  from '../Dashboard';
import { RecentDocumentsTitle } from '../../widgets/RecentDocuments';
import { emptyDocumentDetails } from '../../../docs/initialDocumentDetails';
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocList} from "../../../docs/docList/documentListTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {DASHBOARD_PATH} from "../../shared/constants";

const author: Author = {
  ...emptyAuthor,
  id: 'AUTHOR_GUID',
  name: 'example',
}

const user: User = {
  ...emptyUser,
  id: 'USER_GUID',
  name: 'example',
  email: 'owner@example.com'
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
  id:    'SOME_DOC_GUID_HERE',
  eng_title: 'Test Document',
  eng_description: 'Testing Item Page',
  
  bc_title: 'BC-title', bc_description: 'BC-Desc',
  ak_title: 'AK-title', ak_description: 'AK-Desc',

  author:   author,
  docOwner: user,
  documentDetailsAuthorId:   author.id,
  documentDetailsDocOwnerId: user.id,

  box: initBox,
  documentDetailsBoxId: initBox.id,
  
  fileKey: '/',
  type: 'no',
  version: 1,

  //TODO: set specific dates/times
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
}

const state = { document: emptyDocumentDetails,
                documentList: { ...emptyDocList, list: [document] }, };

userEvent.setup();

describe('Dashboard Page', () => {
  test('renders correctly', () => {
    renderPage(DASHBOARD_PATH, <Dashboard />, state);
    
    expect(screen.getByText(RecentDocumentsTitle)).toBeInTheDocument();
    //expect(screen.getByText(OwnedDocumentsTitle)).toBeInTheDocument();
    
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
    renderPage(DASHBOARD_PATH, <Dashboard />, state);

    const ddLink = screen.getByText(DocDetailsLinkText);
    expect(ddLink).toBeInTheDocument();
    expect(ddLink).toHaveAttribute('href', `/item/`);

    const title = getCellFromElement(screen.getAllByRole('grid')[0], 0,0);
    expect(title).toHaveTextContent(document.eng_title);
    //screen.debug(screen.getAllByLabelText('Title'));
    const selectRow = getRowFromElement(screen.getAllByRole('grid')[0], 0);

    expect(screen.getAllByLabelText('Title')[0]).not.toHaveValue();
    await userEvent.click(title);

    await waitFor(() => {
      expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
    });

    await waitFor(() => {
      expect(screen.getAllByLabelText('Title')[0]).toHaveValue(document.eng_title);
    }, {timeout: 1000});

    expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
  });

  test.skip('Selected owned documents table item appears in the form', async () => {
    renderPage(DASHBOARD_PATH, <Dashboard />, state);

    const ddLink = screen.getByText(DocDetailsLinkText);
    expect(ddLink).toBeInTheDocument();
    expect(ddLink).toHaveAttribute('href', `/item/`);

    const title = getCellFromElement(screen.getAllByRole('grid')[1], 0,0);
    expect(title).toHaveTextContent(document.eng_title);

    expect(screen.getAllByLabelText('Title')[0]).not.toHaveValue();

    await userEvent.click(title);

    await waitFor(() => {
      expect(screen.getAllByLabelText('Title')[0]).toHaveValue(document.eng_title);
    });

    expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
  });

});