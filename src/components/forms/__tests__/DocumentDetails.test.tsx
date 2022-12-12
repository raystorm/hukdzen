import react from 'react'
import { getByLabelText, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';

import { DocumentDetails } from '../../../docs/DocumentTypes';
import { Gyet } from '../../../User/userType';
import { Clan, printClanType } from "../../../User/ClanType";
import { BoxRole, emptyBoxRole, printBoxRole } from "../../../User/BoxRoleType";
import { Role } from '../../../Role/roleTypes';
import { Xbiis } from '../../../Box/boxTypes';
import { BoxList } from '../../../Box/BoxList/BoxListType';
import { 
         contains, loadTestStore, 
         renderWithProviders, 
         renderWithState, startsWith
       } from '../../../utilities/testUtilities';
import DocumentDetailsForm, { DetailProps } from '../DocumentDetails';
import { DocumentDetailsFieldDefintion, FieldDefinition } from '../../../types/fieldDefitions';

const TEST_PROPS = {
  pageTitle: 'Test Page',
  editable: false,
  isNew: false,
  isVersion: false,
  //END page specific props begin document Details

  id: 'DOCUMENT-GUID-HERE',
  title: 'TEST DOCUMENT TITLE',
  description: 'TEST DOCUMENT DESCRIPTION',
  filePath: '/PATH/TO/TEST/FILE',
  type: 'application/example',
  ownerId: 'USER-GUID-HERE', //TODO copy a setup test GUID
  authorId: 'USER-GUID-HERE', //TODO copy a setup test GUID
  version: 1,
  created: new Date(), //TODO set specific dates/times
  updated: new Date(),
  bc: { title: 'Nahawat-BC', description: 'Magon-BC', },
  ak: { title: 'Nahawat-AK', description: 'Magon-AK', },
} as DetailProps

const fd = DocumentDetailsFieldDefintion;

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

const verifyDateField = (field: FieldDefinition, value: Date | undefined) => 
{
  //search by Tooltip first as it is the containing element
  const dateField = screen.getByLabelText(`${field.label}`);
  expect(dateField).toBeInTheDocument();
  /*
  const placeHolder = `${dateField.getAttribute('placeholder')}`;
  console.log(placeHolder);
  */
  //hard-coded Format String
  //because placeholder isn't a valid format string
  const formatStr = 'MM/dd/yyyy hh:mm aaa';
  const expDate = value ? format(value, formatStr) : '';

  //expect(dateField).toHaveValue(value ? value.toLocaleString(enUS) : '');
  expect(dateField).toHaveValue(expDate);
}



userEvent.setup();

describe('DocumentDetailsForm', () => { 
  
  test('Document Details Renders correctly for default', () => { 
    
    const props = { ...TEST_PROPS};

    //render(<DocumentDetailsForm {...props} />);
    renderWithProviders(<DocumentDetailsForm {...props} />);

    expect(screen.getByText(props.pageTitle)).toBeInTheDocument();

    const idField = screen.getByTestId(fd.id.name);    
    expect(idField).toBeInTheDocument();
    expect(idField).not.toBeVisible();
    expect(within(idField).getByDisplayValue(props.id)).toBeInTheDocument();

    verifyField(fd.title, props.title);

    verifyField(fd.description, props.description);

    verifyField(fd.ownerId,  props.ownerId);
    verifyField(fd.authorId, props.authorId);
    
    verifyField(fd.bc.title,       props.bc.title);
    verifyField(fd.bc.description, props.bc.description);
    
    verifyField(fd.ak.title,       props.ak.title);
    verifyField(fd.ak.description, props.ak.description);

    const dlLink = screen.getByText('Download Current File');
    expect(dlLink).toBeInTheDocument();
    expect(dlLink).toHaveAttribute('href', props.filePath);
    //verifyField(fd.filePath, props.filePath);

    verifyField(fd.type, `${props.type}`);

    verifyField(fd.version, props.version);

    //TODO: match field format for dates

    verifyDateField(fd.created, props.created);
    verifyDateField(fd.updated, props.updated);
  });

  test('Can update Title when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.title, props.title);
  });

  test('Can update description when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.description, props.description);
  });

  test('Can update nahawt-bc when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.bc.title, props.bc.title);
  });

  test('Can update magon-bc when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.bc.description, props.bc.description);
  });

  test('Can update nahawt-ak when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.ak.title, props.ak.title);
  });

  test('Can update magon-ak when form is editable', async () => 
  {
    const props : DetailProps = { ...TEST_PROPS, editable: true, };

    renderWithProviders(<DocumentDetailsForm {...props} />);

    await verifyCanChangeField(fd.ak.description, props.ak.description);
  });

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

  //TODO: test that certain fields are not editable

  //TODO: test owner change

  //TODO: test setting `FILE TYPE`

  //TODO: different buttons per, new/version, edit

  //TODO: actions
});