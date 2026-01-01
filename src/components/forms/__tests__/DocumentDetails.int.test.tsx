import { vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvnt from '@testing-library/user-event';
import {when} from "vitest-when";

import react from 'react'
import path from 'path';
import { v4 as randomUUID } from "uuid";

import { Amplify } from "aws-amplify";
import { generateClient } from '@aws-amplify/api';
import { copy, getUrl, remove, uploadData } from '@aws-amplify/storage';
import * as storage from '@aws-amplify/storage';

import amplifyConfig from '../../../amplifyconfiguration.json';

import userList from '../../../data/userList.json';
import boxList from '../../../data/boxList.json';
import {MoveDocument} from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import type { Xbiis } from '../../../Box/boxTypes';
import { BoxPurpose, DefaultBox, emptyXbiis, printBox, printXbiis } from '../../../Box/boxTypes';

import { renderWithState, contains, startsWith, } from '../../../__utils__/testUtilities';
import { loadLocalFile } from '../../../__utils__/fileUtilities';
import {
   openBoxDropdown,
   selectBox, startFileUpload,
   verifyCanChangeField, verifyDateField, verifyField, verifyInitialUpload, waitForUploadComplete
} from '../../../__utils__/DocumentDetailsUtilities';

import { dropFilesText, UploadAccessLevel } from '../../widgets/AWSFileUploader';
import DocumentDetailsForm, { DetailProps } from '../DocumentDetails';
import { DocumentDetailsFieldDefinition } from '../../../types/fieldDefitions';
import { emptyDocumentDetails } from "../../../docs/initialDocumentDetails";
import { Author, emptyAuthor } from "../../../Author/AuthorType";

import {
   resetDefaults, setDocExists,
   setGetDocument, setupDocExistsMocking,
   setupDocListMocking, setupDocSearchMocking, setupDocumentMocking,
} from "../../../__utils__/__fixtures__/DocumentAPI.helper";
import {
   setupBoxUserListMocking, setBoxUserList, buildBoxUserList
} from "../../../__utils__/__fixtures__/BoxUserAPI.helper";
import {setupBoxListMocking} from "../../../__utils__/__fixtures__/BoxAPI.helper";

import {documentActions} from "../../../docs/documentSlice";
import { BoxList, emptyBoxList } from "../../../Box/BoxList/BoxListType";
import {
   setCreatedAuthor,
   setupAuthorListMocking,
   setupAuthorMocking, setUpdatedAuthor
} from "../../../__utils__/__fixtures__/AuthorAPI.helper";
import {printGyet} from "../../../Gyet/GyetType";
import authorList from "../../../data/authorList.json";
import {AuthorFormTitle} from "../AuthorForm";
import {authorActions} from "../../../Author/authorSlice";

const client = generateClient();

const author: Author = authorList.items[0] as Author;
const user: User = userList.items[0] as User;

const initBox = boxList.items[0] as Xbiis;

const TEST_PROPS: DetailProps = {
  pageTitle: 'Test Page',
  editable: false,
  isNew: false,
  isVersion: false,
  //END page specific props begin document Details
  doc: {
    ...emptyDocumentDetails,

    id: 'DOCUMENT-GUID-HERE',
    eng_title: 'TEST DOCUMENT TITLE',
    eng_description: 'TEST DOCUMENT DESCRIPTION',

    bc_title: 'Nahawat-BC', bc_description: 'Magon-BC',
    ak_title: 'Nahawat-AK', ak_description: 'Magon-AK',

    author: author,
    docOwner: user,
    documentDetailsAuthorId: author.id,
    documentDetailsDocOwnerId: user.id,

    box: initBox,
    documentDetailsBoxId: initBox.id,

    fileKey: '/PATH/TO/TEST/FILE',
    type: 'application/example',
    version: 1,

    created: new Date().toISOString(), //TODO set specific dates/times
    updated: new Date().toISOString(),
  },
};

const boxUsers = buildBoxUserList();

const STATE = {
   authorList: authorList,
   boxList: boxList,
   boxUserList: boxUsers,
   userList: userList,
   currentUser: user,
};

const fd = DocumentDetailsFieldDefinition;

Amplify.configure(amplifyConfig);

const userEvent = userEvnt.setup();

// TODO: should I split this file?

// Mock HTMLFormElement.prototype.requestSubmit
HTMLFormElement.prototype.requestSubmit = vi.fn();
global.HTMLFormElement.prototype.requestSubmit = vi.fn();
//Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit',
//                      { value: vi.fn(), configurable: true });

// Mock window.open
Object.defineProperty(window, 'open', { value: vi.fn(), configurable: true });


describe('DocumentDetails Integration Tests',  () =>
{
  beforeEach(() => {
     // Clear all mocks first
     //vi.clearAllMocks();
     //vi.resetAllMocks();

     // Reset mock state
     resetDefaults();

     // Clear vitest-when mocks
     vi.mocked(client.graphql).mockReset();

    //console.log(`generateClient: ${generateClient}`);
    //console.log(`client: ${client}`);
    //expect(vi.isMockFunction(client.graphql)).toBeTruthy();
    setupDocListMocking();
    setupDocExistsMocking();
    setupDocSearchMocking();
    setGetDocument(TEST_PROPS.doc);
    setupDocumentMocking();
    setBoxUserList(boxUsers);
    setupBoxUserListMocking();
    setupBoxListMocking();
    setupAuthorListMocking();
    setupAuthorMocking();
  });

  afterEach(() => {
     // Clear all mocks
     //vi.clearAllMocks();
     //vi.resetAllMocks();
     //vi.restoreAllMocks();

     resetDefaults(); //resetDefaults for Doc Mocs
  });

  describe('Box selector', () =>
  {
    describe('Rendering', () =>
    {
      // shows available boxes
      test('Box field shows available boxes including public box', async () =>
      {
        const props : DetailProps = { ...TEST_PROPS, editable: true, };
        renderWithState(STATE, <DocumentDetailsForm {...props} />);

        await waitFor(() => {
          expect(screen.getByTestId('box')).toBeInTheDocument();
        });

        expect(screen.getByDisplayValue(props.doc.box.id)).toBeInTheDocument();

        await openBoxDropdown();

        // Verify public box is in the options
        await waitFor(() => {
          //expect(screen.getByText(printBox(initBox))).toBeInTheDocument();
          expect(screen.getAllByText(printBox(DefaultBox))).toHaveLength(2);
        });
      });

      // shows DefaultBox
      test('DefaultBox is selected for new uploads', () =>
      {
        const props = { ...TEST_PROPS, isNew: true, editable: true, };
        const state = { ...STATE, boxList: { ...emptyBoxList, items: [DefaultBox] } };

        renderWithState(state, <DocumentDetailsForm {...props} />);

        expect(screen.getByDisplayValue(DefaultBox.id)).toBeInTheDocument();
      });

      // shows personal box when present
      test('shows personal box in selector when boxList contains it', async () =>
      {
        const personalBox =  { ...emptyXbiis, id: 'user-box',
          name: 'Test Personal Box', purpose: BoxPurpose.USER };

        const state = {
          ...STATE,
          boxList: { ...emptyBoxList, items: [DefaultBox, personalBox] }
        };

        renderWithState(state, <DocumentDetailsForm {...TEST_PROPS} editable={true} />);

        //update box
        openBoxDropdown();
        const changeBox = printXbiis(personalBox);

        // assert personal box is visible, once the option list displays.
        await waitFor(() => {
          expect(screen.getAllByText(contains(changeBox))[0]).toBeInTheDocument();
        }, { timeout: 5000 });
      });
    });

    describe('Selection behavior', () =>
    {
      // default selection for new uploads

      // changing box updates field

      // changing box dispatches Move action (existing docs)
      test('Changing Box dispatches the Move File Action', async () =>
      {
        const props : DetailProps = { ...TEST_PROPS, editable: true };
        const state = { ...STATE, };

        const { store } = renderWithState(state, <DocumentDetailsForm {...props} />);

        //update box
        await selectBox(boxList.items[1] as Xbiis);
        const changeBox = `${printBox(boxList.items[1] as Xbiis)}`;

        const moveButtonText = 'Sgüü (Move)'
        //wait for the Move Bucket confirm dialog
        await waitFor(() => {
          expect(screen.getByText(moveButtonText)).toBeInTheDocument();
        });

        //confirm the move in the dialog (click the button)
        await userEvent.click(screen.getByText(moveButtonText));

        // eslint-disable-next-line testing-library/no-node-access
        await waitFor(() => {
          expect(within(screen.getByTestId('box').parentElement!)
                    .getByText(changeBox)).toBeInTheDocument();
        }, { timeout: 5000 });

        //visible
        const save = 'ma̱x (Save)';
        expect(screen.getByText(save)).toBeInTheDocument();

        // @ts-ignore
        const actionCount = store.dispatch.mock.calls.length;
        expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

        //trigger save action
        await userEvent.click(screen.getByText(save));

        //verify action was fired
        await waitFor(() => {
          expect(store.dispatch).toHaveBeenCalledTimes(actionCount+2);
        }, { timeout: 2000 });

        await waitFor(() => {
          const move: MoveDocument = {
            source: props.doc.fileKey,
            //TODO: make this any string
            destination: expect.anything(),
            targetBox: boxList.items[1] as Xbiis
          }
          const action = documentActions.moveDocument(move);
          expect(store.dispatch).toHaveBeenCalledWith(action);
        }, { timeout: 2000 });

        await waitFor(() => {
          const idMatcher = expect.objectContaining({id: props.doc.id});
          const action = documentActions.updateDocumentMetadata(idMatcher);
          expect(store.dispatch).toHaveBeenCalledWith(action);
        }, { timeout: 2000 });
      }, 10000);

      // new docs skip the move confirmation modal
    });

    /* TODO: test setting empty box after page load */
  });

  describe('File handling behavior', () =>
  {
    test('Clicking Download link gets the file', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const dlLink = screen.getByText('Download Current File');
      expect(dlLink).toBeInTheDocument();
      await userEvent.click(dlLink);

      await waitFor(() => {
        expect(getUrl)
           .toHaveBeenCalledWith(
              {
                key: props.doc.fileKey,
                options: UploadAccessLevel
              });
      });
    });

    describe('Successful uploads', () =>
    {
      // shows preview

      // sets file type
      test('AWSFileUploader uploads a file then properly determines and sets file type.',
           async () =>
      {
         const props : DetailProps = { ...TEST_PROPS, isNew: true, };

         renderWithState(STATE, <DocumentDetailsForm {...props} />);

         expect(screen.queryByText('Disabled Until a Box is Selected'))
            .not.toBeInTheDocument();

         //resolves from project root instead of file.
         await startFileUpload('./src/images/ovoid.svg');

         await verifyInitialUpload('ovoid.svg', 'image/svg+xml');

         //new does not increment version
         expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);
      });

      // increments version for new version uploads
      test('AWSFileUploader upload increments version as part of new version',
           async () =>
      {
          const props : DetailProps = { ...TEST_PROPS, isVersion: true };
          renderWithState(STATE, <DocumentDetailsForm {...props} />);

          setDocExists(false);
          setupDocExistsMocking();

          //validate file name not displayed before upload
          expect(screen.queryByText('ovoid.jpg')).not.toBeInTheDocument();
          //validate File type not set
          expect(screen.getByLabelText(fd.type.label)).not.toHaveValue('image/jpeg');

          expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);

          //resolves from project root instead of file.
          await startFileUpload('./src/images/ovoid.jpg');

          await verifyInitialUpload('ovoid.jpg', 'image/jpeg');

          await waitForUploadComplete();

          //check version incremented
          await waitFor(() => {
            expect(screen.getByLabelText(fd.version.label)).toHaveValue(2);
          });
      });

      test('uploads file to selected personal box and targets that box', async () =>
      {
          // --- Setup: personal box + state ---
          const personalBox = {
             ...emptyXbiis,
             id: 'user-box-123',
             name: 'Personal: Test User',
             purpose: BoxPurpose.USER,
          };

          const state = {
             ...STATE,
             boxList: { ...emptyBoxList, items: [DefaultBox, personalBox], },
          };

          const props: DetailProps = { ...TEST_PROPS, isNew: true, editable: true, };

          setDocExists(false);
          setupDocExistsMocking();

          const { store } = renderWithState(state, <DocumentDetailsForm {...props} />);

          // --- Step 1: Select the personal box ---
          await selectBox(personalBox);

          // --- Step 2: Upload a file ---
          await startFileUpload('./src/images/ovoid.svg');

          // --- Step 3: Verify upload succeeded ---
          await verifyInitialUpload('ovoid.svg', 'image/svg+xml');

          // version should remain 1 for new uploads
          expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);

          const uploadSpy = vi.spyOn(storage, 'uploadData');

          // --- Step 4: Verify uploadData was called with the personal box prefix ---
          await waitFor(() => { expect(uploadSpy).toHaveBeenCalled(); });

          const uploadCall = vi.mocked(uploadSpy).mock.calls[0][0];

          expect(uploadCall.key).toContain(personalBox.id); //box id as part of key
          expect(uploadCall.key).toContain('ovoid.svg');    //file name as part of key
          expect(uploadCall.options).toHaveProperty('accessLevel',
                                                    UploadAccessLevel.accessLevel);
          await waitForUploadComplete();

          //NOTE: not validating internal page state doc.fileKey
       });
    });

    describe('Duplicate uploads', () =>
    {
      // duplicate error shown
      test('On duplicate file upload, upload is cancelled and error message displays',
           async () =>
      {
         const props : DetailProps = { ...TEST_PROPS, isNew: true, editable: true };
         renderWithState(STATE, <DocumentDetailsForm {...props} />);

         // Setup mock to simulate duplicate file error
         const errorMessage = 'File Already Exists in this Box.';
         const mockUploadError = new Error(errorMessage);
         mockUploadError.name = 'FileExistsError';
         setDocExists(true);
         setupDocExistsMocking();

         // Verify file uploader is available
         expect(screen.queryByText('Disabled Until a Box is Selected'))
            .not.toBeInTheDocument();

         // Upload a file that will trigger the duplicate error
         await startFileUpload('./src/images/ovoid.svg');

         // Verify error message is displayed
         await waitFor(() => {
           expect(screen.getByText(errorMessage)).toBeInTheDocument();
         }, { timeout: 2000 });

         // Verify upload was cancelled (no file preview shown)
         expect(screen.queryByText('ovoid.svg')).not.toBeInTheDocument();

         // Verify file type was not set
         //expect(screen.getByLabelText(fd.type.label)).not.toHaveValue('image/svg+xml');
       });

      // upload canceled

      // next upload clears error
      test('a file Uploaded AFTER duplicate file upload, clears the error message',
           async () =>
      {
         const props : DetailProps = { ...TEST_PROPS, isVersion: true, editable: true };
         renderWithState(STATE, <DocumentDetailsForm {...props} />);

         // Setup mock to simulate duplicate file error
         const errorMessage = 'File Already Exists in this Box.';
         const mockUploadError = new Error(errorMessage);
         mockUploadError.name = 'FileExistsError';
         setDocExists(true);
         setupDocExistsMocking();

         // Verify file uploader is available
         expect(screen.queryByText('Disabled Until a Box is Selected'))
            .not.toBeInTheDocument();

         const dropZone = screen.getByText(dropFilesText);

         // Upload a file that will trigger the duplicate error
         await startFileUpload('./src/images/ovoid.svg');

         // Verify error message is displayed
         await waitFor(() => {
           expect(screen.getByText(errorMessage)).toBeInTheDocument();
         }, { timeout: 2000 });

         // Verify upload was cancelled (no file preview shown)
         expect(screen.queryByText('ovoid.svg')).not.toBeInTheDocument();

         // Verify file type was not set
         //expect(screen.getByLabelText(fd.type.label)).not.toHaveValue('image/svg+xml');

         //remove forced Dupe Mocking
         setDocExists(false);
         setupDocExistsMocking();

         // Add a small delay to ensure mock setup takes effect
         await new Promise(resolve => setTimeout(resolve, 10));

         //upload non-Dupe file
         //await startFileUpload('./testFiles/Meeting-poster.odt');
         const file = loadLocalFile('./testFiles/Meeting-poster.odt');
         act(() => { fireEvent.drop(dropZone,
                                    { dataTransfer: { files: [file] } }); });

         // Verify error message is cleared
         await waitFor(() => {
           expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
         }, { timeout: 2000 });
         expect(screen.getByText('Drag and Drop a File')).toBeInTheDocument();

         // Verify upload was successful
         await verifyInitialUpload('Meeting-poster.odt',
                                   'application/vnd.oasis.opendocument.text');

         await waitForUploadComplete();

         expect(screen.getByLabelText(fd.version.label)).toHaveValue(2);
      });
    });
  });

  describe('Author modal', () =>
  {
    describe('adding a new author', () =>
    {
      test('Form data and changes are preserved when a new author is added.',
           async () =>
      {
         const auth2 = authorList.items[2] as Author;
         setCreatedAuthor(auth2);
         setupAuthorMocking();

         const props : DetailProps = { ...TEST_PROPS, editable: true, };
         const { doc } = props;
         const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

         //verify original values
         verifyField(fd.eng_title,       doc.eng_title);
         verifyField(fd.eng_description, doc.eng_description);

         //change title
         const changedTitle = 'I have been changed';
         await userEvent.clear(screen.getByLabelText(fd.eng_title.label));
         await userEvent.type(screen.getByLabelText(fd.eng_title.label), changedTitle);

         await waitFor(() =>
                       { expect(screen.getByLabelText(fd.eng_title.label)).toHaveValue(changedTitle); });

         //verify change took
         verifyField(fd.eng_title, changedTitle);

         //ensure author exists
         expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

         expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

         const textbox = screen.getByLabelText(contains(fd.author.label));
         expect(textbox).toBeInTheDocument();

         await userEvent.clear(textbox);
         await userEvent.type(textbox, auth2.name);
         await waitFor(() => {
           expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
         });

         // Add a small delay to ensure React state updates are complete
         //await new Promise(resolve => setTimeout(resolve, 10));

         await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

         await waitFor(() => {
           expect(screen.getByText('Add')).toBeInTheDocument();
         });

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

         //verify original form still has data
         verifyField(fd.eng_title, changedTitle);
         verifyField(fd.eng_description, doc.eng_description);
       }, 20000);

      test('updated author name displays when updated in author add dialog.',
           async () =>
      {
       const authName = 'A Different Author Name';
       const createdAuthor : Author = {
         ...emptyAuthor,
         id: randomUUID(),
         name: authName
       };

       setCreatedAuthor(createdAuthor);
       setupAuthorMocking();

       const props : DetailProps = { ...TEST_PROPS, editable: true, };
       const { doc } = props;
       const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

       //verify original values
       verifyField(fd.eng_title,       doc.eng_title);
       verifyField(fd.eng_description, doc.eng_description);

       //change title
       const changedTitle = 'I have been changed';
       await userEvent.clear(screen.getByLabelText(fd.eng_title.label));
       await userEvent.type(screen.getByLabelText(fd.eng_title.label), changedTitle);

       await waitFor(() => {
         expect(screen.getByLabelText(fd.eng_title.label)).toHaveValue(changedTitle);
       });

       //verify change took
       verifyField(fd.eng_title, changedTitle);

       //ensure author exists
       expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

       const auth2 = authorList.items[2] as Author;
       expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

       const textbox = screen.getByLabelText(contains(fd.author.label));

       await userEvent.clear(textbox);
       await userEvent.type(textbox, auth2.name);
       await waitFor(() => {
         expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
       });
       await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

       //change the name
       await waitFor(() => {
         expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
       });

       //Something about this Text box, triggers an action that breaks act()
       const authNameBox = screen.getByLabelText(startsWith('Name'));
       userEvent.clear(authNameBox);
       await waitFor(() => {
         expect(authNameBox).not.toHaveDisplayValue(auth2.name);
       });
       await userEvent.type(authNameBox, authName);

       await waitFor(() => {
         expect(authNameBox).toHaveDisplayValue(authName);
       });

       await waitFor(() => {
         expect(screen.getByText('Add')).toBeInTheDocument();
       });

       //close the dialog
       await userEvent.click(screen.getByText('Add'));

       //verify closed
       await waitFor(() => {
         expect(screen.queryByText(AuthorFormTitle)).not.toBeInTheDocument();
       });

       //verify no new dispatches
       await waitFor(() => {
         const expName = expect.objectContaining({name: authName});
         const action = authorActions.createAuthor(expName);
         expect(store.dispatch).toHaveBeenLastCalledWith(action);
       });

       await waitFor(() => {
         expect(store?.getState().author).toHaveProperty('name', authName);
       });

       expect(screen.getByLabelText(startsWith(fd.author.label)))
          .toHaveDisplayValue(authName);

       //verify original form still has data
       verifyField(fd.eng_title, changedTitle);
       verifyField(fd.eng_description, doc.eng_description);
     }, 20000);

      test('Form can still be edited after a new author is added.', async () =>
      {
        const auth2 = authorList.items[2] as Author;
        setCreatedAuthor(auth2);
        setupAuthorMocking();

        const props : DetailProps = { ...TEST_PROPS, editable: true, };
        const { doc } = props;
        const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

        //verify original values
        verifyField(fd.eng_title,       doc.eng_title);
        verifyField(fd.eng_description, doc.eng_description);

        //ensure author exists
        expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

        expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

        const textbox = screen.getByLabelText(contains(fd.author.label));

        await userEvent.clear(textbox);
        await userEvent.type(textbox, auth2.name);
        await waitFor(() => {
          expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

        await waitFor(() => {
          expect(screen.getByText('Add')).toBeInTheDocument();
        });

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

        await verifyCanChangeField(fd.eng_title, doc.eng_title);
        verifyField(fd.eng_description,          doc.eng_description);
      }, 20000);

      test('Can Upload Files after a new author is added.', async () =>
      {
        const props : DetailProps = { ...TEST_PROPS, isNew: true, editable: true, };
        const { doc } = props;

        setDocExists(false);
        setupDocExistsMocking();

        const auth2 = authorList.items[2] as Author;

        setCreatedAuthor(auth2);
        setupAuthorMocking();

        const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

        //ensure author exists
        expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

        expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

        const textbox = screen.getByLabelText(contains(fd.author.label));

        await userEvent.clear(textbox);
        await userEvent.type(textbox, auth2.name);
        await waitFor(() => {
          expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

        await waitFor(() => {
          expect(screen.getByText('Add')).toBeInTheDocument();
        });

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

        //upload file

        //FileUploader DropZone is displayed
        expect(screen.queryByText('Disabled Until a Box is Selected'))
           .not.toBeInTheDocument();
        const dropZone = screen.getByText(dropFilesText);
        expect(dropZone).toBeInTheDocument();

        //resolves from project root instead of file.
        const officeDoc = loadLocalFile(path.resolve('./testFiles/Meeting-poster.odt'));
        act(()=> {
          fireEvent.drop(dropZone, { dataTransfer: { files: [officeDoc] } });
        });

        //verify file type is correctly determined and set post, upload
        await waitFor(() => {
          const mimeType: string = 'application/vnd.oasis.opendocument.text';
          expect(screen.getByLabelText(fd.type.label)).toHaveValue(mimeType);
        }, { timeout: 2000 }); //wait 2 seconds for the upload

        //check for file preview
        expect(screen.getByText('Meeting-poster.odt')).toBeInTheDocument();

        await waitFor(() => {
          expect(screen.getByText('Uploaded')).toBeInTheDocument();
        });
      }, 20000);

      test('Author can be changed after a new author is added.', async () =>
      {
        const props : DetailProps = { ...TEST_PROPS, editable: true, };
        const { doc } = props;
        const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

        //ensure author exists
        expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

        const auth2 = authorList.items[2] as Author;
        const printedAuth2 = printGyet(auth2);

        expect(screen.queryByDisplayValue(printedAuth2)).not.toBeInTheDocument();

        const getAuthorField = () => {
          return screen.getByLabelText(contains(fd.author.label));
        }

        const textbox = getAuthorField();

        await userEvent.clear(textbox);
        await userEvent.type(textbox, auth2.name);
        await waitFor(() => {
          expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

        await waitFor(() => {
          expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
        });

        //Something about this Text box, triggers an action that breaks act()
        const authNameBox = screen.getByLabelText(startsWith('Name'));
        userEvent.clear(authNameBox);
        await waitFor(() => {
          expect(authNameBox).not.toHaveDisplayValue(auth2.name);
        });
        await userEvent.type(authNameBox, auth2.name);

        await waitFor(() => {
          expect(authNameBox).toHaveDisplayValue(auth2.name);
        });

        await waitFor(() => {
          expect(screen.getByText('Add')).toBeInTheDocument();
        });

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
          expect(store.dispatch).toHaveBeenLastCalledWith(action);
        });

        await waitFor(() => {
          expect(store?.getState().author).toHaveProperty('name', auth2.name);
        });

        const auth3 = authorList.items[0] as Author;
        const printedAuth3 = printGyet(auth3);

        expect(screen.queryByDisplayValue(printedAuth3)).not.toBeInTheDocument();

        const textbox2 = getAuthorField();

        await userEvent.clear(textbox2);
        await userEvent.type(textbox2, printedAuth3);
        await userEvent.type(textbox, '[ArrowDown][Enter]');

        await waitFor(() => {
          expect(getAuthorField()).not.toHaveDisplayValue(printedAuth2);
        });

        expect(getAuthorField()).toHaveDisplayValue(printedAuth3);

        //verify original form still has data
        verifyField(fd.eng_title, doc.eng_title);
        verifyField(fd.eng_description, doc.eng_description);
      }, 20000);

      test('Author can still be cleared after a new author is added.', async () =>
      {
        const props : DetailProps = { ...TEST_PROPS, editable: true, };
        const { doc } = props;
        const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

        //ensure author exists
        expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

        const auth2 = authorList.items[2] as Author;

        expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

        const textbox = screen.getByLabelText(contains(fd.author.label));

        await userEvent.clear(textbox);
        await userEvent.type(textbox, auth2.name);
        await waitFor(() => {
          expect(screen.getByText(`Add "${auth2.name}"`)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByText(`Add "${auth2.name}"`));

        await waitFor(() => {
          expect(screen.getByText('Add')).toBeInTheDocument();
        });

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

        //clear the field
        await userEvent.click(screen.getByTitle('Clear'));

        //verify empty
        verifyField(fd.author, '');
      }, 20000);

    });

    describe('cancelling the author modal', () => {
      test('Form data and changes are preserved when a new author modal is cancelled',
           async () =>
      {
         const props : DetailProps = { ...TEST_PROPS, editable: true, };
         const { doc } = props;
         const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

         //verify original values
         verifyField(fd.eng_title,       doc.eng_title);
         verifyField(fd.eng_description, doc.eng_description);

         //change title
         const changedTitle = 'I have been changed';
         await userEvent.clear(screen.getByLabelText(fd.eng_title.label));
         await userEvent.type(screen.getByLabelText(fd.eng_title.label), changedTitle);

         await waitFor(() =>
                       { expect(screen.getByLabelText(fd.eng_title.label)).toHaveValue(changedTitle); });

         //verify change took
         verifyField(fd.eng_title, changedTitle);

         //ensure author exists
         expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

         const auth2 = authorList.items[2] as Author;

         expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

         const textbox = screen.getByLabelText(contains(fd.author.label));

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

         await waitFor(() => {
           expect(store?.getState().author).toHaveProperty('name', '');
         });

         //verify original form still has data
         verifyField(fd.eng_title, changedTitle);
         verifyField(fd.eng_description, doc.eng_description);
       }, 20000);

      test('Form can still be edited after a new author is cancelled.', async () =>
      {
        const props : DetailProps = { ...TEST_PROPS, editable: true, };
        const { doc } = props;
        const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

        //verify original values
        verifyField(fd.eng_title,       doc.eng_title);
        verifyField(fd.eng_description, doc.eng_description);

        //ensure author exists
        expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

        const auth2 = authorList.items[2] as Author;

        expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

        const textbox = screen.getByLabelText(contains(fd.author.label));

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

        await waitFor(() => {
          expect(store?.getState().author).toHaveProperty('name', '');
        });

        await verifyCanChangeField(fd.eng_title, doc.eng_title);
        verifyField(fd.eng_description,          doc.eng_description);
      }, 20000);

      test('Author can be changed after a new author is Cancelled.', async () =>
      {
        const props : DetailProps = { ...TEST_PROPS, editable: true, };
        const { doc } = props;
        const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

        //ensure author exists
        expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

        const auth2 = authorList.items[2] as Author;
        const printedAuth2 = printGyet(auth2);

        expect(screen.queryByDisplayValue(printedAuth2)).not.toBeInTheDocument();

        const getAuthorField = () => {
          return screen.getByLabelText(contains(fd.author.label));
        }

        const textbox = getAuthorField();

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

        await waitFor(() => {
          expect(store?.getState().author).toHaveProperty('name', '');
        });

        const auth3 = authorList.items[0] as Author;
        const printedAuth3 = printGyet(auth3);

        expect(screen.queryByDisplayValue(printedAuth3)).not.toBeInTheDocument();

        const textbox2 = getAuthorField();

        await userEvent.clear(textbox2);
        await userEvent.type(textbox2, printedAuth3);
        await userEvent.type(textbox, '[ArrowDown][Enter]');

        await waitFor(() => {
          expect(getAuthorField()).not.toHaveDisplayValue(printedAuth2);
        });
        expect(getAuthorField()).toHaveDisplayValue(printedAuth3);
      }, 20000);

      test('Author can still be cleared after a new author is Cancelled.',
           async () =>
      {
         const props : DetailProps = { ...TEST_PROPS, editable: true, };
         const { doc } = props;
         const {store} = renderWithState(STATE, <DocumentDetailsForm {...props} />);

         //ensure author exists
         expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

         const auth2 = authorList.items[2] as Author;

         expect(screen.queryByDisplayValue(auth2.name)).not.toBeInTheDocument();

         const textbox = screen.getByLabelText(contains(fd.author.label));

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

         await waitFor(() => {
           expect(store?.getState().author).toHaveProperty('name', '');
         });

         //clear the field
         await userEvent.click(screen.getByTitle('Clear'));

         //verify empty
         verifyField(fd.author, '');
       }, 20000);
    });
  });

  describe('Translation functionality', () =>
  {
    test('Shows translate icon when BC title has content and AK title is empty',
         () =>
    {
      const props: DetailProps = {
        ...TEST_PROPS,
        editable: true,
        doc: {
          ...TEST_PROPS.doc,
          bc_title: 'BC Title Text',
          ak_title: ''
        }
      };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const bcTitleField = screen.getByLabelText(fd.bc_title.label);
      const translateButton = within(bcTitleField.parentElement!).getByRole('button');
      expect(translateButton).toBeInTheDocument();
      expect(translateButton).toHaveAttribute('title', 'Translate BC to AK');
    });

    test('Shows translate icon when AK title has content and BC title is empty',
         () =>
    {
      const props: DetailProps = {
        ...TEST_PROPS,
        editable: true,
        doc: {
          ...TEST_PROPS.doc,
          bc_title: '',
          ak_title: 'AK Title Text'
        }
      };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const akTitleField = screen.getByLabelText(fd.ak_title.label);
      const translateButton = within(akTitleField.parentElement!).getByRole('button');
      expect(translateButton).toBeInTheDocument();
      expect(translateButton).toHaveAttribute('title', 'Translate AK to BC');
    });

    test('Disables translate icon when both fields have content', () =>
    {
      const props: DetailProps = {
        ...TEST_PROPS,
        editable: true,
        doc: {
          ...TEST_PROPS.doc,
          bc_title: 'BC Title Text',
          ak_title: 'AK Title Text'
        }
      };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const bcTitleField = screen.getByLabelText(fd.bc_title.label);
      const akTitleField = screen.getByLabelText(fd.ak_title.label);

      expect(within(bcTitleField.parentElement!).queryByRole('button')).toBeInTheDocument();
      expect(within(bcTitleField.parentElement!).queryByRole('button')).toBeDisabled();
      expect(within(akTitleField.parentElement!).queryByRole('button')).toBeInTheDocument();
      expect(within(akTitleField.parentElement!).queryByRole('button')).toBeDisabled();
    });

    test('Disables translate icon when form is not editable', () =>
    {
      const props: DetailProps = {
        ...TEST_PROPS,
        editable: false,
        doc: {
          ...TEST_PROPS.doc,
          bc_title: 'BC Title Text',
          ak_title: ''
        }
      };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const bcTitleField = screen.getByLabelText(fd.bc_title.label);
      expect(within(bcTitleField.parentElement!).queryByRole('button')).toBeInTheDocument();
      expect(within(bcTitleField.parentElement!).queryByRole('button')).toBeDisabled();
    });

    test('Translates BC title to AK when translate button is clicked',
         async () =>
    {
      const props: DetailProps = {
        ...TEST_PROPS,
        editable: true,
        doc: {
          ...TEST_PROPS.doc,
          bc_title: "Sm'algyax",
          ak_title: ''
        }
      };
      const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const bcTitleField = screen.getByLabelText(fd.bc_title.label);
      const translateButton = within(bcTitleField.parentElement!).getByRole('button');

      await userEvent.click(translateButton);

      await waitFor(() => {
        expect(screen.getByLabelText(fd.ak_title.label))
           .toHaveValue("Shm'algyack");
      });

      // Verify success alert was dispatched
      expect(store.dispatch).toHaveBeenCalledWith(
         expect.objectContaining({
                                   type: 'alertMessage/DisplayAlertBox',
                                   payload: expect.objectContaining({
                                                                      severity: 'success',
                                                                      message: 'Translation completed'
                                                                    })
                                 })
      );
    });

    test('Translates AK description to BC when translate button is clicked',
         async () =>
    {
      const props: DetailProps = {
        ...TEST_PROPS,
        editable: true,
        doc: {
          ...TEST_PROPS.doc,
          bc_description: '',
          ak_description: "Shm'algyack"
        }
      };
      const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const akDescField = screen.getByLabelText(fd.ak_description.label);
      const translateButton = within(akDescField.parentElement!).getByRole('button');

      await userEvent.click(translateButton);

      await waitFor(() => {
        expect(screen.getByLabelText(fd.bc_description.label))
           .toHaveValue("Sm'algyax");
      });

      // Verify success alert was dispatched
      expect(store.dispatch).toHaveBeenCalledWith(
         expect.objectContaining({
                                   type: 'alertMessage/DisplayAlertBox',
                                   payload: expect.objectContaining({
                                                                      severity: 'success',
                                                                      message: 'Translation completed'
                                                                    })
                                 })
      );
    });

    test('Shows error when trying to translate to field that already has content',
         async () =>
    {
      const props: DetailProps = {
        ...TEST_PROPS,
        editable: true,
        doc: {
          ...TEST_PROPS.doc,
          bc_title: 'BC Title Text',
          ak_title: ''
        }
      };
      const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

      // First add content to AK field
      const akTitleField = screen.getByLabelText(fd.ak_title.label);
      await userEvent.type(akTitleField, 'Existing AK content');

      // Now try to translate from BC to AK
      const bcTitleField = screen.getByLabelText(fd.bc_title.label);
      const translateButton = within(bcTitleField.parentElement!).queryByRole('button');

      // Button should be disabled since target field has content
      expect(translateButton).toBeDisabled();
    });
  });

  /*
   *  TODO: test New Upload
   *        *  Success - clears the form
   *           * Success Notice event fires
   *        * Error - preserves form content
   *           * Error Notice event fires
   *
   *  TODO: test Version Upload
   *        *  Success - preserves the form (version++)
   *           * Success Notice event fires
   *        * Error - preserves form content
   *           * Error Notice event fires
   */
});