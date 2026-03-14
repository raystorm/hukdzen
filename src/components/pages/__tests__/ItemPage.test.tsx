import React from 'react';
import { vi } from 'vitest';
import {act, fireEvent, screen, waitFor, within} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { when } from "vitest-when";
import path from "path";

import {generateClient} from "@aws-amplify/api";
import * as Storage from "@aws-amplify/storage";
import * as mutations from "../../../graphql/mutations";

import boxList from '../../../__utils__/__fixtures__/boxList.json';
import userList from '../../../__utils__/__fixtures__/userList.json';
import authorList from '../../../__utils__/__fixtures__/authorList.json';

import {renderPageWithPath} from '../../../__utils__/testUtilities';
import {loadLocalFile} from "../../../__utils__/fileUtilities";
import {verifyDateField, verifyField} from "../../../docs/__tests__/Document.helpers";
import {
   resetDefaults,
   setDocExists,
   setSearchResults, setDocList, setGetDocument, setUpdatedDoc,
   setupSearchMocking, setupDocListMocking, setupDocumentMocking, buildSearchResults
}
   from "../../../__utils__/__setup__/DocumentAPI.helper";
import {setupBoxUserListMocking} from "../../../__utils__/__setup__/BoxUserAPI.helper";
// eslint-disable-next-line jest/no-mocks-import
import { setUrlForTest } from "../../../__mocks__/aws-amplify/storage";
import useIfDocumentExists from "../../hooks/useIfDocumentExists";

import { alertBarActions } from "../../../AlertBar/AlertBarSlice";
import {
   buildErrorAlert,
   buildWarningAlert,
   buildSuccessAlert,
   buildFriendlyErrorAlert
} from "../../../AlertBar/AlertBarTypes";
import { wrapAlertForTest } from "../../../AlertBar/__tests__/AlertBar.helper";
import { Document } from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import {emptyXbiis, Xbiis} from "../../../Box/boxTypes";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {printGyet} from "../../../Gyet/GyetType";

import {ITEM_PATH} from "../../shared/constants";
import {DocumentFieldDefinition} from "../../../types/fieldDefitions";

import {documentActions} from "../../../docs/documentSlice";
import {authorActions} from "../../../Author/authorSlice";

import { emptyDocument } from "../../../docs/initialDocumentDetails";
import ItemPage from '../ItemPage';
import {dropFilesText} from "../../widgets/AWSFileUploader";
import {AuthorFormTitle} from "../../forms/AuthorForm";
import {
   setCreatedAuthor,
   setupAuthorListMocking,
   setupAuthorMocking
} from "../../../__utils__/__setup__/AuthorAPI.helper";
import { DocumentList } from "../../../docs/docList/documentListTypes";
import { buildSummary } from "../../../Content/ContentType";

const client = generateClient();

vi.mock('@aws-amplify/storage', async () => {
   const actual = vi.importActual('@aws-amplify/storage');
   return {
      ...actual,
      uploadData: vi.fn(),
      getUrl: vi.fn(),
   };
});

const getUrlSpy = vi.mocked(Storage.getUrl);

const author: Author = authorList.items[0] as Author;
const user: User = userList.items[0] as User;
const initBox: Xbiis = boxList.items[0] as Xbiis;

const docState: Document = {
  ...emptyDocument,
  id:        'badD000d-cafe-babe-face-facadebadDad',
  eng: buildSummary('Test Document', 'Testing Item Page'),

  bc: buildSummary('BC-title', 'BC-Desc'),
  ak: buildSummary('AK-title', 'AK-Desc'),

  author:                     author,
  documentAuthorId:           author.id,

  contentOwner:               user,
  //documentContentOwnerId:     user.id,
  documentContentOwnerUserId: user.id,

  box: initBox,
  documentBoxXbiisId: initBox.id,
  
  fileKey: '/',
  fileHash: expect.anything(),
  type: 'no',
  version: 1,

  //TODO: set specific dates/times
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
}

const state = {
   author: { item: author },
   user: { item: user },
   currentUser: user,
   box: initBox,
   boxList: boxList,
   document: { item: docState },
}

const fd = DocumentFieldDefinition;

describe('Item Page', () =>
{
  beforeEach(() => {
    //setupAmplifyUserMocking();
    setupDocListMocking();
    setupSearchMocking();
    setGetDocument(docState);
    setupDocumentMocking();
    setupBoxUserListMocking();
    //setupBoxUserMocking();
    setupAuthorListMocking();

    //default override as needed per test

    const mockGetUrlOutput: Storage.GetUrlWithPathOutput = {
      url: new URL('https://example.com/'),
      expiresAt: new Date(),
    };

    getUrlSpy.mockResolvedValue(mockGetUrlOutput);
  });

  afterEach(() =>
  {
     vi.clearAllMocks();

     //reset doc defaults
     resetDefaults();
  });

  test('renders correctly', async () =>
  {
    const itemUrl = `/item/${docState.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(docState.eng.title)).toBeInTheDocument();
    });

    expect(screen.getByTestId('react-doc-viewer-wrapper')).toBeInTheDocument();
    expect(screen.getByText('No Document to Display')).toBeInTheDocument();

    expect(screen.queryByTestId('react-doc-viewer')).not.toBeInTheDocument();
  });

  test('renders correctly when fileKey is null', async () =>
  {
    const noPathState = { ...state, document: { item: { ...docState, fileKey: null } } };
    const itemUrl = `/item/${docState.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, noPathState);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(docState.eng.title)).toBeInTheDocument();
    });

    expect(screen.getByText('No Document to Display')).toBeInTheDocument();
  });

  test('renders correctly with viewer', async () =>
  {
    const docList = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/docList.json';

    setUrlForTest(new URL(docList));
    getUrlSpy.mockImplementation((input) => 
      Promise.resolve({
        url: new URL(docList),
        expiresAt: new Date(),
      })
    );

    const preloaded = { ...state, document: { item: { ...docState, fileKey: docList } }, }

    const itemUrl = `/item/${docState.id}`;
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, preloaded);

    await waitFor(() => {
      expect(screen.getByDisplayValue(docState.eng.title)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('No Document to Display')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    /* Link Temp Removed from Preview Header.
    await waitFor(() => {
      //check for the header link
      expect(screen.getByText('docList.json'))
        .toHaveAttribute('href', docList);
      //text is in an iframe, not in the docState
      //expect(screen.getByText('Sample Doc 1')).toBeInTheDocument();
      //TODO: Test for the iframe object
    });
    */
    expect(screen.getByTestId('react-doc-viewer')).toBeInTheDocument();
  });

  test('renders correctly for admin User', async () => {

    const docList = 'https://raw.githubusercontent.com/raystorm/hukdzen/Main/src/data/docList.json';

    setUrlForTest(new URL(docList));
    getUrlSpy.mockImplementation((input) => 
      Promise.resolve({
        url: new URL(docList),
        expiresAt: new Date(),
      })
    );

    const itemUrl = `/item/${docState.id}`;
    const adminState = {
      ...state,
      document: { item: { ...docState, fileKey: docList } },
      currentUser: {
        ...emptyUser,
        id: 'ADMIN ID',
        name: 'ADMIN USER',
        isAdmin: true,
      }
    }
    renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, adminState);

    await waitFor(() => {
      expect(screen.getByDisplayValue(docState.eng.title)).toBeInTheDocument();
    });

    expect(screen.getByTestId('react-doc-viewer-wrapper')).toBeInTheDocument();

    await waitFor(() => {
          expect(screen.queryByText('No Document to Display')).not.toBeInTheDocument();
    }, { timeout: 3000 })

    expect(screen.getByTestId('react-doc-viewer')).toBeInTheDocument();
  });

  test('Uploaded Files are preserved when a new author is added.',
       async () =>
  {
     const auth2 = authorList.items[2] as Author;
     setCreatedAuthor(auth2);
     setupAuthorMocking();

     const itemUrl = `/item/${docState.id}`;
     const { store } = renderPageWithPath(itemUrl, ITEM_PATH,
                                          <ItemPage />, state);

     const doc = state.document.item;
     //setGetDocument(doc);
     //TODO: this means something on ItemPage is inefficient, fix it.
     setDocList({items: [doc]} as DocumentList)
     setupDocListMocking();
     setDocExists(false);
     setupSearchMocking();

     //upload file
     expect(store.getState().document.item.id).toEqual(doc.id);

     const idField = screen.getByTestId(fd.id.name);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();

     //FileUploader DropZone is displayed
     expect(screen.queryByText('Disabled Until a Box is Selected'))
        .not.toBeInTheDocument();
     const dropZone = screen.getByText(dropFilesText);
     expect(dropZone).toBeInTheDocument();

     expect(screen.getByText(dropFilesText)).toBeInTheDocument();

     //resolves from project root instead of file.
     const officeDoc = loadLocalFile(path.resolve('./testFiles/Meeting-poster.odt'));
     act(() => {
       fireEvent.drop(dropZone, { dataTransfer: { files: [officeDoc] } });
     });

     //verify file type is correctly determined and set post, upload
     await waitFor(() => {
       const mimeType: string = 'application/vnd.oasis.opendocument.text';
       expect(screen.getByLabelText(fd.type.label)).toHaveValue(mimeType);
     }, { timeout: 2000 }); //wait 2 seconds for the upload

     //check for file preview
     expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();

     //upload finished
     //await waitFor(() => {
     //  expect(screen.getByText('Uploaded')).toBeInTheDocument();
     //}, { timeout: 2000 });

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

     // Add a small delay to ensure React state updates are complete
     await new Promise(resolve => setTimeout(resolve, 10));

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
     expect(screen.queryByText('File Already Exists in this Box.'))
        .not.toBeInTheDocument();
     expect(screen.getByText(dropFilesText)).toBeInTheDocument();

     expect(store.getState().document.item.id).toEqual(doc.id);

     //screen.debug(screen.getByTestId('awsFileUploader'));

     //verify file is still previewed
     expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();
   }, 30000);

  test('Uploaded Files are preserved when a new author is canceled.',
       async () =>
  {
     const itemUrl = `/item/${docState.id}`;
     const { store } = renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);
     const doc = state.document.item;
     setDocList({items: [doc]} as DocumentList)
     setupDocListMocking();
     setDocExists(false);
     setupSearchMocking();

     //upload file
     expect(store.getState().document.item.id).toEqual(doc.id);

     const idField = screen.getByTestId(fd.id.name);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();

     //FileUploader DropZone is displayed
     expect(screen.queryByText('Disabled Until a Box is Selected'))
        .not.toBeInTheDocument();
     const dropZone = screen.getByText(dropFilesText);
     expect(dropZone).toBeInTheDocument();

     //resolves from project root instead of file.
     const officeDoc = loadLocalFile(path.resolve('./testFiles/Meeting-poster.odt'));
     act(() => { fireEvent.drop(dropZone, { dataTransfer: { files: [officeDoc] } }); });

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

     // Add a small delay to ensure React state updates are complete
     await new Promise(resolve => setTimeout(resolve, 10));

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
     const doc = state.document.item;
     setDocList({items: [doc]} as DocumentList);
     setupDocListMocking();
     setupSearchMocking();
     setUpdatedDoc(doc);
     setupDocumentMocking();
     setDocExists(false);
     setupSearchMocking();

     const { store } = renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);

     //upload file
     expect(screen.queryByText('Disabled Until a Box is Selected'))
        .not.toBeInTheDocument();
     //screen.debug(screen.getByTestId('awsFileUploader'));
     const dropZone = screen.getByText(dropFilesText);

     expect(dropZone).toBeInTheDocument();

     //resolves from project root instead of file.
     const logoFilePath = path.resolve('./src/images/ovoid.svg');
     const logoFile = loadLocalFile(logoFilePath);
     act(() => {
       fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });
     });

     //verify file type is correctly determined and set, post upload
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
     await waitFor(() => {
        expect(screen.getByLabelText(fd.version.label)).toHaveValue(doc.version+1);
     });

     //visible
     const create = 'Ma̱ngyen aamadzap (Upload better Version)';
     expect(screen.getByText(create)).toBeInTheDocument();

     // @ts-ignore
     const actionCount = store.dispatch.mock.calls.length;
     expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

     // Setup mock to return updated document when mutation is called
     let updatedDoc = {...doc, type: fileType, version: doc.version+1, }
     updatedDoc.fileKey   = `${doc.box.id}/${logoFile.name}`;
     updatedDoc.updatedAt = expect.anything();
     updatedDoc.updated   = expect.anything();
     
     setUpdatedDoc(updatedDoc);
     setupDocumentMocking();

     //trigger save action
     await userEvent.click(screen.getByText(create));

     //verify update action was dispatched
     await waitFor(() => {
        // @ts-ignore
        delete updatedDoc.file;
        const action = documentActions.updateDocumentVersion(updatedDoc);
        const updateAction = expect.objectContaining(action);
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

     verifyField(fd.eng.title,       doc.eng.title);
     verifyField(fd.eng.description, doc.eng.description);

     verifyField(fd.contentOwner,       printGyet(user));
     verifyField(fd.author,         author.name);

     verifyField(fd.bc.title,       doc.bc.title);
     verifyField(fd.bc.description, doc.bc.description);

     verifyField(fd.ak.title,       doc.ak.title);
     verifyField(fd.ak.description, doc.ak.description);

     //download link still available
     expect(screen.getByText('Download Current File')).toBeInTheDocument();

     //uploaded file removed
     expect(screen.queryByText('Uploaded')).not.toBeInTheDocument();
     expect(screen.queryByText('ovoid.svg')).not.toBeInTheDocument();

     verifyField(fd.type, `${fileType}`);

     verifyField(fd.version, updatedDoc.version);

     verifyDateField(fd.created, doc.created);
     verifyDateField(fd.updated, doc.updated);

     await waitFor(() => {
       const message = buildSuccessAlert('Document Updated');
       expect(store.getState().alertMessage).toEqual(wrapAlertForTest(message));
     });

     //TODO: add test for Viewer Update
     await waitFor(() => {
       expect(screen.getByText('No renderer for file type: image/svg+xml'))
         .toBeVisible();
     }, { timeout: 3000 });
  });

  test('On Save Error, and form and file are preserved',
       async () =>
  {
     const itemUrl = `/item/${docState.id}`;
     const doc = state.document.item;
     const { store } = renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);

     setDocList({items: [doc]} as DocumentList);
     setupDocListMocking();
     setDocExists(false);
     setupSearchMocking();
     setUpdatedDoc(doc);
     setupDocumentMocking();

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

     //version increments
     await waitFor(() => {
       expect(screen.getByLabelText(fd.version.label)).toHaveValue(doc.version+1);
     });

     //visible
     const create = 'Ma̱ngyen aamadzap (Upload better Version)';
     expect(screen.getByText(create)).toBeInTheDocument();

     // @ts-ignore
     const actionCount = store.dispatch.mock.calls.length;
     expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

     const updateError = new Error('Forced Test Error');
     when(client.graphql)
        .calledWith(expect.objectContaining({query: mutations.updateDocumentGuarded} ))
        .thenReject(updateError);

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
       const message = buildFriendlyErrorAlert('Failed to Update Document', updateError);
       expect(store.getState().alertMessage.queue).toContainEqual(expect.objectContaining(message));
     }, { timeout: 2000 });

     const idField = screen.getByTestId(fd.id.name);
     expect(idField).toBeInTheDocument();
     expect(idField).not.toBeVisible();
     //validate ID same
     expect(idField).not.toHaveValue(state.document.item.id);
     expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();

     verifyField(fd.eng.title,       doc.eng.title);
     verifyField(fd.eng.description, doc.eng.description);

     verifyField(fd.contentOwner,   printGyet(user));
     verifyField(fd.author,         author.name);

     verifyField(fd.bc.title,       doc.bc.title);
     verifyField(fd.bc.description, doc.bc.description);

     verifyField(fd.ak.title,       doc.ak.title);
     verifyField(fd.ak.description, doc.ak.description);

     verifyField(fd.type, fileType);

     verifyField(fd.version, doc.version+1);

     expect(store?.getState().document.item).toEqual(updatedDoc);

     //check for file preview, to STILL be in the docState
     expect(screen.getByText('ovoid.svg')).toBeInTheDocument();
     expect(screen.getByText('Uploaded')).toBeInTheDocument();

     verifyDateField(fd.created, doc.created);
     verifyDateField(fd.updated, doc.updated);
  });

  test('onDuplicate File upload, upload is cancelled, and error msg displays',
       async () =>
  {
     const itemUrl = `/item/${docState.id}`;
     const { store } = renderPageWithPath(itemUrl, ITEM_PATH, <ItemPage />, state);

     // Mock the checkExists function to return true (file exists)
     //when(checkExists).mockReturnValue(true);
     setDocExists(true); //set the Check to return that the doc exists
     setupSearchMocking();

     // Verify box is selected
     expect(screen.queryByText('Disabled Until a Box is Selected')).not.toBeInTheDocument();

     // Get the dropzone
     const dropZone = screen.getByText(dropFilesText);
     expect(dropZone).toBeInTheDocument();

      // Drop a file
     const logoFilePath = path.resolve('./src/images/ovoid.jpg');
     const logoFile = loadLocalFile(logoFilePath);
     act(() => {
         fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });
     });

      // Verify that checkExists was called
      //await waitFor(() => { expect(checkExists).toHaveBeenCalled(); });

      // Verify error message is displayed in the file uploader
      await waitFor(() => {
         expect(screen.getByText('File Already Exists in this Box.')).toBeInTheDocument();
      });

      // Verify that an alert was displayed
      const alertAction = alertBarActions.DisplayAlertBox(buildWarningAlert('file exists.'));
      expect(store.dispatch)
        .toHaveBeenCalledWith(expect.objectContaining({ type: alertAction.type,
                                                        payload: expect.objectContaining(
                                                                 { message: 'file exists.' })
                                                      }));

      //verify that the AWS Amplify Storage API uploadData function isn't called.
      //expect(uploadDataSpy).not.toHaveBeenCalled();
      expect(Storage.uploadData).not.toHaveBeenCalled();
   });

});