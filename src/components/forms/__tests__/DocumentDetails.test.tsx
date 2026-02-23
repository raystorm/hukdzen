import { vi } from 'vitest';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvnt from '@testing-library/user-event';

import { Amplify } from "aws-amplify";
import { generateClient } from '@aws-amplify/api';

import amplifyConfig from '../../../amplifyconfiguration.json';

import userList from '../../../__utils__/__fixtures__/userList.json';
import boxList from '../../../__utils__/__fixtures__/boxList.json';
import {emptyUser, User} from '../../../User/userType';
import type { Xbiis } from '../../../Box/boxTypes';
import { BoxPurpose, DefaultBox, emptyXbiis, printBox, printXbiis } from '../../../Box/boxTypes';

import { renderWithState, contains, startsWith, } from '../../../__utils__/testUtilities';
import {
         verifyCanChangeField, verifyDateField, verifyField
       } from '../../../docs/__tests__/Document.helpers';

import DocumentDetailsForm, { DetailProps } from '../DocumentDetails';
import { DocumentDetailsFieldDefinition } from '../../../types/fieldDefitions';
import { emptyDocumentDetails } from "../../../docs/initialDocumentDetails";
import { Author, emptyAuthor } from "../../../Author/AuthorType";

import {
   resetDefaults, setDocExists,
   setGetDocument,
   setupSearchMocking, setupDocListMocking, setupDocumentMocking,
} from "../../../__utils__/__setup__/DocumentAPI.helper";
import {
   setupBoxUserListMocking, setBoxUserList, buildBoxUserList
} from "../../../__utils__/__setup__/BoxUserAPI.helper";
import {setupBoxListMocking} from "../../../__utils__/__setup__/BoxAPI.helper";

import {documentActions} from "../../../docs/documentSlice";
import {
         setupAuthorListMocking, setupAuthorMocking
       } from "../../../__utils__/__setup__/AuthorAPI.helper";
import authorList from "../../../__utils__/__fixtures__/authorList.json";

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


describe('DocumentDetails Form Unit Tests', () =>
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
    setupSearchMocking();
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

  describe('Rendering basics', () =>
  {
    // initial render
    test('Renders correctly for default', () =>
    {
      const props = { ...TEST_PROPS};
      const { doc } = props;

      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      expect(screen.getByText(props.pageTitle)).toBeInTheDocument();

      const idField = screen.getByTestId(fd.id.name);
      expect(idField).toBeInTheDocument();
      expect(idField).not.toBeVisible();
      expect(within(idField).getByDisplayValue(doc.id)).toBeInTheDocument();

      verifyField(fd.eng_title, doc.eng_title);

      verifyField(fd.eng_description, doc.eng_description);

      verifyField(fd.docOwner, doc.docOwner.name);
      verifyField(fd.author,   doc.author.name);

      verifyField(fd.bc_title,       doc.bc_title);
      verifyField(fd.bc_description, doc.bc_description);

      verifyField(fd.ak_title,       doc.ak_title);
      verifyField(fd.ak_description, doc.ak_description);

      const dlLink = screen.getByText('Download Current File');
      expect(dlLink).toBeInTheDocument();

      verifyField(fd.type, `${doc.type}`);

      verifyField(fd.version, doc.version);

      //TODO: match field format for dates

      verifyDateField(fd.created, doc.created);
      verifyDateField(fd.updated, doc.updated);
    });

    // default field values
  });

  describe('Read-Only fields', () =>
  {
    // read‑only fields
    test('Cannot change fileType even when form is editable', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS, editable: true, };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      verifyField(fd.type, `${props.doc.type}`);

      //await expect(userEvent.clear(screen.getByLabelText(fd.type.label)))
      //        .rejects.toThrowError('clear()` is only supported on editable elements.');

      //verify typing in the field doesn't work.
      const fileTypeField = screen.getByLabelText(fd.type.label);
      await userEvent.type(fileTypeField, 'x');
      expect(fileTypeField).toHaveValue(props.doc.type);
      expect(fileTypeField).toHaveAttribute('disabled');
    });

    test('Cannot change create date even when form is editable', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS, editable: true, };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      verifyDateField(fd.created, props.doc.created);

      //await expect(userEvent.clear(screen.getByLabelText(fd.created.label)))
      //        .rejects.toThrowError('clear()` is only supported on editable elements.');

      expect(screen.getByLabelText(fd.created.label)).toHaveAttribute("disabled");
    });

    test('Cannot change update date even when form is editable', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS, editable: true, };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      verifyDateField(fd.updated, props.doc.updated);

      //await expect(userEvent.clear(screen.getByLabelText(fd.updated.label)))
      //        .rejects.toThrowError('clear()` is only supported on editable elements.');

      expect(screen.getByLabelText(fd.created.label)).toHaveAttribute("disabled");
    });
  });

  describe('Editable fields', () =>
  {
    const editableFieldCases = [ fd.eng_title, fd.eng_description,
                                 fd.bc_title,  fd.bc_description,
                                 fd.ak_title,  fd.ak_description, ];

    editableFieldCases.forEach(field =>
    {
      test(`can update ${field.label}`, async () =>
      {
        const props: DetailProps = { ...TEST_PROPS, editable: true, };
        renderWithState(STATE, <DocumentDetailsForm {...props} />);

        await verifyCanChangeField(field, props.doc[field.name]);
      }, 20000);
    });

    // owner/author (future)
    //TODO: test owner change (After changing owner to autocomplete)
  });

  describe('Version field behavior', () =>
  {
    // increment version
    test('Can increment version when form is editable', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS, editable: true, };

      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const field = fd.version;

      verifyField(field, props.doc.version);

      const changedValue = 2;
      //await userEvent.clear(screen.getByLabelText(field.label));
      await userEvent.type(screen.getByLabelText(field.label),
                           //enter the new value at begin, delete previous
                           changedValue.toString()+'{Delete}',
                           { initialSelectionStart: 0 });

      await waitFor(() =>
                    { expect(screen.getByLabelText(field.label)).toHaveValue(changedValue); });

      verifyField(field, 2);
    });

    // prevent decrement
    test('Cannot decrement version when form is editable', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS, editable: true, };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      const field = fd.version;

      verifyField(field, props.doc.version);

      const changedValue = 0;
      //await userEvent.clear(screen.getByLabelText(field.label));
      await userEvent.type(screen.getByLabelText(field.label),
                           //enter the new value at begin, delete previous
                           changedValue.toString()+'{Delete}',
                           { initialSelectionStart: 0 });

      //verify error text is displayed
      await waitFor(() =>
                    { expect(screen.getByText('version can only go UP.')).toBeInTheDocument(); });

      verifyField(field, props.doc.version);
    });

    // version behavior for new vs versioned docs
  });

  describe('Buttons', () =>
  {
    // new doc buttons
    test('Button tests for new', () =>
    {
      const props : DetailProps = { ...TEST_PROPS, isNew: true, };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      //visible
      const create = 'Ma̱ngyen (Upload(Create New Item))';
      expect(screen.getByText(create)).toBeInTheDocument();

      //non-existant
      const save = 'ma̱x (Save)';
      const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';

      expect(screen.queryByText(nextVersion)).not.toBeInTheDocument();
      expect(screen.queryByText(save)).not.toBeInTheDocument();
    });

    // version buttons
    test('Button tests for version', () =>
    {
      const props : DetailProps = { ...TEST_PROPS, isVersion: true, };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      //visible
      const save = 'ma̱x (Save)';
      const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
      expect(screen.getByText(save)).toBeInTheDocument();
      expect(screen.getByText(nextVersion)).toBeInTheDocument();

      //non-existant
      const create = 'Ma̱ngyen (Upload(Create New Item))';
      expect(screen.queryByText(create)).not.toBeInTheDocument();
    });

    // editable buttons
    test('Button tests for editable', () =>
    {
      const props : DetailProps = { ...TEST_PROPS, editable: true, };
      renderWithState(STATE, <DocumentDetailsForm {...props} />);

      //visible
      const save = 'ma̱x (Save)';
      expect(screen.getByText(save)).toBeInTheDocument();

      //non-existant
      const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
      const create = 'Ma̱ngyen (Upload(Create New Item))';

      expect(screen.queryByText(nextVersion)).not.toBeInTheDocument();
      expect(screen.queryByText(create)).not.toBeInTheDocument();
    });

    // save button behavior
    test('Save Button triggers Save action for version', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS,
        isVersion: true,
        editable: true };
      const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

      //visible
      const save = 'ma̱x (Save)';
      const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
      expect(screen.getByText(save)).toBeInTheDocument();
      expect(screen.getByText(nextVersion)).toBeInTheDocument();

      // @ts-ignore
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      //trigger save action
      await userEvent.click(screen.getByText(save));

      //verify action was fired
      await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
      }, { timeout: 2000 });
    });

    test('Save Button does not trigger Save action for version without editable',
         async () =>
    {
       const props : DetailProps = { ...TEST_PROPS, isVersion: true };
       const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

       //visible
       const save = 'ma̱x (Save)';
       const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
       expect(screen.getByText(save)).toBeInTheDocument();
       expect(screen.getByText(nextVersion)).toBeInTheDocument();

       // @ts-ignore
       const actionCount = store.dispatch.mock.calls.length;
       expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

       //trigger save action
       await userEvent.click(screen.getByText(save));

       //verify action was fired
       await waitFor(() => {
       expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
     });
   });

    test('Save Button does not trigger Save action for new without editable',
         async () =>
    {
       const props : DetailProps = { ...TEST_PROPS, isNew: true };
       const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

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
         expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
       });
     });

    test('Save Button triggers Save action for editable', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS, editable: true };
      const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

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
        expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
      }, { timeout: 2000 });
    });

    // next version button behavior
    test('Next Version Button triggers action for version', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS,
        isVersion: true,
        editable: true };
      const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

      //visible
      const save = 'ma̱x (Save)';
      const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
      expect(screen.getByText(save)).toBeInTheDocument();
      expect(screen.getByText(nextVersion)).toBeInTheDocument();

      // @ts-ignore
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      //trigger save action
      await userEvent.click(screen.getByText(nextVersion));

      //verify action was fired
      await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
      }, { timeout: 2000 });
    });

    test('Next Version Button does not trigger action for version without editable',
         async () =>
    {
       const props : DetailProps = { ...TEST_PROPS, isVersion: true };
       const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

       //visible
       const save = 'ma̱x (Save)';
       const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
       expect(screen.getByText(save)).toBeInTheDocument();
       expect(screen.getByText(nextVersion)).toBeInTheDocument();

       // @ts-ignore
       const actionCount = store.dispatch.mock.calls.length;
       expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

       //trigger save action
       await userEvent.click(screen.getByText(nextVersion));

       //verify action was fired
       await waitFor(() => {
         expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
       });
     });

    test('Delete Button triggers Delete action', async () =>
    {
      const props : DetailProps = { ...TEST_PROPS, editable: true, isVersion: true };
      const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

      //visible
      const del = 'Delete';
      expect(screen.getByText(del)).toBeInTheDocument();
      //color hard-coded to match ${theme.palette.secondary.main} value
      expect(screen.getByText(del))
         .toHaveAttribute('style', 'background-color: rgb(175, 0, 0);');

      // @ts-ignore
      const actionCount = store.dispatch.mock.calls.length;
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

      //trigger save action
      await userEvent.click(screen.getByText(del));

      //verify action was fired
      await waitFor(() => {
        const action = documentActions.removeDocument(props.doc);
        expect(store.dispatch).toHaveBeenCalledWith(action);
      });
      await waitFor(() => {
        expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
      });
    });
  });

  describe('Save flows', () =>
  {
    // new upload success clears form
    test('On New Version Upload Success, Save triggers Save action, and form is cleared.',
         async () =>
    {
       const props : DetailProps = { ...TEST_PROPS, isNew: true, editable: true };
       const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

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
         const createDocAction = documentActions.createDocument(expect.anything());
         expect(store.dispatch).toHaveBeenCalledWith(createDocAction);
       }, { timeout: 2000 });

       /*
        *  test state, due to a testing bug,
        *  these state changes do not make it to the page
        */
       const docState = store.getState().document;
       const doc = emptyDocumentDetails;

       expect(docState.id).not.toEqual(props.doc.id); //GUID changed,
       expect(docState.id).not.toEqual(doc.id); //not empty

       expect(docState.eng_title).toEqual(doc.eng_title);
       expect(docState.eng_title).toEqual(doc.eng_description);

       expect(docState.docOwner).toEqual(props.doc.docOwner);
       expect(docState.author).toEqual(doc.author);

       expect(docState.bc_title).toEqual(doc.bc_title);
       expect(docState.bc_description).toEqual(doc.bc_description);

       expect(docState.ak_title).toEqual(doc.ak_title);
       expect(docState.ak_description).toEqual(doc.ak_description);

       const dlLink = screen.getByText('Download Current File');
       expect(dlLink).toBeInTheDocument();

       expect(docState.type).toEqual(doc.type);

       expect(docState.version).toEqual(doc.version);

       expect(docState.created).toEqual(doc.created);
       expect(docState.updated).toEqual(doc.updated);
     });

    // save error preserves form and file
  });

  describe('Form Validation', () =>
  {
    /*
     * TODO: test form validation errors
     *       * FileKey Error Message exists
     */

    const validationCases = [
      // --- AUTHOR ---
      {
        label: 'author is null',
        field: 'author',
        value: null,
        message: 'Author is a Required Field.'
      },
      {
        label: 'author is empty',
        field: 'author',
        value: emptyAuthor,
        message: 'Author is a Required Field.'
      },
      {
        label: 'author is cleared',
        field: 'author',
        action: async () => {
          await userEvent.click(screen.getByTitle('Clear'));
        },
        message: 'Author is a Required Field.'
      },

      // --- DOC OWNER ---
      {
        label: 'docOwner is null',
        field: 'docOwner',
        value: null,
        message: 'Document Owner is a Required Field.'
      },
      {
        label: 'docOwner is empty',
        field: 'docOwner',
        value: emptyUser,
        message: 'Document Owner is a Required Field.'
      },

      // --- BOX ---
      {
        label: 'box is null',
        field: 'box',
        value: null,
        message: 'Box is a Required Field.'
      },
      {
        label: 'box is empty',
        field: 'box',
        value: emptyXbiis,
        message: 'Box is a Required Field.'
      },

      // --- FILE KEY ---
      {
        label: 'fileKey is null',
        field: 'fileKey',
        value: null,
        message: 'Need a file to Upload.'
      },
      {
        label: 'fileKey is empty',
        field: 'fileKey',
        value: '',
        message: 'Need a file to Upload.'
      },
      {
        label: 'fileKey is whitespace',
        field: 'fileKey',
        value: '  ',
        message: 'Need a file to Upload.'
      },

      // --- TYPE ---
      {
        label: 'type is null',
        field: 'type',
        value: null,
        message: 'Missing File, or Unknown File Type.'
      },
      {
        label: 'type is empty',
        field: 'type',
        value: '',
        message: 'Missing File, or Unknown File Type.'
      },
      {
        label: 'type is whitespace',
        field: 'type',
        value: '  ',
        message: 'Missing File, or Unknown File Type.'
      },
      {
        label: 'type is undefined',
        field: 'type',
        value: undefined,
        setValue: true,
        message: 'Missing File, or Unknown File Type.'
      },

      // --- VERSION ---
      {
        label: 'version is null',
        field: 'version',
        value: null,
        message: 'Version (null) cannot be negative.'
      },
      {
        label: 'version is negative',
        field: 'version',
        value: -1,
        message: 'Version (-1) cannot be negative.'
      },
      {
        label: 'version is a string',
        field: 'version',
        value: 'a string',
        message: 'Version (a string) cannot be negative.'
      },
    ];

    validationCases.forEach(({ label, field, value, action, message, setValue }) =>
    {
      test(`stops processing when ${label}`, async () =>
      {
        const props: DetailProps = {
          ...TEST_PROPS,
          isVersion: true,
          editable: true,
          doc: { ...TEST_PROPS.doc }
        };

        // Set Field Value if desired
        // @ts-ignore
        if ( setValue || value !== undefined) { props.doc[field] = value; }

        const { store } = renderWithState(STATE, <DocumentDetailsForm {...props} />);

        // Perform UI-driven action if provided (e.g., clearing autocomplete)
        if (action) { await action(); }

        const save = 'ma̱x (Save)';
        expect(screen.getByText(save)).toBeInTheDocument();

        // Track dispatch count before clicking save
        // @ t s - ignore
        //const actionCount = store.dispatch.mock.calls.length;
        const actionCount = vi.mocked(store.dispatch).mock.calls.length;

        await userEvent.click(screen.getByText(save));

        // Expect validation message
        await waitFor(() =>
        { expect(screen.getByText(message)).toBeVisible(); });

        // Ensure no dispatch occurred
        expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
      });

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