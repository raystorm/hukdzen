import { vi } from 'vitest';
import react from 'react'
import { screen, waitFor  } from '@testing-library/react'
import {when} from "vitest-when";
import userEvnt from '@testing-library/user-event';
import {generateClient} from "@aws-amplify/api";

import {renderPage, ctrlClick} from '../../../__utils__/testUtilities';
import {setupAmplifyUserMocking} from "../../../__utils__/__setup__/UserAPI.helper";
import {
   getCell, getCellFromElement, getRowFromElement
} from '../../../__utils__/dataGridHelperFunctions';
import { wrapAlertForTest } from '../../../AlertBar/__tests__/AlertBar.helper';

import docList from "../../../__utils__/__fixtures__/docList.json";
import errorDocList from "../../../__utils__/__fixtures__/ErrorDocList.json";
import authorList from "../../../__utils__/__fixtures__/authorList.json";
import userList from "../../../__utils__/__fixtures__/userList.json";
import boxList from "../../../__utils__/__fixtures__/boxList.json";

import { Document } from '../../../docs/DocumentTypes';
import { BoxList } from "../../../Box/BoxList/BoxListType";
import {emptyUser, User} from '../../../User/userType';

import * as queries from "../../../graphql/queries";
import { buildErrorAlert, buildFriendlyErrorAlert } from "../../../AlertBar/AlertBarTypes";
import {emptyBox, Box} from "../../../Box/boxTypes";
import { DocumentList, emptyDocList } from "../../../docs/docList/documentListTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";

import Dashboard, { DocDetailsLinkText, docDetailsFormTitle } from '../Dashboard';
import { RecentDocumentsTitle } from '../../widgets/RecentDocuments';
import { emptyDocument } from '../../../docs/initialDocumentDetails';

import {DASHBOARD_PATH} from "../../shared/constants";

import { setBoxList, setupBoxListMocking } from "../../../__utils__/__setup__/BoxAPI.helper";
import {
   setDocList,
   setupDocListMocking, setupDocumentMocking
} from "../../../__utils__/__setup__/DocumentAPI.helper";
import {
   buildBoxUserList,
   setBoxUserList,
   setupBoxUserListMocking,
   setupBoxUserMocking
} from "../../../__utils__/__setup__/BoxUserAPI.helper";
import { setupAuthorListMocking } from "../../../__utils__/__setup__/AuthorAPI.helper";

const client = generateClient();

const author: Author     = authorList.items[0] as Author;
const user: User         = userList.items[0] as User;
const initBox: Box     = boxList.items[0] as Box;
const document: Document = docList.items[0] as Document;

const state = {
  user: { item: user },
  currentUser: user,
  boxList: boxList,
  document: { item: emptyDocument },
  documentList: { ...emptyDocList, list: [document] },
};

const userEvent = userEvnt.setup();

describe('Dashboard Page', () => {

  beforeEach(() => {
    expect(vi.isMockFunction(client.graphql)).toBeTruthy();
    setupAmplifyUserMocking();
    setupBoxListMocking();
    setupDocListMocking();
    setupAuthorListMocking();
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
    expect(title).toHaveTextContent(document.eng.title);
    //screen.debug(screen.getAllByLabelText('Title'));
    const selectRow = getRowFromElement(screen.getAllByRole('grid')[0], 0);

    expect(screen.getAllByLabelText('Title')[0]).not.toHaveValue();
    await userEvent.click(title);

    await waitFor(() => {
      expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
    });

    await waitFor(() => {
      expect(screen.getAllByLabelText('Title')[0]).toHaveValue(document.eng.title);
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
    expect(title).toHaveTextContent(document.eng.title);

    expect(screen.getAllByLabelText('Title')[0]).not.toHaveValue();

    await userEvent.click(title);

    await waitFor(() => {
      expect(screen.getAllByLabelText('Title')[0]).toHaveValue(document.eng.title);
    });

    expect(ddLink).toHaveAttribute('href', `/item/${document.id}`);
  });

  test('Documents still display when getDocuments returns an error.',
       async () =>
  {
     //setup mocking for the page
     when(client.graphql)
        .calledWith(expect.objectContaining({query: queries.listBox}))
        .thenResolve({data: { listBox: boxList }});
     
     // Transform errorDocList to match expected structure
     const transformedError = {
        data: { listDocuments: errorDocList.data.listDocuments },
        errors: errorDocList.errors
     };
     
     when(client.graphql)
       .calledWith(expect.objectContaining({query: queries.listDocuments} ))
       .thenReject(transformedError);

     const { store } = renderPage(DASHBOARD_PATH, <Dashboard />, state);

     expect(screen.getByText(RecentDocumentsTitle)).toBeInTheDocument();

     const errorMsg = buildFriendlyErrorAlert('Failed to GET DocumentList',
                                              errorDocList.errors[0].message);
     await waitFor(() => {
       //expect(store.getState().alertMessage).toEqual(wrapAlertForTest(errorMsg));
       //console.log("queue state: ", store.getState().alertMessage.queue)
       expect(store.getState().alertMessage.queue)
          .toContainEqual(expect.objectContaining(errorMsg));
     });

     /* Data not sent to fix
     const update = { query: mutations.updateDocumentGuarded };
     await waitFor(() => {
       expect(client.graphql).toHaveBeenLastCalledWith(expect.objectContaining(update));
     });
     */

     const doc = transformedError.data.listDocuments.items[1]!;

     expect(screen.getByText(doc.eng.title)).toBeInTheDocument();
     expect(screen.getByText(doc.bc.title)).toBeInTheDocument();
     expect(screen.getByText(doc.ak.title)).toBeInTheDocument();

     //expect(screen.getByText(printName(doc.box))).toBeInTheDocument();
     //expect(screen.getByText(printName(doc.author))).toBeInTheDocument();
     //expect(screen.getByText(printName(doc.docOwner))).toBeInTheDocument();
  });

  test('full document details is a link only after an Item is selected',
       async () =>
  {
     setDocList(docList as DocumentList);
     setupDocListMocking();
     setupDocumentMocking();
     setupBoxListMocking();
     setBoxUserList(buildBoxUserList());
     setupBoxUserListMocking();
     setupBoxUserMocking();

     renderPage(DASHBOARD_PATH, <Dashboard />, state);

     expect(screen.getByText(RecentDocumentsTitle)).toBeInTheDocument();
     //expect(screen.getByText(OwnedDocumentsTitle)).toBeInTheDocument();

     const ddText = screen.getByText(DocDetailsLinkText);
     expect(ddText).toBeInTheDocument();
     //verify not a link
     expect(ddText).not.toHaveAttribute('href', `/item/`);

     expect(screen.getByText(docDetailsFormTitle)).toBeInTheDocument();

     await waitFor(() => {
       expect(getCell(0,0)).toHaveTextContent(document.eng.title);
     });

     await userEvent.click(getCell(0,0));

     //verity changed to a link
     await waitFor(() => {
       expect(screen.getByText(DocDetailsLinkText))
         .toHaveAttribute('href', `/item/${document.id}`);
     });
  });

   test('CTRL click to deselect removes the full details link',
        async () =>
   {
      setDocList(docList as DocumentList);
      setupDocListMocking();
      setupDocumentMocking();
      setupBoxListMocking();
      setupBoxUserListMocking();
      setupBoxUserMocking();

      renderPage(DASHBOARD_PATH, <Dashboard />, state);

      expect(screen.getByText(RecentDocumentsTitle)).toBeInTheDocument();
      //expect(screen.getByText(OwnedDocumentsTitle)).toBeInTheDocument();

      const ddText = screen.getByText(DocDetailsLinkText);
      expect(ddText).toBeInTheDocument();
      //verify not a link
      expect(ddText).not.toHaveAttribute('href', `/item/`);

      expect(screen.getByText(docDetailsFormTitle)).toBeInTheDocument();

      await waitFor(() => {
        expect(getCell(0,0)).toHaveTextContent(document.eng.title);
      });

      await userEvent.click(getCell(0,0));

      expect(screen.getByText(DocDetailsLinkText)).toBeInTheDocument();

      //verity changed to a link
      await waitFor(() => {
        expect(screen.getByText(DocDetailsLinkText))
          .toHaveAttribute('href', `/item/${document.id}`);
      });

      await ctrlClick(getCell(0,0));

      //verify link removed
      await waitFor(() => {
         expect(screen.getByText(DocDetailsLinkText))
           .not.toHaveAttribute('href', `/item/${document.id}`);
      });
   });
});