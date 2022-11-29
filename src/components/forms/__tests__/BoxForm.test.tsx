import react from 'react'
import { render, screen, within } from '@testing-library/react'


import { 
  contains, startsWith,
  loadTestStore, renderWithProviders, renderWithState,  
} from '../../../utilities/testUtilities';
import { Gyet, printUser } from '../../../User/userType';
import { Xbiis } from '../../../Box/boxTypes';
import BoxForm from '../BoxForm';
import { DefaultRole, printRole, Role } from '../../../Role/roleTypes';


const TEST_USER: Gyet = {
  id: 'GUID-HERE',
  name: 'Test-User',
  email: 'nope@example.com',
  isAdmin: false,
  boxRoles: [],
}

const TEST_STATE = { userList: { users: [TEST_USER] as Gyet[] } }

const TEST_BOX = {
  id: 'Box-GUID-HERE',
  name: 'TEST BOXY',
  owner: TEST_USER,
  defaultRole: DefaultRole,
} as Xbiis

describe('BoxForm', () => { 
  
  test('BoxForm Renders correctly', () => 
  {
    const box = TEST_BOX;
    renderWithState(TEST_STATE, <BoxForm box={box} />);

    const idField = screen.getByTestId('id');
    expect(idField).toBeInTheDocument();
    expect(idField).not.toBeVisible();
    expect(within(idField).getByDisplayValue(box.id)).toBeInTheDocument();

    const nameField = screen.getByLabelText(startsWith('Name'));
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(box.name);

    const ownerField = screen.getByLabelText(startsWith('Owner'));
    expect(ownerField).toBeInTheDocument();
    expect(ownerField).toHaveValue(printUser(box.owner));

    const roleField = screen.getByLabelText(startsWith('Default Role'));
    
    expect(roleField).toBeInTheDocument();
    expect(roleField).toHaveTextContent(`${printRole(box.defaultRole)}`);
  });
});