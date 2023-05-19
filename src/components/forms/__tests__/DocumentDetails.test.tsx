import react from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import path from 'path';

import { DocumentDetails } from '../../../docs/DocumentTypes';
import {emptyGyet, Gyet} from '../../../User/userType';
import {emptyXbiis, Xbiis} from '../../../Box/boxTypes';
import { 
         renderWithProviders, contains, startsWith
       } from '../../../utilities/testUtilities';
import { loadLocalFile } from '../../../utilities/fileUtilities';
import DocumentDetailsForm, { DetailProps } from '../DocumentDetails';
import { 
         DocumentDetailsFieldDefinition, FieldDefinition
       } from '../../../types/fieldDefitions';
import {emptyDocumentDetails} from "../../../docs/initialDocumentDetails";

const author: Gyet = {
  ...emptyGyet,
  id: 'USER-GUID-HERE',
  name: 'example',
  email: 'author@example.com'
}

const initBox: Xbiis = {
  ...emptyXbiis,
  id: 'BOX-GUID',
  name: 'Test Box o AWESOME!',
  owner: author,
  xbiisOwnerId: author.id,
}

const TEST_PROPS: DetailProps = {
  pageTitle: 'Test Page',
  editable: false,
  isNew: false,
  isVersion: false,
  //END page specific props begin document Details
  ...emptyDocumentDetails,

  id: 'DOCUMENT-GUID-HERE',
  eng_title: 'TEST DOCUMENT TITLE',
  eng_description: 'TEST DOCUMENT DESCRIPTION',

  bc_title: 'Nahawat-BC', bc_description: 'Magon-BC',
  ak_title: 'Nahawat-AK', ak_description: 'Magon-AK',

  author:   author,
  docOwner: author,
  documentDetailsAuthorId: author.id,
  documentDetailsDocOwnerId: author.id,

  fileKey: '/PATH/TO/TEST/FILE',
  type: 'application/example',
  version: 1,

  created: new Date().toISOString(), //TODO set specific dates/times
  updated: new Date().toISOString(),
}

const fd = DocumentDetailsFieldDefinition;

const verifyField = (field: FieldDefinition, value: string | number) => 
{
  //search by Tooltip first as it is the containing element
  const tooltipField = screen.getByLabelText(`${field.description}`);
  expect(tooltipField).toBeInTheDocument();    
  const title = within(tooltipField).getByLabelText(field.label);
  expect(title).toBeInTheDocument();
  expect(title).toHaveValue(value);
}

const verifyCanChangeField = async (field: FieldDefinition, value: string) =>
{
  verifyField(field, value);

  const changedValue = 'I have been changed';
  await userEvent.clear(screen.getByLabelText(field.label));
  await userEvent.type(screen.getByLabelText(field.label), changedValue);

  await waitFor(() => 
  { expect(screen.getByLabelText(field.label)).toHaveValue(changedValue); });

  verifyField(field, changedValue);
}

const verifyDateField = (field: FieldDefinition, value: Date | string | null | undefined) =>
{
  //search by Tooltip first as it is the containing element
  const dateField = screen.getByLabelText(`${field.label}`);
  expect(dateField).toBeInTheDocument();
  /*
  const placeHolder = `${dateField.getAttribute('placeholder')}`;
  console.log(placeHolder);
  */
  //hard-coded Format String

  //console.log(`checking Date: ${JSON.stringify(value)}`);
  // checking Date: "2023-05-18T03:56:43.425Z"

  if (value && typeof value == "string") { value = new Date(value); }

  //because placeholder isn't a valid format string
  const formatStr = 'MM/dd/yyyy hh:mm aaa';
  const expDate = value ? format(value, formatStr) : '';

  //expect(dateField).toHaveValue(value ? value.toLocaleString(enUS) : '');
  expect(dateField).toHaveValue(expDate);
}

userEvent.setup();

describe('DocumentDetails Form', () => {
  
  test('Document Details Renders correctly for default', () => { 
    
    const props = { ...TEST_PROPS};

    //render(<DocumentDetailsForm {...props} />);
    renderWithProviders(<DocumentDetailsForm {...props} />);

    expect(screen.getByText(props.pageTitle)).toBeInTheDocument();

    const idField = screen.getByTestId(fd.id.name);    
    expect(idField).toBeInTheDocument();
    expect(idField).not.toBeVisible();
    expect(within(idField).getByDisplayValue(props.id)).toBeInTheDocument();

    verifyField(fd.eng_title, props.eng_title);

    verifyField(fd.eng_description, props.eng_description);

    verifyField(fd.docOwner, props.docOwner.name);
    verifyField(fd.author,   props.author.name);
    
    verifyField(fd.bc_title,       props.bc_title);
    verifyField(fd.bc_description, props.bc_description);
    
    verifyField(fd.ak_title,       props.ak_title);
    verifyField(fd.ak_description, props.ak_description);

    const dlLink = screen.getByText('Download Current File');
    expect(dlLink).toBeInTheDocument();

    //expect(dlLink).toHaveAttribute('href', props.filePath);
    //verifyField(fd.filePath, props.filePath);

    verifyField(fd.type, `${props.type}`);

    verifyField(fd.version, props.version);

    //TODO: match field format for dates

    verifyDateField(fd.created, props.created);
    verifyDateField(fd.updated, props.updated);

    //verifyField(fd.created, props.created);
    //verifyField(fd.updated, props.updated);
  });

  test('Can update Title when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.eng_title, props.eng_title);
  }, 10000);

  test('Can update description when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.eng_description, props.eng_description);
  }, 10000);

  test('Can update nahawt-bc when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.bc_title, props.bc_title);
  }, 10000);

  test('Can update magon-bc when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.bc_description, props.bc_description);
  }, 10000);

  test('Can update nahawt-ak when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };
    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.ak_title, props.ak_title);
  }, 10000);

  test('Can update magon-ak when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.ak_description, props.ak_description);
  }, 10000);

  test('Can increment version when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    const field = fd.version;

    verifyField(field, props.version);

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

    verifyField(field, props.version);

    const changedValue = 0;
    //await userEvent.clear(screen.getByLabelText(field.label));
    await userEvent.type(screen.getByLabelText(field.label),
                         //enter the new value at begin, delete previous 
                         changedValue.toString()+'{Delete}',
                         { initialSelectionStart: 0 });
    
    //verify error text is displayed
    await waitFor(() => 
    { expect(screen.getByText('version can only go UP.')).toBeInTheDocument(); });

    verifyField(field, props.version);
  });

  test('Cannot change fileType even when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    verifyField(fd.type, `${props.type}`);

    await expect(userEvent.clear(screen.getByLabelText(fd.type.label)))
            .rejects.toThrowError('clear()` is only supported on editable elements.');

  });

  test('Cannot change create date even when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    verifyDateField(fd.created, props.created);

    await expect(userEvent.clear(screen.getByLabelText(fd.created.label)))
            .rejects.toThrowError('clear()` is only supported on editable elements.');

  });

  test('Cannot change update date even when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    verifyDateField(fd.updated, props.updated);

    await expect(userEvent.clear(screen.getByLabelText(fd.updated.label)))
            .rejects.toThrowError('clear()` is only supported on editable elements.');

  });

  //TODO: test owner change (After changing owner to autocomplete)

  test('Download link is a link to a file', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    const dlLink = screen.getByText('Download Current File');
    expect(dlLink).toBeInTheDocument();
    //expect(dlLink).toHaveAttribute('href', props.filePath);
  });

  //TODO: update for AWSFileUploader
  test.skip('Dropzone uploads a file and properly determines and sets file type.',
       async () => 
  { 
    const props : DetailProps = { ...TEST_PROPS, isNew: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    const dropZone = screen.getByText(startsWith('Drag and Drop a File,'));
    
    expect(dropZone).toBeInTheDocument();
    screen.debug(dropZone);
    
    //resolves from project root instead of file.
    const logoFile = loadLocalFile(path.resolve('./src/images/logo.svg'));
    await fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });
    
    //verify file type is correctly determined and set post, upload
    await waitFor(() => {
      expect(screen.getByLabelText(fd.type.label)).toHaveValue('image/svg+xml');
    }, { timeout: 2000 }); //wait 2 seconds for the upload

    //verify empty label removed
    expect(screen.queryByText(startsWith('Drag and Drop a File,')))
      .not.toBeInTheDocument();

    //check for file preview
    expect(screen.getByTitle(startsWith('logo.svg'))).toBeInTheDocument();

    //new does not increment version
    expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);
  });

  //TODO: update for AWSFileUploader
  test.skip('Dropzone upload increments version as part of new version', async () =>
  { 
    const props : DetailProps = { ...TEST_PROPS, isVersion: true };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    expect(screen.getByLabelText(fd.version.label)).toHaveValue(1);

    const dropZone = screen.getByText(startsWith('Drag and Drop a File,'));

    expect(dropZone).toBeInTheDocument();
    screen.debug(dropZone);
    
    //resolves from project root instead of file.
    const logoFile = loadLocalFile(path.resolve('./src/images/logo.svg'));
    await fireEvent.drop(dropZone, { dataTransfer: { files: [logoFile] } });
    
    //verify file type is correctly determined and set post, upload
    await waitFor(() => {
      expect(screen.getByLabelText(fd.type.label)).toHaveValue('image/svg+xml');
    }, { timeout: 2000 }); //wait 2 seconds for the upload

    //verify empty label removed
    expect(screen.queryByText(startsWith('Drag and Drop a File,')))
      .not.toBeInTheDocument();

    //check for file preview
    expect(screen.getByTitle(startsWith('logo.svg'))).toBeInTheDocument();

    //check version incremented
    expect(screen.getByLabelText(fd.version.label)).toHaveValue(2);
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
    
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    //trigger save action
    await userEvent.click(screen.getByText(nextVersion));

    //verify action was fired
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    });
  });

  test('Save Button triggers Save action for new', async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, 
                                  isNew: true,
                                  editable: true };
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const create = 'Ma̱ngyen (Upload(Create New Item))';
    expect(screen.getByText(create)).toBeInTheDocument();
    
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    //trigger save action
    await userEvent.click(screen.getByText(create));

    //verify action was fired
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
    }, { timeout: 2000 });
  });

  test('Save Button does not trigger Save action for new without editable', 
       async () =>
  {
    const props : DetailProps = { ...TEST_PROPS, isNew: true };
    const { store } = renderWithProviders(<DocumentDetailsForm {...props} />);

    //visible
    const create = 'Ma̱ngyen (Upload(Create New Item))';
    expect(screen.getByText(create)).toBeInTheDocument();
    
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
    
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    //trigger save action
    await userEvent.click(screen.getByText(save));

    //verify action was fired
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
    }, { timeout: 2000 });
  });

});