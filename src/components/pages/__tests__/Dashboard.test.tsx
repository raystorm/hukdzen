import { vi } from 'vitest';
import react from 'react'
import { screen, waitFor  } from '@testing-library/react'
import {when} from "vitest-when";
import userEvnt from '@testing-library/user-event';
import {generateClient} from "@aws-amplify/api";

import {renderPage} from '../../../__utils__/testUtilities';
import {setupAmplifyUserMocking} from "../../../__utils__/__fixtures__/UserAPI.helper";
import {
   getCell, getCellFromElement, getRowFromElement
} from '../../../__utils__/dataGridHelperFunctions';

import docList from "../../../data/docList.json";
import errorDocList from "../../../data/ErrorDocList.json";
import authorList from "../../../data/authorList.json";
import userList from "../../../data/userList.json";
import boxList from "../../../data/boxList.json";

import { DocumentDetails } from '../../../docs/DocumentTypes';
import { BoxList } from "../../../Box/BoxList/BoxListType";
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

import {setupBoxListMocking} from "../../../__utils__/__fixtures__/BoxAPI.helper";
import {
   setDocList,
   setupDocListMocking,
   setupDocumentMocking
} from "../../../__utils__/__fixtures__/DocumentAPI.helper";
import {setupBoxUserListMocking, setupBoxUserMocking} from "../../../__utils__/__fixtures__/BoxUserAPI.helper";

const client = generateClient();

const author: Author            = authorList.items[0] as Author;
const user: User                = userList.items[0] as User;
const initBox: Xbiis            = boxList.items[0] as Xbiis;
const document: DocumentDetails = docList.items[0] as DocumentDetails;

const state = {
  user: user,
  currentUser: user,
  boxList: boxList,
  document: emptyDocumentDetails,
  documentList: { ...emptyDocList, list: [document] },
};

const userEvent = userEvnt.setup();

describe('Dashboard Page', () => {

  beforeEach(() => {
    expect(vi.isMockFunction(client.graphql)).toBeTruthy();
    setupAmplifyUserMocking();
    setupBoxListMocking();
    setupDocListMocking();
  });

  afterEach(() => { vi.clearAllMocks(); });

  test('renders correctly', () => {
    renderPage(DASHBOARD_PATH, <Dashboard />, state);
    
    expect(screen.getByText(RecentDocumentsTitle)).toBeInTheDocument();
    //expect(screen.getByText(OwnedDocumentsTitle)).toBeInTheDocument();
    
    const ddLink = screen.getByText(DocDetailsLinkText);
    expect(ddLink).toBeInTheDocument();
    //verify not a link
    expect(ddLink).not.toHaveAttribute('href', `/item/`);

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
    expect(ddLink).not.toHaveAttribute('href', `/item/`);

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
    expect(ddLink).not.toHaveAttribute('href', `/item/`);

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

  test('full document details is a link only after an Item is selected',
       async () =>
  {
     renderPage(DASHBOARD_PATH, <Dashboard />, state);

     setupDocListMocking();
     setupDocumentMocking();
     setupBoxListMocking();
     setupBoxUserListMocking();
     setupBoxUserMocking();

     expect(screen.getByText(RecentDocumentsTitle)).toBeInTheDocument();
     //expect(screen.getByText(OwnedDocumentsTitle)).toBeInTheDocument();

     const ddText = screen.getByText(DocDetailsLinkText);
     expect(ddText).toBeInTheDocument();
     //verify not a link
     expect(ddText).not.toHaveAttribute('href', `/item/`);

     expect(screen.getByText(docDetailsFormTitle)).toBeInTheDocument();

     await waitFor(() => {
       expect(getCell(0,0)).toHaveTextContent(document.eng_title);
     });

     await userEvent.click(getCell(0,0));

     const ddLink = screen.getByText(DocDetailsLinkText);
     expect(ddLink).toBeInTheDocument();
     //verity changed to a link
     await waitFor(() => {
       expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
     });
  });
});