import react from 'react'
import {fireEvent, screen, waitFor, within,} from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import path from "path";
import {when} from "jest-when";
import {API, Storage} from "aws-amplify";

import {contains, renderPage, renderWithProviders,} from '../../../__utils__/testUtilities';
import {loadLocalFile} from "../../../__utils__/fileUtilities";
import {verifyField} from '../../../__utils__/DocumentDetailsUtilities';
import {emptyUser, User} from '../../../User/userType';
import UploadPage, { title } from '../UploadPage';
import {UPLOAD_PATH} from "../../shared/constants";
import {dropFilesText} from "../../widgets/AWSFileUploader";
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {DocumentDetailsFieldDefinition} from "../../../types/fieldDefitions";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {printGyet} from "../../../Gyet/GyetType";
import * as mutations from "../../../graphql/mutations";
import {buildErrorAlert, buildSuccessAlert} from "../../../AlertBar/AlertBarTypes";
import {documentActions} from "../../../docs/documentSlice";
import authorList from "../../../data/authorList.json";
import {AuthorFormTitle} from "../../forms/AuthorForm";
import {authorActions} from "../../../Author/authorSlice";

const author: Author = {
   ...emptyAuthor,
   id: 'AUTHOR_GUID',
   name: 'example Author',
   email: 'author@example.com'
}

const TEST_USER: User = {
  ...emptyUser,
  id: 'UPLOAD_USER_GUID_HERE',
  name: 'I Upload Test Documents',
  waa: 'hukmalsk', //author
  email: 'uploader@example.com',  
}

const initBox: Xbiis = {
   ...emptyXbiis,
   id: 'BOX-GUID',
   name: 'Test Box o AWESOME!',
   owner: TEST_USER,
   xbiisOwnerId: author.id,
}

const initState = {
  user: TEST_USER,
  author: author,
  document: {
     ...emptyDocumentDetails,

     id:              'DOCUMENT-GUID-HERE',
     eng_title:       'TEST DOCUMENT TITLE',
     eng_description: 'TEST DOCUMENT DESCRIPTION',

     bc_title: 'Nahawat-BC', bc_description: 'Magon-BC',
     ak_title: 'Nahawat-AK', ak_description: 'Magon-AK',

     author:                    author,
     docOwner:                  TEST_USER,
     documentDetailsAuthorId:   author.id,
     documentDetailsDocOwnerId: TEST_USER.id,

     box:                  initBox,
     documentDetailsBoxId: initBox.id,

     //fileKey: '/PATH/TO/TEST/FILE',
     //type:    'application/example',
     version: 1,

     created: new Date().toISOString(), //TODO set specific dates/times
     updated: new Date().toISOString(),
  }
}

const fd = DocumentDetailsFieldDefinition;
userEvent.setup();

describe('Upload Page', () =>
{
   test('renders correctly', () =>
   {
     renderPage(UPLOAD_PATH, <UploadPage />, initState);

     expect(screen.getByText(contains(title))).toBeInTheDocument();
   });

   test('Uploaded Files are preserved when a new author is added.',
        async () =>
   {
      const { store } = renderPage(UPLOAD_PATH, <UploadPage />, initState);
      const doc = initState.document;

      //upload file

      //FileUploader DropZone is displayed
      expect(screen.queryByText('Disabled Until a Box is Selected'))
         .not.toBeInTheDocument();
      const dropZone = screen.getByText(dropFilesText);
      expect(dropZone).toBeInTheDocument();

      Storage.put = jest.fn();
      //@ts-ignore
      when(Storage.put).mockResolvedValue({ key: 'Meeting-poster.odt' });

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

      const textbox = screen.getByRole('combobox');

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

     expect(store.getState().document.id).toEqual(doc.id);

     //screen.debug(screen.getByTestId('awsFileUploader'));
     //@ts-ignore
     //screen.debug(screen.getByText(dropFilesText).parentElement.parentElement.parentElement);

      //verify file is still previewed
      expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();
   }, 20000);

   test('Uploaded Files are preserved when a new author is canceled.',
        async () =>
   {
      const { store } = renderPage(UPLOAD_PATH, <UploadPage />, initState);
      const doc = initState.document;

      //upload file

      //FileUploader DropZone is displayed
      expect(screen.queryByText('Disabled Until a Box is Selected'))
         .not.toBeInTheDocument();
      const dropZone = screen.getByText(dropFilesText);
      expect(dropZone).toBeInTheDocument();

      Storage.put = jest.fn();
      //@ts-ignore
      when(Storage.put).mockResolvedValue({ key: 'file' });

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

      const textbox = screen.getByRole('combobox');

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

      //await waitFor(() => {
      //  expect(store?.getState().author).toHaveProperty('name', '');
      //});

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

     Storage.put = jest.fn();
     //@ts-ignore
     when(Storage.put).mockResolvedValue({ key: 'file' });

     //resolves from project root instead of file.
     const logoFile = loadLocalFile(path.resolve('./src/images/ovoid.svg'));
     fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });

     //verify file type is correctly determined and set post, upload
     await waitFor(() => {
        expect(screen.getByLabelText(fd.type.label)).toHaveValue('image/svg+xml');
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

     //verify action was fired
     await waitFor(() => {
       expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
     }, { timeout: 2000 });

     const doc = emptyDocumentDetails;

     const idField = screen.getByTestId(fd.id.name);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     //validate ID changed
     expect(idField).not.toHaveValue(initState.document.id);
     // eslint-disable-next-line testing-library/no-node-access
     expect(document.getElementsByName('id')[0] as HTMLInputElement)
       .not.toHaveValue(doc.id);

     verifyField(fd.eng_title,       doc.eng_title);
     verifyField(fd.eng_description, doc.eng_description);

     verifyField(fd.docOwner,       printGyet(TEST_USER));
     verifyField(fd.author,         author.name);

     verifyField(fd.bc_title,       doc.bc_title);
     verifyField(fd.bc_description, doc.bc_description);

     verifyField(fd.ak_title,       doc.ak_title);
     verifyField(fd.ak_description, doc.ak_description);

     //cleared so no file
     const dlLink = screen.queryByText('Download Current File');
     expect(dlLink).not.toBeInTheDocument();

     verifyField(fd.type, `${doc.type}`);

     verifyField(fd.version, doc.version);

     //expect(store?.getState().document).toEqual(emptyDocumentDetails);

     //check for file preview, NOT to be in the document
     expect(screen.queryByText('ovoid.svg')).not.toBeInTheDocument();

     //verifyDateField(fd.created, doc.created);
     //verifyDateField(fd.updated, doc.updated);

      await waitFor(() => {
         const message = buildSuccessAlert('Document Created');
         expect(store.getState().alertMessage).toEqual(message);
      });
   });

   test('On Save Error, and form and file are preserved',
        async () =>
   {
      const state = {
         ...initState,
         document: {  ...initState.document, id: 'ERROR_GUID_HERE', }
      };
      const { store } = renderPage(UPLOAD_PATH, <UploadPage />, state);
      const doc = state.document;

      //upload file
      expect(screen.queryByText('Disabled Until a Box is Selected'))
         .not.toBeInTheDocument();
      //screen.debug(screen.getByTestId('awsFileUploader'));
      const dropZone = screen.getByText(dropFilesText);

      expect(dropZone).toBeInTheDocument();

      const logoFile = loadLocalFile(path.resolve('./src/images/ovoid.svg'));
      Storage.put = jest.fn();
      //@ts-ignore
      when(Storage.put).mockResolvedValue({ key: 'ovoid.svg' });

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
      when(API.graphql)
        .calledWith(expect.objectContaining({query: mutations.createDocumentDetails} ))
        .mockRejectedValue(createError);

      //trigger save action
      await userEvent.click(screen.getByText(create));

      let newDoc   = {...doc, fileKey: 'ovoid.svg', type: fileType }
      newDoc.updatedAt = expect.anything();
      newDoc.updated   = expect.anything();

      //verify action was fired
      await waitFor(() => {
         //expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
         // @ts-ignore
         delete newDoc.file;
         const createAction = expect.objectContaining(documentActions.createDocument(newDoc));
         expect(store.dispatch).toHaveBeenLastCalledWith(createAction);
      }, { timeout: 2000 });

      // Error Alert action dispatched
      await waitFor(() => {
        const message = buildErrorAlert(`Failed to Create Document: ${JSON.stringify(createError)}`);
        //expect(store.dispatch).toHaveBeenLastCalledWith(message);
         expect(store?.getState().alertMessage).toEqual(message);
      }, { timeout: 2000 });

      const idField = screen.getByTestId(fd.id.name);
      expect(idField).toBeInTheDocument();
      expect(idField).not.toBeVisible();
      //validate ID same
      expect(idField).not.toHaveValue(initState.document.id);
      expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();

      verifyField(fd.eng_title,       doc.eng_title);
      verifyField(fd.eng_description, doc.eng_description);

      verifyField(fd.docOwner,       printGyet(TEST_USER));
      verifyField(fd.author,         author.name);

      verifyField(fd.bc_title,       doc.bc_title);
      verifyField(fd.bc_description, doc.bc_description);

      verifyField(fd.ak_title,       doc.ak_title);
      verifyField(fd.ak_description, doc.ak_description);

      verifyField(fd.type, fileType);

      verifyField(fd.version, doc.version);

      expect(store?.getState().document).toEqual(newDoc);

      //check for file preview, to STILL be in the document
      expect(screen.getByText('ovoid.svg')).toBeInTheDocument();
      expect(screen.getByText('Uploaded')).toBeInTheDocument();

      //verifyDateField(fd.created, doc.created);
      //verifyDateField(fd.updated, doc.updated);

      await waitFor(() => {
         const message = buildErrorAlert(`Failed to Create Document: ${JSON.stringify(createError)}`);
         expect(store.getState().alertMessage).toEqual(message);
      });
   });
});