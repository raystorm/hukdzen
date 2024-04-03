import react from 'react'
import {fireEvent, screen, waitFor, within,} from '@testing-library/react'
import {when} from "jest-when";
import userEvent from "@testing-library/user-event/";
import {API, Storage} from "aws-amplify";
import path from "path";

import {renderPageWithPath} from '../../../__utils__/testUtilities';
import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {ITEM_PATH} from "../../shared/constants";
import ItemPage from '../ItemPage';
import {
   setDocList,
   setGetDocument, setUpdatedDoc, setupDocListMocking, setupDocumentMocking
} from "../../../__utils__/__fixtures__/DocumentAPI.helper";
import {setupBoxUserListMocking} from "../../../__utils__/__fixtures__/BoxUserAPI.helper";
import {dropFilesText} from "../../widgets/AWSFileUploader";
import {loadLocalFile} from "../../../__utils__/fileUtilities";
import {printGyet} from "../../../Gyet/GyetType";
import authorList from "../../../data/authorList.json";
import {AuthorFormTitle} from "../../forms/AuthorForm";
import {authorActions} from "../../../Author/authorSlice";
import {verifyDateField, verifyField} from "../../../__utils__/DocumentDetailsUtilities";
import {buildErrorAlert, buildSuccessAlert} from "../../../AlertBar/AlertBarTypes";
import * as mutations from "../../../graphql/mutations";
import {documentActions} from "../../../docs/documentSlice";
import {DocumentDetailsFieldDefinition} from "../../../types/fieldDefitions";

const author: Author = {
  ...emptyAuthor,
  id: 'AUTHOR_GUID',
  name: 'example Author',
  email: 'author@example.com'  
}

const user: User = {
  ...emptyUser,
  id: 'USER_GUID',
  name: 'example User',
  email: 'user@example.com'
}

const initBox: Xbiis = {
  ...emptyXbiis,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: user,
  xbiisOwnerId: user.id,
}

const docState: DocumentDetails = {
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
  document: docState,
}

const fd = DocumentDetailsFieldDefinition;

describe('Item Page', () =>
{
  beforeEach(() => {
    //setupAmplifyUserMocking();
    setupDocListMocking();
    setGetDocument(docState);
    setupDocumentMocking();
    setupBoxUserListMocking();
    //setupBoxUserMocking();
    when(Storage.get).mockResolvedValue(docState.fileKey);
  });

  test('renders correctly', () =>
  {
    const itemUrl = `/item/${docState.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);
    
    expect(screen.getByDisplayValue(docState.eng_title)).toBeInTheDocument();

    expect(screen.queryByText('No Document to Render')).not.toBeInTheDocument();
  });

  test('renders correctly when fileKey is null', () =>
  {
    const noPathState = { document: { ...docState, fileKey: null } };
    const itemUrl = `/item/${docState.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, noPathState);
    
    expect(screen.getByDisplayValue(docState.eng_title)).toBeInTheDocument();

    expect(screen.getByText('No Document to Display')).toBeInTheDocument();
  });

  test('renders correctly with viewer', async () =>
  {
    const docList = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/docList.json';
    when(Storage.get)//.mockResolvedValue(docList);
      .mockReturnValue(Promise.resolve(docList));

    const itemUrl = `/item/${docState.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);

    expect(screen.getByDisplayValue(docState.eng_title)).toBeInTheDocument();

    expect(screen.queryByText('No Document to Render')).not.toBeInTheDocument();

    //random string from the file.
    await waitFor(() => {
      //check for the header link
      expect(screen.getByText('docList.json'))
        .toHaveAttribute('href', docList);
      //text is in an iframe, not in the docState
      //expect(screen.getByText('Sample Doc 1')).toBeInTheDocument();
    });
  });

  test('renders correctly for admin User', () => {
    const itemUrl = `/item/${docState.id}`;
    const adminState = {
      ...state,
      currentUser: {
        ...emptyUser,
        id: 'ADMIN ID',
        name: 'ADMIN USER',
        isAdmin: true,
      }
    }
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, adminState);

    expect(screen.getByDisplayValue(docState.eng_title)).toBeInTheDocument();

    expect(screen.queryByText('No Document to Render')).not.toBeInTheDocument();
  });

  test('Uploaded Files are preserved when a new author is added.',
       async () =>
  {
     const itemUrl = `/item/${docState.id}`;
     const { store } = renderPageWithPath(itemUrl, ITEM_PATH,
                                             <ItemPage />, state);

     const doc = state.document;
     //setGetDocument(doc);
     //TODO: this means something on ItemPage is inefficient, fix it.
     setDocList({items: [doc]});
     setupDocListMocking();

     //upload file
     expect(store.getState().document.id).toEqual(doc.id);

     const idField = screen.getByTestId(fd.id.name);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();

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
     /*
     await waitFor(() => {
       expect(screen.getByText('Uploaded')).toBeInTheDocument();
     }, { timeout: 2000 });
     */

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
     const itemUrl = `/item/${docState.id}`;
     const { store } = renderPageWithPath(itemUrl, ITEM_PATH,
                                             <ItemPage />, state);
     const doc = state.document;
     setDocList({items: [doc]});
     setupDocListMocking();

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

     //verify file is still previewed
     expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();
  }, 20000);

  test('On Success, Save Button triggers Save action, form is preserved.',
       async () =>
  {
     const itemUrl = `/item/${docState.id}`;
     const doc = state.document;
     setDocList({items: [doc]});
     setupDocListMocking();
     setUpdatedDoc(doc);
     setupDocumentMocking();
     const { store } = renderPageWithPath(itemUrl, ITEM_PATH,
                                             <ItemPage />, state);

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

     //version increments
     expect(screen.getByLabelText(fd.version.label))
       .toHaveValue(doc.version+1);

     //visible
     const create = 'Ma̱ngyen aamadzap (Upload better Version)';
     expect(screen.getByText(create)).toBeInTheDocument();

     // @ts-ignore
     const actionCount = store.dispatch.mock.calls.length;
     expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

     //trigger save action
     await userEvent.click(screen.getByText(create));

     let updatedDoc    = {...doc, type: fileType, version: doc.version+1, }
     updatedDoc.fileKey   = expect.anything();
     updatedDoc.updatedAt = expect.anything();
     updatedDoc.updated   = expect.anything();

     //verify update action was dispatched
     await waitFor(() => {
        // @ts-ignore
        delete updatedDoc.file;
        const updateAction = expect.objectContaining(documentActions.updateDocumentVersion(updatedDoc));
        expect(store.dispatch).toHaveBeenLastCalledWith(updateAction);
     }, { timeout: 2000 });

     const idField: HTMLInputElement =
             screen.getByTestId(fd.id.name)
     // eslint-disable-next-line testing-library/no-node-access
                   .getElementsByTagName('input')[0] as HTMLInputElement;
     //const idField = screen.getByLabelText(fd.id.label);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     //expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();
     expect(idField).toHaveDisplayValue(doc.id);

     verifyField(fd.eng_title,       doc.eng_title);
     verifyField(fd.eng_description, doc.eng_description);

     verifyField(fd.docOwner,       printGyet(user));
     verifyField(fd.author,         author.name);

     verifyField(fd.bc_title,       doc.bc_title);
     verifyField(fd.bc_description, doc.bc_description);

     verifyField(fd.ak_title,       doc.ak_title);
     verifyField(fd.ak_description, doc.ak_description);

     //download link still available
     expect(screen.getByText('Download Current File')).toBeInTheDocument();

     //uploaded file removed
     expect(screen.queryByText('Uploaded')).not.toBeInTheDocument();
     expect(screen.queryByText('ovoid.svg')).not.toBeInTheDocument();

     verifyField(fd.type, `${doc.type}`);

     verifyField(fd.version, doc.version);

     verifyDateField(fd.created, doc.created);
     verifyDateField(fd.updated, doc.updated);

     await waitFor(() => {
       const message = buildSuccessAlert('Document Updated');
       expect(store.getState().alertMessage).toEqual(message);
     });
  });

  test('On Save Error, and form and file are preserved',
       async () =>
  {
     const itemUrl = `/item/${docState.id}`;
     const { store } = renderPageWithPath(itemUrl, ITEM_PATH,
                                             <ItemPage />, state);
     const doc = state.document;
     setDocList({items: [doc]});
     setupDocListMocking();
     setUpdatedDoc(doc);
     setupDocumentMocking();

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

     //version increments
     expect(screen.getByLabelText(fd.version.label)).toHaveValue(doc.version+1);

     //visible
     const create = 'Ma̱ngyen aamadzap (Upload better Version)';
     expect(screen.getByText(create)).toBeInTheDocument();

     // @ts-ignore
     const actionCount = store.dispatch.mock.calls.length;
     expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

     const updateError = new Error('Forced Test Error');
     when(API.graphql)
        .calledWith(expect.objectContaining({query: mutations.updateDocumentDetails} ))
        .mockRejectedValue(updateError);

     //trigger save action
     await userEvent.click(screen.getByText(create));

     let updatedDoc    = {...doc, type: fileType, version: doc.version+1, }
     updatedDoc.fileKey   = expect.anything();
     updatedDoc.updatedAt = expect.anything();
     updatedDoc.updated   = expect.anything();

     //verify action was fired
     await waitFor(() => {
       // @ts-ignore
       delete updatedDoc.file;
       const updateAction = expect.objectContaining(documentActions.updateDocumentVersion(updatedDoc));
       expect(store.dispatch).toHaveBeenLastCalledWith(updateAction);
     }, { timeout: 2000 });

     // Error Alert action dispatched
     await waitFor(() => {
       const message = buildErrorAlert(`Failed to Update Document: ${JSON.stringify(updateError)}`);
       //expect(store.dispatch).toHaveBeenLastCalledWith(message);
       expect(store?.getState().alertMessage).toEqual(message);
     }, { timeout: 2000 });

     const idField = screen.getByTestId(fd.id.name);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     //validate ID same
     expect(idField).not.toHaveValue(state.document.id);
     expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();

     verifyField(fd.eng_title,       doc.eng_title);
     verifyField(fd.eng_description, doc.eng_description);

     verifyField(fd.docOwner,       printGyet(user));
     verifyField(fd.author,         author.name);

     verifyField(fd.bc_title,       doc.bc_title);
     verifyField(fd.bc_description, doc.bc_description);

     verifyField(fd.ak_title,       doc.ak_title);
     verifyField(fd.ak_description, doc.ak_description);

     verifyField(fd.type, fileType);

     verifyField(fd.version, doc.version+1);

     expect(store?.getState().document).toEqual(updatedDoc);

     //check for file preview, to STILL be in the docState
     expect(screen.getByText('ovoid.svg')).toBeInTheDocument();
     expect(screen.getByText('Uploaded')).toBeInTheDocument();

     verifyDateField(fd.created, doc.created);
     verifyDateField(fd.updated, doc.updated);

     await waitFor(() => {
       const message = buildErrorAlert(`Failed to Update Document: ${JSON.stringify(updateError)}`);
       expect(store.getState().alertMessage).toEqual(message);
     });
  });
});