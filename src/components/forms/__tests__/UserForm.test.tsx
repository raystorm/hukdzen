import react from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Gyet } from '../../../User/userType';
import { Clan, ClanType, printClanType } from "../../../User/ClanType";
import { BoxRole, emptyBoxRole, printBoxRole } from "../../../User/BoxRoleType";
import { Role } from '../../../Role/roleTypes';
import { Xbiis } from '../../../Box/boxTypes';
import { BoxList } from '../../../Box/BoxList/BoxListType';
import UserForm from '../UserForm'
import { 
         contains, startsWith,
         loadTestStore, renderWithProviders, renderWithState,  
       } from '../../../utilities/testUtilities';

import { userActions } from '../../../User/userSlice';



//TODO: test constants
let TEST_USER: Gyet = {
  id:       'GUID goes here',
  name:     'testy McTesterson',
  email:    'fake@example.com',
  clan:     Clan.Wolf,
  waa:      'Nabibuut Dan',
  isAdmin:  false,
  boxRoles: []
  //boxRoles: [{box: TEST_STATE.boxList.boxes[0], role: Role.ReadOnly }]
};

const TEST_BOXES = [
  {
    id: 'GUID_ID_1',  name: 'TEST',
    owner: {...TEST_USER}, defaultRole: Role.ReadOnly,
  },
  {
    id: 'GUID_ID_2',  name: 'Example',
    owner: {...TEST_USER}, defaultRole: Role.Write,
  }
] as Xbiis[];

//Fix for Circular Dependency between Boxes and User.
TEST_USER.boxRoles = [
  { 
    box: { ...TEST_BOXES[0] },
    role: Role.ReadOnly 
  }
];

let TEST_STATE = {
  currentUser: { ...TEST_USER },
  boxList: { boxes: TEST_BOXES } as BoxList
};

const user = userEvent.setup();

describe('UserForm', () => { 
  
  test('UserForm renders correctly', async () => 
  { 
    const USER = TEST_USER;
    console.log(JSON.stringify(USER));
    
    renderWithState(TEST_STATE, <UserForm user={USER}/>);

    const idField = screen.getByTestId('id');
    expect(idField).toBeInTheDocument();
    expect(idField).not.toBeVisible();
    expect(within(idField).getByDisplayValue(USER.id)).toBeInTheDocument();
    
    //regex for startsWith
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveValue(USER.name);
    
    expect(screen.getByLabelText(/^E-Mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^E-Mail/)).toHaveValue(USER.email);
    
    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    expect(uClan).toHaveTextContent(`${printClanType(USER.clan)}`);
    

    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(USER.waa);
    
    const isAdmin = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdmin).toBeInTheDocument();
    
    //NOTE: there should be a cleaner syntax for this
    //if ( TEST_USER.isAdmin ) { expect(isAdmin).toBeChecked(); }
    //else { expect(isAdmin).not.toBeChecked(); }
    //checked only appears when TRUE, but doesn't look as clean as the if/Else
    expect(isAdmin.hasAttribute('checked')).toBe(USER.isAdmin);

    //admin w/ auto-complete, or user w/ list?
    const uBoxes = screen.getByText(startsWith('Boxes'));
    expect(uBoxes).toBeInTheDocument();
    const boxRole = TEST_USER.boxRoles[0]
    expect(screen.getByText(boxRole.box.name)).toBeInTheDocument();
    expect(screen.getByText(boxRole.role.name)).toBeInTheDocument();
  });

  test('UserForm renders correctly for Admin User', async () => 
  { 
    const USER  = { ...TEST_USER,  isAdmin: true };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    
    renderWithState(STATE, <UserForm user={USER}/>);

    expect(screen.getByTestId('id')).toBeInTheDocument();
    expect(screen.getByTestId('id')).not.toBeVisible();
    
    //regex for startsWith
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveValue(USER.name);
    
    expect(screen.getByLabelText(/^E-Mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^E-Mail/)).toHaveValue(USER.email);
    
    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    expect(uClan).toHaveTextContent(`${printClanType(USER.clan)}`);
    
    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(USER.waa);
    
    const isAdmin = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdmin).toBeInTheDocument();
    
    //NOTE: there should be a cleaner syntax for this
    //if ( TEST_USER.isAdmin ) { expect(isAdmin).toBeChecked(); }
    //else { expect(isAdmin).not.toBeChecked(); }
    //checked only appears when TRUE, but doesn't look as clean as the if/Else
    expect(isAdmin.hasAttribute('checked')).toBe(USER.isAdmin);
    expect(isAdmin).toBeChecked();

    //admin w/ auto-complete, or user w/ list?
    const uBoxes = screen.getByLabelText(contains('Boxes'));
    expect(uBoxes).toBeInTheDocument();
    expect(screen.getByText(`${printBoxRole(TEST_USER.boxRoles[0])}`))
      .toBeInTheDocument();
  });

  test('UserForm email validation works', async () => 
  {
    const USER  = { ...TEST_USER,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    
    renderWithState(STATE, <UserForm user={USER}/>);

    const getEmailField = () => 
    { return screen.getByLabelText(startsWith('E-Mail')); };

    const emailField = getEmailField();
    await userEvent.clear(emailField);
    await userEvent.type(emailField, 'not_a_valid_email');

    await waitFor(() => 
    { expect(screen.getByText(contains('Invalid'))).toBeInTheDocument(); });

    //test that, fixing it clears the error state
    const validEmail = 'new-valid-email@example.com';
    const emailFld = getEmailField();
    await userEvent.clear(emailFld);
    await userEvent.type(emailFld, validEmail);

    await waitFor(() => { expect(getEmailField()).toHaveValue(validEmail); });
    expect(screen.queryByText(contains('Invalid'))).not.toBeInTheDocument();
  });

  test('UserForm able to set Name', async () => 
  {
    const USER  = { ...TEST_USER,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    
    renderWithState(STATE, <UserForm user={USER}/>);

    const changedValue = 'A Different Value';

    const nameField = screen.getByLabelText(startsWith('Name'));
    await userEvent.clear(nameField);
    await userEvent.type(nameField, changedValue);

    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(changedValue);
    });
  });

  test('UserForm able to set Waa', async () => 
  {
    const USER  = { ...TEST_USER,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    
    renderWithState(STATE, <UserForm user={USER}/>);

    const changedValue = 'A Different Value';

    const waaField = screen.getByLabelText(startsWith('Waa'));
    await userEvent.clear(waaField);    
    await userEvent.type(waaField, changedValue);

    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Waa'))).toHaveValue(changedValue);
    });
  });

  test('UserForm able to change selected Clan', async () => 
  {
    const USER  = { ...TEST_USER,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    
    renderWithState(STATE, <UserForm user={USER}/>);

    const uClan = screen.getByTestId('clan');
    expect(uClan).toBeInTheDocument();
    expect(uClan).toHaveTextContent(`${printClanType(USER.clan)}`);

    /**
     * Helper function to select and verify clan selection
     * @param clan 
     */
    const validateClan = async (clan: ClanType) =>
    {
      const changeClan = `${printClanType(clan)}`;
      //await userEvent.click(screen.getByLabelText('Clan'));
      //await userEvent.pointer({target: uClan, offset: 5, keys: '[MouseLeft]'});
      const clanField = screen.getByTestId('clan');
      const clanButton = within(clanField).getByRole('button');
      await userEvent.click(clanButton);

      //expect(within(uClan).getByRole('button'))
      //  .toHaveAccessibleName(`Clan ${changeClan}`)

      await waitFor(() => 
      { expect(screen.getByText(contains(clan.name))).toBeInTheDocument(); });

      await userEvent.click(screen.getByText(contains(clan.name)));

      await waitFor(() => 
      { expect(screen.getByLabelText('Clan')).toHaveTextContent(changeClan); });
    }

    //verify selectability of all 4 clans

    await validateClan(Clan.Killerwhale);
    await validateClan(Clan.Wolf);
    await validateClan(Clan.Raven);
    await validateClan(Clan.Eagle);
  });

  test('UserForm able to Check/Uncheck isAdmin', async () => 
  {
    const USER  = { ...TEST_USER,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    
    renderWithState(STATE, <UserForm user={USER}/>);

    const isAdmin = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdmin).toBeInTheDocument();
    expect(isAdmin).toBeChecked();

    await userEvent.click(isAdmin);
    await waitFor(() => 
    { expect(screen.queryByLabelText('Miyaan (Admin)')).not.toBeChecked(); });
    
    const isAdminUnChecked = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdminUnChecked).toBeInTheDocument();
    expect(isAdminUnChecked).not.toBeChecked();

    await userEvent.click(isAdminUnChecked);
    await waitFor(() => 
    { expect(screen.queryByLabelText('Miyaan (Admin)')).toBeChecked(); });

    const isAdminChecked = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdminChecked).toBeInTheDocument();
    expect(isAdminChecked).toBeChecked();
  });

  test('UserForm able to Select BoxRoles when user is an Admin', async () => 
  {
    const USER  = { ...TEST_USER,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };

    renderWithState(STATE, <UserForm user={USER}/>);

    const getboxField = (() => { 
      return screen.getByTestId('boxes-autocomplete'); 
    } );

    const boxField = getboxField();

    const textbox = within(getboxField()).getByRole('combobox');

    //TODO: figure out how to do this buy mouse click and text selection

    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //open the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //into the the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //skip to expected entry
    fireEvent.keyDown(textbox, { key: 'ArrowDown' });
    fireEvent.keyDown(textbox, { key: 'Enter' });

    //isAdmin + RO/RW for TEST_BOXES = 5
    expect(screen.getAllByRole('checkbox').length).toEqual(5);
        
    const br: BoxRole = { box: TEST_BOXES[1], role: Role.Write };
    const brStr = printBoxRole(br);

    await waitFor(() => {
      expect(within(boxField).getByText(contains(brStr))).toBeInTheDocument();
    })

  });
 
  //TODO: Save (valid and error states),

  test('Save Button dispatches the appropriate action when the form is valid', async () => 
  { 
    const USER  = { ...TEST_USER  };
    const STATE = { ...TEST_STATE };

    const { store } = renderWithState(STATE, <UserForm user={USER}/>);

    expect(screen.getByText('Save')).toBeInTheDocument();
    //expect(screen.getByText('button')).toHaveTextContent('Save');

    //change a value so we have something to look for.
    const changedValue = 'A Different Value';

    const nameField = screen.getByLabelText(startsWith('Name'));
    await userEvent.clear(nameField);
    await userEvent.type(nameField, changedValue);

    //verify changed value
    await waitFor(() => 
    {
      expect(screen.getByLabelText(startsWith('Name')))
        .toHaveValue(changedValue);
    });

    //trigger save action
    await userEvent.click(screen.getByText('Save'));

    //verify name changed on last function call
    expect(store.dispatch.mock.calls[store.dispatch.mock.calls.length -1][0])
      .toHaveProperty('payload.name', changedValue);
  });

  test("Save Button doesnt dispatch any actions when the form is inValid", async () => 
  {
    const USER  = { ...TEST_USER };
    const STATE = { ...TEST_STATE };

    const { store } = renderWithState(STATE, <UserForm user={USER} />);

    expect(screen.getByText("Save")).toBeInTheDocument();
    //expect(screen.getByText('button')).toHaveTextContent('Save');

    const getEmailField = () => 
    { return screen.getByLabelText(startsWith("E-Mail")); };

    const emailField = getEmailField();
    await userEvent.clear(emailField);
    await userEvent.type(emailField, "not_a_valid_email");

    await waitFor(() => 
    { expect(screen.getByText(contains("Invalid"))).toBeInTheDocument(); });
    expect(getEmailField()).toHaveValue("not_a_valid_email");

    //verify how many actions were dispatched before clicking "Save"
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

    //trigger save action
    await userEvent.click(screen.getByText("Save"));

    //verify action was never fired
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

});