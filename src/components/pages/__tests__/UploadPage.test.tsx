import { vi } from 'vitest';
import react from 'react'
import {fireEvent, screen, waitFor, within,} from '@testing-library/react'
import userEvnt from '@testing-library/user-event';
import {when} from "vitest-when";
import path from "path";

import {generateClient} from "@aws-amplify/api";
import * as Storage from "@aws-amplify/storage";

import authorList from "../../../__utils__/__fixtures__/authorList.json";
import userList from "../../../__utils__/__fixtures__/userList.json";
import boxList from "../../../__utils__/__fixtures__/boxList.json";

import {contains, renderPage} from '../../../__utils__/testUtilities';
import {loadLocalFile} from "../../../__utils__/fileUtilities";
import {verifyField} from '../../../docs/__tests__/Document.helpers';
import useIfDocumentExists from '../../hooks/useIfDocumentExists';

import {emptyUser, User} from '../../../User/userType';
import {printGyet} from "../../../Gyet/GyetType";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {emptyBox, Box} from "../../../Box/boxTypes";

import { buildErrorAlert, buildFriendlyErrorAlert, buildSuccessAlert } from "../../../AlertBar/AlertBarTypes";
import { wrapAlertForTest } from "../../../AlertBar/__tests__/AlertBar.helper";

import * as mutations from "../../../graphql/mutations";
import {UPLOAD_PATH} from "../../shared/constants";
import {DocumentFieldDefinition} from "../../../types/fieldDefitions";
import { emptyDocument } from "../../../docs/initialDocumentDetails";

import { documentActions } from "../../../docs/documentSlice";
import { authorActions}  from "../../../Author/authorSlice";

import UploadPage, { title } from '../UploadPage';
import {dropFilesText} from "../../widgets/AWSFileUploader";
import {AuthorFormTitle} from "../../forms/AuthorForm";
import {setupBoxListMocking} from "../../../__utils__/__setup__/BoxAPI.helper";
import {setupBoxUserListMocking} from "../../../__utils__/__setup__/BoxUserAPI.helper";
import {
   setCreatedAuthor,
   setupAuthorListMocking,
   setupAuthorMocking
} from "../../../__utils__/__setup__/AuthorAPI.helper";
import {
   setupSearchMocking,
   setupDocumentMocking,
   setCreatedDocument, setDocExists
} from "../../../__utils__/__setup__/DocumentAPI.helper";
import { buildSummary } from "../../../Content/ContentType";

vi.mock('../../hooks/useIfDocumentExists');

const client = generateClient();

const author: Author = authorList.items[0] as Author;
const TEST_USER: User = userList.items[0] as User;
const initBox: Box = boxList.items[0] as Box;

const initState = {
  user: { item: TEST_USER },
  currentUser: TEST_USER,
  author: { item: author },
  boxList: boxList,
  document: {
     item: {
        ...emptyDocument,

        id: 'badD000d-cafe-babe-face-facadebadDad', //'DOCUMENT-GUID-HERE',
        eng: buildSummary('TEST DOCUMENT TITLE', 'TEST DOCUMENT DESCRIPTION'),

        bc: buildSummary('Nahawat-BC', 'Magon-BC'),
        ak: buildSummary('Nahawat-AK', 'Magon-AK'),

        author:           author,
        documentAuthorId: author.id,

        contentOwner:               TEST_USER,
        documentContentOwnerUserId: TEST_USER.id,

        box:                initBox,
        documentBoxBoxId: initBox.id,

        //fileKey: '/PATH/TO/TEST/FILE',
        //type:    'application/example',
        fileHash: expect.anything(),
        version:  1,

        created: new Date().toISOString(), //TODO set specific dates/times
        updated: new Date().toISOString(),
     }
  }
}

const fd = DocumentFieldDefinition;
const userEvent = userEvnt.setup();

describe('Upload Page', () =>
{
   const checkExists = vi.fn();

   beforeEach(() => {
      when(checkExists).calledWith(expect.anything()).thenReturn(false);
      when(useIfDocumentExists).calledWith()
                               .thenReturn({checkExists: checkExists, checking: false});
      setupBoxListMocking();
      setupBoxUserListMocking();
      setupAuthorListMocking();
      setupDocumentMocking();
      setDocExists(false);
      setupSearchMocking();
   });

   test('renders correctly', () =>
   {
     renderPage(UPLOAD_PATH, <UploadPage />, initState);

     expect(screen.getByText(contains(title))).toBeInTheDocument();
     //The rest of the form is verified in DocumentDetails form testing
   });

   test('Uploaded Files are preserved when a new author is added.',
        async () =>
   {
      const auth2 = authorList.items[2] as Author;
      setCreatedAuthor(auth2);
      setupAuthorMocking();

      const { store } = renderPage(UPLOAD_PATH, <UploadPage />, initState);
      const doc = initState.document.item;

      //upload file

      //FileUploader DropZone is displayed
      expect(screen.queryByText('Disabled Until a Box is Selected'))
        .not.toBeInTheDocument();
      const dropZone = screen.getByText(dropFilesText);
      expect(dropZone).toBeInTheDocument();

      //resolves from project root instead of file.
      const officeDoc = loadLocalFile(path.resolve('./testFiles/Meeting-poster.odt'));
      //expect(officeDoc).toHaveProperty('arrayBuffer');
      fireEvent.drop(dropZone, { dataTransfer: { files: [officeDoc] } });

      //verify file type is correctly determined and set post, upload
      await waitFor(() => {
         const mimeType: string = 'application/vnd.oasis.opendocument.text';
         expect(screen.getByLabelText(fd.type.label)).toHaveValue(mimeType);
      }, { timeout: 2000 }); //wait 2 seconds for the upload

      //check for file preview
      expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();

      //expect(checkExists).toHaveBeenCalled();

      //upload finished
      await waitFor(() => {
         expect(screen.getByText('Uploaded')).toBeInTheDocument();
      });

      //ensure author exists
      expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getAllByRole('combobox')[0];

      await userEvent.clear(textbox);
      await userEvent.type(textbox, auth2.name);
      await waitFor(() => {
        expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
      });
      await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

      //close the dialog
      await userEvent.click(screen.getByText('Add'));

      //verify closed
      await waitFor(() => {
        expect(screen.queryByText(AuthorFormTitle)).not.toBeInTheDocument();
     });

     //verify no new dispatches
     await waitFor(() => {
        const expName = expect.objectContaining({name: auth2.name});
        const action = authorActions.createAuthor(expName);
        expect(store.dispatch).toHaveBeenCalledWith(action);
     });

     await waitFor(() => {
        expect(store?.getState().author).toHaveProperty('name', auth2.name);
     });

     expect(screen.queryByText('Disabled Until a Box is Selected'))
        .not.toBeInTheDocument();
     expect(screen.getByText(dropFilesText)).toBeInTheDocument();

     expect(store.getState().document.item.id).toEqual(doc.id);

      //verify file is still previewed
      expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();
   }, 20000);

   test('Uploaded Files are preserved when a new author is canceled.',
        async () =>
   {
      const { store } = renderPage(UPLOAD_PATH, <UploadPage />, initState);
      const doc = initState.document.item;

      //upload file

      //FileUploader DropZone is displayed
      expect(screen.queryByText('Disabled Until a Box is Selected'))
         .not.toBeInTheDocument();
      const dropZone = screen.getByText(dropFilesText);
      expect(dropZone).toBeInTheDocument();

      //resolves from project root instead of file.
      const officeDoc = loadLocalFile(path.resolve('./testFiles/Meeting-poster.odt'));
      fireEvent.drop(dropZone, { dataTransfer: { files: [officeDoc] } });

      //verify file type is correctly determined and set post, upload
      await waitFor(() => {
         const mimeType: string = 'application/vnd.oasis.opendocument.text';
         expect(screen.getByLabelText(fd.type.label)).toHaveValue(mimeType);
      }, { timeout: 2000 }); //wait 2 seconds for the upload

      //check for file preview
      expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();

      //upload finished
      await waitFor(() => {
         expect(screen.getByText('Uploaded')).toBeInTheDocument();
      });

      //ensure author exists
      expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

      const auth2 = authorList.items[2] as Author;

      expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

      const textbox = screen.getAllByRole('combobox')[0];

      await userEvent.clear(textbox);
      await userEvent.type(textbox, auth2.name);
      await waitFor(() => {
         expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
      });
      await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

      //verify Modal open
      await waitFor(() => {
        expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
      });

      // get dispatch count
      // @ts-ignore
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      //close the dialog
      await userEvent.click(screen.getByText('Cancel'));

      //verify closed
      await waitFor(() => {
        expect(screen.queryByText(AuthorFormTitle)).not.toBeInTheDocument();
      });

      //verify no new dispatches
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      //verify file is still previewed
      expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();
   }, 20000);

   test('On Success, Save Button triggers Save action, and form is cleared.',
       async () =>
   {
     const { store } = renderPage(UPLOAD_PATH, <UploadPage />, initState);

     //upload file
     expect(screen.queryByText('Disabled Until a Box is Selected'))
        .not.toBeInTheDocument();
     //screen.debug(screen.getByTestId('awsFileUploader'));
     const dropZone = screen.getByText(dropFilesText);

     expect(dropZone).toBeInTheDocument();

     //resolves from project root instead of file.
     const logoFile = loadLocalFile(path.resolve('./src/images/ovoid.svg'));
     fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });

     //verify file type is correctly determined and set post, upload
     const fileType = 'image/svg+xml';
     await waitFor(() => {
       expect(screen.getByLabelText(fd.type.label)).toHaveValue(fileType);
     }, { timeout: 2000 }); //wait 2 seconds for the upload

     //check for file preview
     expect(screen.getByText('ovoid.svg')).toBeInTheDocument();

     //file finished uploading
     await waitFor(() => {
       expect(screen.getByText('Uploaded')).toBeInTheDocument();
     });

     //new does not increment version
     expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);

     //visible
     const create = 'Ma̱ngyen (Upload(Create New Item))';
     expect(screen.getByText(create)).toBeInTheDocument();

     // @ts-ignore
     const actionCount = store.dispatch.mock.calls.length;
     expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

     //trigger save action
     await userEvent.click(screen.getByText(create));

     let newDoc   = { ...initState.document.item,
                         fileKey: `${initState.document.item.box.id}/ovoid.svg`,
                         type: fileType }
     newDoc.updatedAt = expect.anything();
     newDoc.updated   = expect.anything();

     //verify action was fired
     await waitFor(() => {
       const createAction = expect.objectContaining(documentActions.createDocument(newDoc));
       expect(store.dispatch).toHaveBeenCalledWith(createAction);
     }, { timeout: 2000 });

     const doc = emptyDocument;

     const idField = screen.getByTestId(fd.id.name);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     //validate ID changed
     expect(idField).not.toHaveValue(initState.document.item.id);
     // eslint-disable-next-line testing-library/no-node-access
     expect(document.getElementsByName('id')[0] as HTMLInputElement)
       .not.toHaveValue(doc.id);

     await waitFor(() => {
       expect(store.getState().document.id).not.toEqual(initState.document.item.id);
     }, {timeout: 2000});

     await waitFor(() => {
        expect(screen.getByLabelText(fd.eng.title.label))
          .toHaveDisplayValue(doc.eng.title);
     });

     verifyField(fd.eng.title,       doc.eng.title);
     verifyField(fd.eng.description, doc.eng.description);

     verifyField(fd.contentOwner,   printGyet(TEST_USER));
     verifyField(fd.author,         author.name);

     verifyField(fd.bc.title,       doc.bc?.title       ?? "");
     verifyField(fd.bc.description, doc.bc?.description ?? "");

     verifyField(fd.ak.title,       doc.ak?.title       ?? "");
     verifyField(fd.ak.description, doc.ak?.description ?? "");

     //cleared so no file
     const dlLink = screen.queryByText('Download Current File');
     expect(dlLink).not.toBeInTheDocument();

     verifyField(fd.type, doc.type ?? "");

     verifyField(fd.version, doc.version);

     //check for file preview, NOT to be in the document
     expect(screen.queryByText('ovoid.svg')).not.toBeInTheDocument();

      await waitFor(() => {
         const message = wrapAlertForTest(buildSuccessAlert('Document Created'));
         expect(store.getState().alertMessage).toEqual(message);
      });
   });

   test('On Save Error, and form and file are preserved', async () =>
   {
      const state = {
         ...initState,
         document: {  ...initState.document, id: 'ERROR_GUID_HERE', }
      };
      const { store } = renderPage(UPLOAD_PATH, <UploadPage />, state);
      const doc = state.document.item;

      //upload file
      expect(screen.queryByText('Disabled Until a Box is Selected'))
         .not.toBeInTheDocument();
      //screen.debug(screen.getByTestId('awsFileUploader'));
      const dropZone = screen.getByText(dropFilesText);

      expect(dropZone).toBeInTheDocument();

      const logoFile = loadLocalFile(path.resolve('./src/images/ovoid.svg'));

      //resolves from project root instead of file.
      fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });

      //verify file type is correctly determined and set post, upload
      const fileType = 'image/svg+xml';
      await waitFor(() => {
         expect(screen.getByLabelText(fd.type.label)).toHaveValue(fileType);
      }, { timeout: 2000 }); //wait 2 seconds for the upload

      //check for file preview
      expect(screen.getByText('ovoid.svg')).toBeInTheDocument();

      //file finished uploading
      await waitFor(() => {
         expect(screen.getByText('Uploaded')).toBeInTheDocument();
      });

      //new does not increment version
      expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);

      //visible
      const create = 'Ma̱ngyen (Upload(Create New Item))';
      expect(screen.getByText(create)).toBeInTheDocument();

      // @ts-ignore
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      const createError = new Error('Forced Test Error');
      when(client.graphql)
        .calledWith(expect.objectContaining({query: mutations.createDocumentGuarded} ))
        .thenReject(createError);

      //trigger save action
      await userEvent.click(screen.getByText(create));

      let newDoc   = {...doc, fileKey: `${doc.box.id}/ovoid.svg`, type: fileType }
      newDoc.updatedAt = expect.anything();
      newDoc.updated   = expect.anything();

      //verify action was fired
      await waitFor(() => {
         // @ts-ignore
         delete newDoc.file;
         const createAction = expect.objectContaining(documentActions.createDocument(newDoc));
         expect(store.dispatch).toHaveBeenCalledWith(createAction);
      }, { timeout: 2000 });

      // Error Alert action dispatched
      await waitFor(() => {
        const message = buildFriendlyErrorAlert('Failed to Create Document', createError);
        //expect(store.dispatch).toHaveBeenLastCalledWith(message);
         expect(store?.getState().alertMessage).toEqual(wrapAlertForTest(message));
      }, { timeout: 2000 });

      const idField = screen.getByTestId(fd.id.name);
      expect(idField).toBeInTheDocument();
      expect(idField).not.toBeVisible();
      //validate ID same
      expect(idField).not.toHaveValue(initState.document.item.id);
      expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();

      verifyField(fd.eng.title,       doc.eng.title);
      verifyField(fd.eng.description, doc.eng.description);

      verifyField(fd.contentOwner,       printGyet(TEST_USER));
      verifyField(fd.author,         author.name);

      verifyField(fd.bc.title,       doc.bc.title);
      verifyField(fd.bc.description, doc.bc.description);

      verifyField(fd.ak.title,       doc.ak.title);
      verifyField(fd.ak.description, doc.ak.description);

      verifyField(fd.type, fileType);

      verifyField(fd.version, doc.version);

      expect(store?.getState().document.item).toEqual(newDoc);

      //check for file preview, to STILL be in the document
      expect(screen.getByText('ovoid.svg')).toBeInTheDocument();
      expect(screen.getByText('Uploaded')).toBeInTheDocument();

      await waitFor(() => {
         const message = buildFriendlyErrorAlert('Failed to Create Document', createError);
         expect(store.getState().alertMessage).toEqual(wrapAlertForTest(message));
      });
   });

   // TODO: onDuplicate File upload, upload is cancelled, and error msg displays
});