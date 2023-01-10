import react from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

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

const TEST_USER_2: Gyet = {
  id: 'GUID2-HERE',
  name: 'Different Test User',
  email: 'akadi-gohl@example.com',
  isAdmin: false,
  boxRoles: [],
}



const TEST_STATE = { userList: { users: [TEST_USER, TEST_USER_2] as Gyet[] } }

const TEST_BOX = {
  id: 'Box-GUID-HERE',
  name: 'TEST BOXY',
  owner: TEST_USER,
  defaultRole: DefaultRole,
} as Xbiis

userEvent.setup();

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

  test('Name is editable', async () => 
  {
    const box = TEST_BOX;
    renderWithState(TEST_STATE, <BoxForm box={box} />);

    const change = 'Changed Value';

    const nameField = screen.getByLabelText(startsWith('Name'));
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(box.name);

    await userEvent.clear(nameField);
    await userEvent.type(nameField, change);

    await waitFor(() => { expect(nameField).toHaveValue(change); });
  });

  test('Can select name from owner autocomplete', async () => 
  {
    const box = TEST_BOX;
    renderWithState(TEST_STATE, <BoxForm box={box} />);

    const ownerField = screen.getByLabelText(startsWith('Owner'));
    expect(ownerField).toBeInTheDocument();
    expect(ownerField).toHaveValue(printUser(box.owner));

    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(within(screen.getByTestId('owner-autocomplete'))
                 .queryByDisplayValue(TEST_USER_2.name))
                 .not.toBeInTheDocument();

    const textbox = within(screen.getByTestId('owner-autocomplete'))
                        .getByRole('combobox');

    screen.debug(textbox);

    //TODO: figure out how to do this buy mouse click and text selection

    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //open the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //into the the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //skip to expected entry
    fireEvent.keyDown(textbox, { key: 'ArrowDown' });

    screen.debug(screen.getByTestId('owner-autocomplete'));

    fireEvent.keyDown(textbox, { key: 'Enter' });
    
    screen.debug(screen.getByTestId('owner-autocomplete'));

    await waitFor(() => {
      expect(within(screen.getByTestId('owner-autocomplete'))
                 .getByDisplayValue(TEST_USER_2.name)).toBeInTheDocument();
    });
  })

});