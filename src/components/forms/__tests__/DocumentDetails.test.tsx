import react from 'react'
import { getByLabelText, render, screen, within } from '@testing-library/react'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enUS } from 'date-fns/locale';
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
  })

});