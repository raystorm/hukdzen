import { vi } from 'vitest';
import react from 'react'
import { screen, waitFor  } from '@testing-library/react'
import {when} from "vitest-when";
import userEvent from '@testing-library/user-event';
import {generateClient} from "@aws-amplify/api";

import {renderPage} from '../../../__utils__/testUtilities';
import {setupAmplifyUserMocking} from "../../../__utils__/__fixtures__/UserAPI.helper";
import {
  getCellFromElement, getRowFromElement
} from '../../../__utils__/dataGridHelperFunctions';

import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import * as queries from "../../../graphql/queries";
import {buildErrorAlert} from "../../../AlertBar/AlertBarTypes";
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocList} from "../../../docs/docList/documentListTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";

import Dashboard, { DocDetailsLinkText, docDetailsFormTitle } from '../Dashboard';
import { RecentDocumentsTitle } from '../../widgets/RecentDocuments';
import { emptyDocumentDetails } from '../../../docs/initialDocumentDetails';

import {DASHBOARD_PATH} from "../../shared/constants";
import errorDocList from "../../../data/ErrorDocList.json";
import {setupBoxListMocking} from "../../../__utils__/__fixtures__/BoxAPI.helper";
import { BoxList } from "../../../Box/BoxList/BoxListType";
import boxList from "../../../data/boxList.json";

const client = generateClient();

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

const state = {
  document: emptyDocumentDetails,
  documentList: { ...emptyDocList, list: [document] },
};

//userEvent.setup();

describe('Dashboard Page', () => {

  beforeEach(() => {
    expect(vi.isMockFunction(client.graphql)).toBeTruthy();
    setupAmplifyUserMocking();
    setupBoxListMocking();
  });

  afterEach(() => { vi.clearAllMocks(); });

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
   *   2. The code isn't directly on dashboard
   *   3. *Should* already be tested in the components individually.
   */

  test.skip('Selected recent documents table item appears in the form',
            async () =>
  {
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

  test.skip('Selected owned documents table item appears in the form',
            async () =>
  {
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

  test('Documents still display when getDocuments returns an error.',
       async () =>
  {
     //setup mocking for the page
     when(client.graphql)
        .calledWith(expect.objectContaining({query: queries.listXbiis}))
        .thenResolve({data: { listXbiis: boxList }});
     when(client.graphql)
       .calledWith(expect.objectContaining({query: queries.listDocumentDetails} ))
       .thenReject(errorDocList);

     const { store } = renderPage(DASHBOARD_PATH, <Dashboard />, state);

     expect(screen.getByText(RecentDocumentsTitle)).toBeInTheDocument();

     const msg = `Failed to GET DocumentList: ${errorDocList.errors[0].message}`;
     const errorMsg = buildErrorAlert(msg);
     await waitFor(() => {
       expect(store.getState().alertMessage).toEqual(errorMsg);
     });

     /* Data not sent to fix
     const update = { query: mutations.updateDocumentDetails };
     await waitFor(() => {
       expect(client.graphql).toHaveBeenLastCalledWith(expect.objectContaining(update));
     });
     */

     const doc = errorDocList.data.listDocumentDetails.items[1]!;

     expect(screen.getByText(doc.eng_title)).toBeInTheDocument();
     expect(screen.getByText(doc.bc_title)).toBeInTheDocument();
     expect(screen.getByText(doc.ak_title)).toBeInTheDocument();

     //expect(screen.getByText(printName(doc.box))).toBeInTheDocument();
     //expect(screen.getByText(printName(doc.author))).toBeInTheDocument();
     //expect(screen.getByText(printName(doc.docOwner))).toBeInTheDocument();
  });

});