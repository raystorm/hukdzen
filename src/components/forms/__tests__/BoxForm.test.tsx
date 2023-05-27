import react, {useEffect} from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { 
  contains, startsWith,
  loadTestStore, renderWithProviders, renderWithState,  
} from '../../../__utils__/testUtilities';
import { Gyet, printUser } from '../../../User/userType';
import {emptyXbiis, Xbiis} from '../../../Box/boxTypes';
import BoxForm from '../BoxForm';
import { DefaultRole, printRole, Role, RoleType } from '../../../Role/roleTypes';
import {emptyBoxRoleList} from "../../../BoxRole/BoxRoleList/BoxRoleListType";
import {defaultCreatedBox, setUpdatedBox} from "../../../__utils__/__fixtures__/BoxAPI.helper";
import {updateXbiis} from "../../../graphql/mutations";
import {boxActions} from "../../../Box/boxSlice";
import {userListActions} from "../../../User/UserList/userListSlice";


const TEST_USER: Gyet = {
  __typename: "Gyet",

  id: 'GUID-HERE',
  name: 'Test-User',
  email: 'nope@example.com',
  isAdmin: false,
  boxRoles: emptyBoxRoleList,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const TEST_USER_2: Gyet = {
  __typename: "Gyet",

  id: 'GUID2-HERE',
  name: 'Different Test User',
  email: 'akadi-gohl@example.com',
  isAdmin: false,
  boxRoles: emptyBoxRoleList,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const TEST_STATE = { userList: { items: [TEST_USER, TEST_USER_2] as Gyet[] } }

const TEST_BOX = {
  ...emptyXbiis,
  id: 'Box-GUID-HERE',
  name: 'TEST BOXY',
  owner: TEST_USER,
  xbiisOwnerId: TEST_USER.id,
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

    //buttons
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Edit Members')).toBeInTheDocument();
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
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //into the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //skip to expected entry
    fireEvent.keyDown(textbox, { key: 'ArrowDown' });

    screen.debug(screen.getByTestId('owner-autocomplete'));

    fireEvent.keyDown(textbox, { key: 'Enter' });
    
    screen.debug(screen.getByTestId('owner-autocomplete'));

    await waitFor(() => {
      expect(within(screen.getByTestId('owner-autocomplete'))
                 .getByDisplayValue(TEST_USER_2.name)).toBeInTheDocument();
    });
  });

  test('Can Select Role from DefaultRole', async () =>
  {
    const box = TEST_BOX;
    renderWithState(TEST_STATE, <BoxForm box={box} />);

    const roleField = screen.getByLabelText(startsWith('Default Role'));
    
    expect(roleField).toBeInTheDocument();
    expect(roleField).toHaveTextContent(`${printRole(box.defaultRole)}`);

     /**
     * Helper function to select and verify clan selection
     * @param clan 
     */
     const validateRole = async (role: RoleType) =>
     {
       const changeRole = `${printRole(role)}`;
       //await userEvent.click(screen.getByLabelText('Clan'));
       //await userEvent.pointer({target: uClan, offset: 5, keys: '[MouseLeft]'});
       const roleField = screen.getByTestId('defaultRole');
       const roleButton = within(roleField).getByRole('button');
       await userEvent.click(roleButton);
 
       //expect(within(uRole).getByRole('button'))
       //  .toHaveAccessibleName(`Role ${changeClan}`)
 
       await waitFor(() => 
       { expect(screen.getByText(contains(role))).toBeInTheDocument(); });
 
       await userEvent.click(screen.getByText(contains(role)));
 
       await waitFor(() => 
       { 
          expect(screen.getByLabelText('Default Role'))
            .toHaveTextContent(changeRole); 
       });
     };

     await validateRole(Role.Read);
     await validateRole(Role.Write);
  });

  test('Save Button dispatches Action', async () => 
  {
    const box = TEST_BOX;
    const { store } = renderWithState(TEST_STATE, <BoxForm box={box} />);

    const save = screen.getByText('Save');
    expect(save).toBeInTheDocument();

    //change something for the action
    const change = 'Changed Value';

    const nameField = screen.getByLabelText(startsWith('Name'));
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(box.name);

    await userEvent.clear(nameField);
    await userEvent.type(nameField, change);

    await waitFor(() => { expect(nameField).toHaveValue(change); });

    const updated = {...box, name: change};
    setUpdatedBox(updated);

    //verify current dispatch count
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    //click the button and dispatch the action
    await userEvent.click(save);

    //verify action was dispatched once
    await waitFor(() => {
      expect(store?.dispatch)
        .toHaveBeenCalledWith(boxActions.updateBox(expect.objectContaining({name: change})));
    }); //, { timeout: 2000 });

    // verify arguments
    await waitFor(() =>{
      expect(screen.getByLabelText(startsWith('Name')))
        .toHaveValue(change);
    });
  });

  test('Create Button dispatches Action', async () => 
  {
    const box = TEST_BOX;
    const { store } = renderWithState(TEST_STATE, <BoxForm box={box} />);

    const create = screen.getByText('Create');
    expect(create).toBeInTheDocument();

    //change something for the action
    const change = 'Changed Value';

    const nameField = screen.getByLabelText(startsWith('Name'));
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(box.name);

    await userEvent.clear(nameField);
    await userEvent.type(nameField, change);

    await waitFor(() => { expect(nameField).toHaveValue(change); });

    //verify current dispatch count
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    //click the button and dispatch the action
    await userEvent.click(create);

    //verify action was dispatched once
    await waitFor(() => {
      expect(store?.dispatch)
         .toHaveBeenCalledWith(boxActions.createBox(expect.objectContaining({name: change})));
    }); //, { timeout: 2000 });

    // verify arguments
    await waitFor(() =>{
      expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(change);
    });
  });

  //this is a link as a button, how should this be tested?
  test.skip('Edit Members Button loads the members page', async () => 
  {
    const box = TEST_BOX;
    const { store } = renderWithState(TEST_STATE, <BoxForm box={box} />);


    const edit = screen.getByText('Edit Members');
    expect(edit).toBeInTheDocument();

    //change something for the action
    const change = 'Changed Value';

    const nameField = screen.getByLabelText(startsWith('Name'));
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(box.name);

    await userEvent.clear(nameField);
    await userEvent.type(nameField, change);

    await waitFor(() => { expect(nameField).toHaveValue(change); });

    //verify current dispatch count
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
    
    //click the button and dispatch the action
    await userEvent.click(edit);

    //verify action was dispatched once
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledTimes(actionCount+1);
    }); //, { timeout: 2000 });

    //TODO: verify arguments
  });

});