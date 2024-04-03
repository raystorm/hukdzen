import react from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import {v4 as randomUUID} from "uuid";
import path from 'path';
import {when} from "jest-when";
import { Amplify, Storage } from "aws-amplify";

import awsConfig from '../../../aws-exports';

import userList from '../../../data/userList.json';
import boxList from '../../../data/boxList.json';
import {MoveDocument} from '../../../docs/DocumentTypes';
import {emptyUser, User} from '../../../User/userType';
import {emptyXbiis, printBox, Xbiis} from '../../../Box/boxTypes';
import {
  renderWithState, renderWithProviders, contains, startsWith,
} from '../../../__utils__/testUtilities';
import { loadLocalFile } from '../../../__utils__/fileUtilities';
import {dropFilesText, UploadAccessLevel} from '../../widgets/AWSFileUploader';
import DocumentDetailsForm, { DetailProps } from '../DocumentDetails';
import {
         DocumentDetailsFieldDefinition, FieldDefinition
       } from '../../../types/fieldDefitions';
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";
import {Author, emptyAuthor} from "../../../Author/AuthorType";
import {
  setGetDocument,
  setupDocListMocking,
  setupDocumentMocking, setupStorageMocking
} from "../../../__utils__/__fixtures__/DocumentAPI.helper";
import {
  setupBoxUserListMocking, setBoxUserList
} from "../../../__utils__/__fixtures__/BoxUserAPI.helper";
import {setupBoxListMocking} from "../../../__utils__/__fixtures__/BoxAPI.helper";
import {documentActions} from "../../../docs/documentSlice";
import {BoxList} from "../../../Box/BoxList/BoxListType";
import {setupAuthorListMocking} from "../../../__utils__/__fixtures__/AuthorAPI.helper";
import {BoxUserList, emptyBoxUserList} from "../../../BoxUser/BoxUserList/BoxUserListType";
import {BoxUser, buildBoxUser} from "../../../BoxUser/BoxUserType";
import {Role} from "../../../Role/roleTypes";
import {printGyet} from "../../../Gyet/GyetType";
import authorList from "../../../data/authorList.json";
import {AuthorFormTitle} from "../AuthorForm";
import {authorActions} from "../../../Author/authorSlice";
import {verifyCanChangeField, verifyDateField, verifyField} from '../../../__utils__/DocumentDetailsUtilities';

const author: Author = {
  ...emptyAuthor,
  id: 'AUTHOR_GUID',
  name: 'example Author',
  email: 'author@example.com'
}

const user: User = {
  ...emptyUser,
  id: 'USER-GUID-HERE',
  name: 'example User',
  email: 'user@example.com'
}

const initBox: Xbiis = {
  ...emptyXbiis,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: user,
  xbiisOwnerId: author.id,
}

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
  }
}

const fd = DocumentDetailsFieldDefinition;

Amplify.configure(awsConfig);


/**
 *  Helper method to fail/force an error when testing/debugging
 *  @param message failure reason
 */
// noinspection NonAsciiCharacters JSUnusedLocalSymbols
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ಠ_ಠ = (message: string ) => { throw new Error(message); }

// TODO: should I split this file?

describe('DocumentDetails Form',  () => {

  beforeEach(() => {
    setupDocListMocking();
    setGetDocument(TEST_PROPS.doc);
    setupDocumentMocking();
    setupBoxUserListMocking();
    setupBoxListMocking();
    setupAuthorListMocking();
  });
  
  test('Document Details Renders correctly for default', () =>
  {
    const props = { ...TEST_PROPS};
    const { doc } = props;

    renderWithProviders(<DocumentDetailsForm {...props} />);

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

  test('Can update Title when form is editable', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.eng_title, props.doc.eng_title);
  }, 20000);

  test('Can update description when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.eng_description, props.doc.eng_description);
  }, 20000);

  test('Can update nahawt-bc when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.bc_title, props.doc.bc_title);
  }, 20000);

  test('Can update magon-bc when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.bc_description, props.doc.bc_description);
  }, 20000);

  test('Can update nahawt-ak when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };
    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.ak_title, props.doc.ak_title);
  }, 20000);

  test('Can update magon-ak when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.ak_description, props.doc.ak_description);
  }, 20000);

  test('Can increment version when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

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

  test('Cannot decrement version when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

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

  test('Cannot change fileType even when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    verifyField(fd.type, `${props.doc.type}`);

    await expect(userEvent.clear(screen.getByLabelText(fd.type.label)))
            .rejects.toThrowError('clear()` is only supported on editable elements.');
  });

  test('Cannot change create date even when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    verifyDateField(fd.created, props.doc.created);

    await expect(userEvent.clear(screen.getByLabelText(fd.created.label)))
            .rejects.toThrowError('clear()` is only supported on editable elements.');

  });

  test('Cannot change update date even when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    verifyDateField(fd.updated, props.doc.updated);

    await expect(userEvent.clear(screen.getByLabelText(fd.updated.label)))
            .rejects.toThrowError('clear()` is only supported on editable elements.');

  });

  //TODO: test owner change (After changing owner to autocomplete)

  test('Clicking Download link gets the file', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS };
    renderWithProviders(<DocumentDetailsForm {...props} />);

    const dlLink = screen.getByText('Download Current File');
    expect(dlLink).toBeInTheDocument();
    //expect(dlLink).toHaveAttribute('href', props.filePath);

    when(Storage.get).mockResolvedValue(props.doc.fileKey);
    await userEvent.click(dlLink);

    await waitFor(() => {
      expect(Storage.get)
        .toHaveBeenCalledWith(props.doc.fileKey, UploadAccessLevel);
    });
  });

  test('AWSFileUploader uploads a file then properly determines and sets file type.',
       async () => 
  { 
    const props : DetailProps = { ...TEST_PROPS, isNew: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

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

    //new does not increment version
    expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);
  });

  test('AWSFileUploader upload increments version as part of new version',
       async () =>
  { 
    const props : DetailProps = { ...TEST_PROPS, isVersion: true };
    renderWithProviders(<DocumentDetailsForm {...props} />);

    //validate file name not displayed before upload
    expect(screen.queryByText('ovoid.svg')).not.toBeInTheDocument();

    expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);
    const dropZone = screen.getByText(dropFilesText);
    expect(dropZone).toBeInTheDocument();

    Storage.put = jest.fn();
    //@ts-ignore
    when(Storage.put).mockResolvedValue({ key: 'file' });

    //resolves from project root instead of file.
    const logoFile = loadLocalFile(path.resolve('./src/images/ovoid.jpg'));
    fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });

    //verify file type is correctly determined and set post, upload
    await waitFor(() => {
      expect(screen.getByLabelText(fd.type.label)).toHaveValue('image/jpeg');
    }, { timeout: 2000 }); //wait 2 seconds for the upload

    //check for file preview
    expect(screen.getByText('ovoid.jpg')).toBeInTheDocument();

    //check version incremented
    await waitFor(() => {
      expect(screen.getByLabelText(fd.version.label)).toHaveValue(2);
    });
  });

  test('Button tests for new', () => 
  {
    const props : DetailProps = { ...TEST_PROPS, isNew: true, };
    renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const create = 'Ma̱ngyen (Upload(Create New Item))';
    expect(screen.getByText(create)).toBeInTheDocument();

    //non-existant
    const save = 'ma̱x (Save)'; 
    const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)'; 

    expect(screen.queryByText(nextVersion)).not.toBeInTheDocument();
    expect(screen.queryByText(save)).not.toBeInTheDocument();
  });

  test('Button tests for version', () => 
  {
    const props : DetailProps = { ...TEST_PROPS, isVersion: true, };
    renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const save = 'ma̱x (Save)'; 
    const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)'; 
    expect(screen.getByText(save)).toBeInTheDocument();
    expect(screen.getByText(nextVersion)).toBeInTheDocument();
    
    //non-existant
    const create = 'Ma̱ngyen (Upload(Create New Item))';
    expect(screen.queryByText(create)).not.toBeInTheDocument();
  });

  test('Button tests for editable', () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };
    renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const save = 'ma̱x (Save)'; 
    expect(screen.getByText(save)).toBeInTheDocument();

    //non-existant
    const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)'; 
    const create = 'Ma̱ngyen (Upload(Create New Item))';

    expect(screen.queryByText(nextVersion)).not.toBeInTheDocument();
    expect(screen.queryByText(create)).not.toBeInTheDocument();
  });

  test('Save Button triggers Save action for version', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, 
                                  isVersion: true,
                                  editable: true };
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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

  test('Next Version Button triggers action for version', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, 
                                  isVersion: true,
                                  editable: true };
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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

  test('On New Version Upload Success, Save triggers Save action, and form is cleared.',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, isNew: true, editable: true };
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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

  test('Save Button does not trigger Save action for new without editable', 
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, isNew: true };
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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

  test('Changing Box dispatches the Move File Action',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true };
    const state: any = {
      currentUser: userList.items[0] as User,
      boxList: boxList as BoxList,
    }

    const buildBoxUserList = (): BoxUserList => {
      let items: BoxUser[] = [];
      for(let b of boxList.items )
      {
        const box = b as Xbiis;
        for (let u of userList.items)
        {
          const user = u as User;
          if ( user.id !== state.currentUser.id ) { break; }
          items.push({ ...buildBoxUser(user, box, Role.Write), id: randomUUID(), });
        }
      }
      return { ...emptyBoxUserList, items: items };
    }

    state.boxUserList = buildBoxUserList();

    setBoxUserList(state.boxUserList);
    setupBoxUserListMocking();
    setupStorageMocking();

    const { store } =
          renderWithState(state, <DocumentDetailsForm {...props} />);

    //update box
    const changeBox = `${printBox(boxList.items[1] as Xbiis)}`;
    const boxField = screen.getByTestId('box');
    const boxButton = within(boxField).getByRole('button');
    await userEvent.click(boxButton);

    await waitFor(() =>
    {
      expect(screen.getAllByText(contains(changeBox))[0]).toBeInTheDocument();
    });
    await userEvent.click(screen.getAllByText(contains(changeBox))[0]);

    await waitFor(() =>
    { // eslint-disable-next-line testing-library/no-node-access
      expect(within(screen.getByTestId('box').parentElement!)
         .getByText(changeBox)).toBeInTheDocument();
    });

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
      }
      const action = documentActions.moveDocument(move);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    }, { timeout: 2000 });

    await waitFor(() => {
      const idMatcher = expect.objectContaining({id: props.doc.id});
      const action = documentActions.updateDocumentMetadata(idMatcher);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    }, { timeout: 2000 });
  });

  test('Delete Button triggers Delete action', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, isVersion: true };
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

    setupStorageMocking();

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

  /*
   * TODO: test form validation errors
   *       * FileKey Error Message exists
   */

  test('Form Validation stops processing when author is empty',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.author = emptyAuthor;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Author is a Required Field.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when author is null',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    // @ts-ignore
    props.doc.author = null;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Author is a Required Field.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when author is cleared',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
       isVersion: true, editable: true };
     const doc = props.doc;
     const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

     //visible
     const save = 'ma̱x (Save)';
     const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
     expect(screen.getByText(save)).toBeInTheDocument();
     expect(screen.getByText(nextVersion)).toBeInTheDocument();

     const printAuthor = printGyet(doc.author)
     expect(screen.getByRole('combobox')).toHaveDisplayValue(printAuthor);

     await userEvent.click(screen.getByTitle('Clear'));

     // @ts-ignore
     const actionCount = store.dispatch.mock.calls.length;
     expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

     //trigger save action
     await userEvent.click(screen.getByText(save));

     //verify action was fired
     const requiredMessage = 'Author is a Required Field.';
     await waitFor(() => {
       expect(screen.getByText(requiredMessage)).toBeVisible();
     }, { timeout: 2000 });
     expect(screen.getByText(requiredMessage)).toBeVisible();
     expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when DocOwner is empty',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.docOwner = emptyUser;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Document Owner is a Required Field.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when docOwner is null',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    // @ts-ignore
    props.doc.docOwner = null;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const save = 'ma̱x (Save)';
    const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
    expect(screen.getByText(save)).toBeInTheDocument();
    expect(screen.getByText(nextVersion)).toBeInTheDocument();

    const requiredMessage = 'Document Owner is a Required Field.';

    // eslint-disable-next-line testing-library/no-node-access
    const errors = document.getElementsByClassName('MUI-error');
    expect(errors).toHaveLength(0);

    expect(screen.queryByText(requiredMessage)).not.toBeInTheDocument();

    // @ts-ignore
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

    //trigger save action
    await userEvent.click(screen.getByText(save));

    //verify action was fired
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    //screen.debug(screen.getByText(requiredMessage));
    //screen.debug(screen.getByLabelText(fd.docOwner.description));
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when box is empty',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.box = emptyXbiis;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Box is a Required Field.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when box is null',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    // @ts-ignore
    props.doc.box = null;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Box is a Required Field.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when fileKey is empty',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.fileKey = '';
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const save = 'ma̱x (Save)';
    const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
    expect(screen.getByText(save)).toBeInTheDocument();
    expect(screen.getByText(nextVersion)).toBeInTheDocument();

    expect(screen.queryByText('Disabled Until a Box is Selected'))
       .not.toBeInTheDocument()

    // @ts-ignore
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

    //trigger save action
    await userEvent.click(screen.getByText(save));

    //verify action was fired
    const requiredMessage = 'Need a file to Upload.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when fileKey is whitespace',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.fileKey = '  ';
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const save = 'ma̱x (Save)';
    const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
    expect(screen.getByText(save)).toBeInTheDocument();
    expect(screen.getByText(nextVersion)).toBeInTheDocument();

    expect(screen.queryByText('Disabled Until a Box is Selected'))
      .not.toBeInTheDocument()

    // @ts-ignore
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

    //trigger save action
    await userEvent.click(screen.getByText(save));

    //verify action was fired
    const requiredMessage = 'Need a file to Upload.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when fileKey is null', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    // @ts-ignore
    props.doc.fileKey = null;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const save = 'ma̱x (Save)';
    const nextVersion = 'Ma̱ngyen aamadzap (Upload better Version)';
    expect(screen.getByText(save)).toBeInTheDocument();
    expect(screen.getByText(nextVersion)).toBeInTheDocument();

    expect(screen.queryByText('Disabled Until a Box is Selected'))
       .not.toBeInTheDocument()

    // @ts-ignore
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

    //trigger save action
    await userEvent.click(screen.getByText(save));

    //verify action was fired
    const requiredMessage = 'Need a file to Upload.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when type is empty', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.type = '';
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Missing File, or Unknown File Type.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when type is whitespace', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.type = '  ';
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Missing File, or Unknown File Type.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when type is undefined', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.type = undefined;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Missing File, or Unknown File Type.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when type is null', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.type = null;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Missing File, or Unknown File Type.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when version is negative',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    props.doc.version = -1;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Version (-1) cannot be negative.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when version is null', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    // @ts-ignore
    props.doc.version = null;
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Version (null) cannot be negative.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form Validation stops processing when version is a string', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, doc: {...TEST_PROPS.doc},
                                  isVersion: true, editable: true };
    // @ts-ignore
    props.doc.version = 'a string';
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

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
    const requiredMessage = 'Version (a string) cannot be negative.';
    await waitFor(() => {
      expect(screen.getByText(requiredMessage)).toBeVisible();
    }, { timeout: 2000 });
    expect(screen.getByText(requiredMessage)).toBeVisible();
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

  test('Form data and changes are preserved when a new author is added.',
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };
    const { doc } = props;
    const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

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

    //verify original form still has data
    verifyField(fd.eng_title, changedTitle);
    verifyField(fd.eng_description, doc.eng_description);
  }, 20000);

  test('Form can still be edited after a new author is added.',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, editable: true, };
     const { doc } = props;
     const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

     //verify original values
     verifyField(fd.eng_title,       doc.eng_title);
     verifyField(fd.eng_description, doc.eng_description);

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

     await verifyCanChangeField(fd.eng_title, doc.eng_title);
     verifyField(fd.eng_description,          doc.eng_description);
  }, 20000);

  test('Can Upload Files after a new author is added.',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, isNew: true, editable: true, };
     const { doc } = props;
     const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

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

     /*
     await waitFor(() => {
       expect(screen.getByText('Uploaded')).toBeInTheDocument();
     });
     */
  }, 20000);

  test('Author can be changed after a new author is added.',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, editable: true, };
     const { doc } = props;
     const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

     //ensure author exists
     expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

     const auth2 = authorList.items[2] as Author;
     const printedAuth2 = printGyet(auth2);

    expect(screen.queryByDisplayValue(printedAuth2)).not.toBeInTheDocument();

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

    const auth3 = authorList.items[0] as Author;
    const printedAuth3 = printGyet(auth3);

    expect(screen.queryByDisplayValue(printedAuth3)).not.toBeInTheDocument();

    const textbox2 = screen.getByRole('combobox');

    await userEvent.clear(textbox2);
    await userEvent.type(textbox2, printedAuth3);
    await userEvent.type(textbox, '[ArrowDown][Enter]');

    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toHaveDisplayValue(printedAuth2);
    });
    expect(screen.getByRole('combobox')).toHaveDisplayValue(printedAuth3);
  }, 20000);

  test('Author can still be cleared after a new author is added.',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, editable: true, };
     const { doc } = props;
     const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

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

     //clear the field
     await userEvent.click(screen.getByTitle('Clear'));

     //verify empty
     verifyField(fd.author, '');
  }, 20000);

  test('Form data and changes are preserved when a new author modal is cancelled',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, editable: true, };
     const { doc } = props;
     const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

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

     await waitFor(() => {
       expect(store?.getState().author).toHaveProperty('name', '');
     });

     //verify original form still has data
     verifyField(fd.eng_title, changedTitle);
     verifyField(fd.eng_description, doc.eng_description);
  }, 20000);

  test('Form can still be edited after a new author is cancelled.',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, editable: true, };
     const { doc } = props;
     const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

     //verify original values
     verifyField(fd.eng_title,       doc.eng_title);
     verifyField(fd.eng_description, doc.eng_description);

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

     await waitFor(() => {
       expect(store?.getState().author).toHaveProperty('name', '');
     });

     await verifyCanChangeField(fd.eng_title, doc.eng_title);
     verifyField(fd.eng_description,          doc.eng_description);
  }, 20000);

  test('Author can be changed after a new author is Cancelled.',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, editable: true, };
     const { doc } = props;
     const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

     //ensure author exists
     expect(screen.getByDisplayValue(printGyet(doc.author))).toBeInTheDocument();

     const auth2 = authorList.items[2] as Author;
     const printedAuth2 = printGyet(auth2);

     expect(screen.queryByDisplayValue(printedAuth2)).not.toBeInTheDocument();

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

     await waitFor(() => {
       expect(store?.getState().author).toHaveProperty('name', '');
     });

     const auth3 = authorList.items[0] as Author;
     const printedAuth3 = printGyet(auth3);

     expect(screen.queryByDisplayValue(printedAuth3)).not.toBeInTheDocument();

     const textbox2 = screen.getByRole('combobox');

     await userEvent.clear(textbox2);
     await userEvent.type(textbox2, printedAuth3);
     await userEvent.type(textbox, '[ArrowDown][Enter]');

     await waitFor(() => {
       expect(screen.getByRole('combobox')).not.toHaveDisplayValue(printedAuth2);
     });
     expect(screen.getByRole('combobox')).toHaveDisplayValue(printedAuth3);
   }, 20000);

  test('Author can still be cleared after a new author is Cancelled.',
       async () =>
  {
     const props : DetailProps = { ...TEST_PROPS, editable: true, };
     const { doc } = props;
     const {store} = renderWithProviders(<DocumentDetailsForm {...props} />);

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

     await waitFor(() => {
       expect(store?.getState().author).toHaveProperty('name', '');
     });

     //clear the field
     await userEvent.click(screen.getByTitle('Clear'));

     //verify empty
     verifyField(fd.author, '');
   }, 20000);

  /* TODO: test setting empty box after page load */

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