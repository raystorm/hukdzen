import react from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {when} from "jest-when";
import {API} from "aws-amplify";

import { User } from '../../../User/userType';
import { Clans, ClanEnum, printClanType } from "../../../Gyet/ClanType";
import {BoxRole, buildBoxRole, emptyBoxRole, printBoxRole} from "../../../BoxRole/BoxRoleType";
import {printRole, Role, RoleType} from '../../../Role/roleTypes';
import {emptyXbiis, Xbiis} from '../../../Box/boxTypes';
import AuthorForm from '../AuthorForm'
import { 
         contains, startsWith,
         loadTestStore, renderWithProviders, renderWithState,  
       } from '../../../__utils__/testUtilities';
import {emptyBoxRoleList} from "../../../BoxRole/BoxRoleList/BoxRoleListType";
import {ModelXbiisConnection} from "../../../types/AmplifyTypes";
import {userActions} from "../../../User/userSlice";
import {
  BoxUserPrinter,
  setupAmplifyUserMocking,
  setUpdatedUser,
  setupUserMocking,
  UserPrinter
} from "../../../__utils__/__fixtures__/UserAPI.helper";
import {setupBoxListMocking, setupBoxMocking} from "../../../__utils__/__fixtures__/BoxAPI.helper";
import {boxUserListActions} from "../../../BoxUser/BoxUserList/BoxUserListSlice";
import {BoxUserList} from "../../../BoxUser/BoxUserList/BoxUserListType";
import {buildBoxUser, printBoxUser} from "../../../BoxUser/BoxUserType";
import * as queries from "../../../graphql/queries";
import UserForm from "../UserForm";



//TODO: test constants
const TEST_USER: User = {
  __typename: "User",
  id:       'GUID goes here',
  name:     'testy McTesterson',
  email:    'fake@example.com',
  clan:     Clans.Wolf,
  waa:      'Nabibuut Dan',
  isAdmin:  false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const TEST_BOXES: ModelXbiisConnection = {
  __typename: "ModelXbiisConnection",
  items:[
  {
    id: 'GUID_ID_1',  name: 'TEST Box Role',
    owner: {...TEST_USER}, xbiisOwnerId: TEST_USER.id,
    defaultRole: Role.Read,
    __typename: "Xbiis",
    createdAt: new Date().toISOString(),  updatedAt: new Date().toISOString(),
  },
  {
    id: 'GUID_ID_2',  name: 'Example',
    owner: {...TEST_USER}, xbiisOwnerId: TEST_USER.id,
    defaultRole: Role.Write,
    __typename: "Xbiis",
    createdAt: new Date().toISOString(),  updatedAt: new Date().toISOString(),
  }],
};

const TEST_BOXUSERS: BoxUserList = {
  __typename: "ModelBoxUserConnection",
  items: [
    buildBoxUser(TEST_USER, buildBoxRole(TEST_BOXES.items[0], Role.Read)),
    //buildBoxUser(TEST_USER, BoxRoleBuilder(TEST_BOXES.items[1], Role.Write)),
  ]
};

let TEST_STATE = {
  currentUser: { ...TEST_USER },
  boxList: TEST_BOXES,
  boxUserList: TEST_BOXUSERS,
};

userEvent.setup();

describe('UserForm', () => {

  beforeEach(() => {
    setupUserMocking();
    setupAmplifyUserMocking();

    setupBoxListMocking();
    //setupBoxMocking();
  });
  
  test('Renders correctly', async () =>
  { 
    const USER = TEST_USER;
    renderWithState(TEST_STATE, <UserForm user={USER}/>);

    const idField = screen.getByTestId('id');
    expect(idField).toBeInTheDocument();
    expect(idField).not.toBeVisible();
    expect(within(idField).getByDisplayValue(USER.id)).toBeInTheDocument();
    
    //regex for startsWith
    expect(screen.getByLabelText(startsWith('Name'))).toBeInTheDocument();
    expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(USER.name);
    
    expect(screen.getByLabelText(startsWith('E-Mail'))).toBeInTheDocument();
    expect(screen.getByLabelText(startsWith('E-Mail'))).toHaveValue(USER.email);
    
    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    expect(uClan).toHaveTextContent(`${printClanType(USER.clan)}`);

    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(USER.waa);
    
    const isAdmin = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdmin).toBeInTheDocument();
    expect(isAdmin.hasAttribute('checked')).toBe(USER.isAdmin);
    expect(isAdmin).not.toBeChecked();

    //admin w/ auto-complete, or user w/ list?
    const uBoxes = screen.getByText(startsWith('Boxes'));
    expect(uBoxes).toBeInTheDocument();
    //screen.debug(uBoxes.parentElement)
    const boxRole = TEST_BOXUSERS.items[0]!.boxRole;
    expect(screen.getByText(boxRole!.box!.name)).toBeInTheDocument();
    expect(screen.getByText(`${printRole(boxRole!.role)}`)).toBeInTheDocument();
  });

  test('Renders correctly for Admin User', async () =>
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
    expect(isAdmin.hasAttribute('checked')).toBe(USER.isAdmin);
    expect(isAdmin).toBeChecked();

    //admin w/ auto-complete, or user w/ list?
    const uBoxes = screen.getByLabelText(contains('Boxes'));
    expect(uBoxes).toBeInTheDocument();
    expect(screen.getByText(`${printBoxRole(TEST_BOXUSERS.items[0]!.boxRole)}`))
      .toBeInTheDocument();
  });

  test('Loads BoxUsers on Render, when missing from state',
       async () =>
  {
    const USER = TEST_USER;
    const state = {
      currentUser: { ...TEST_USER },
      boxList: TEST_BOXES,
    }

    const graphql = {
      query: queries.listBoxUsers,
      variables: { filter: { boxUserUserId: { eq: USER.id } } }
    };

    when(API.graphql).calledWith(graphql)
      .mockReturnValue(Promise.resolve({data:{listBoxUsers: TEST_BOXUSERS }}));

    const {store} = renderWithState(state, <UserForm user={USER}/>);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(boxUserListActions.getAllBoxUsersForUser(USER));
    })
    await waitFor(() => {
      expect(API.graphql).toHaveBeenCalledWith(graphql);
    });
    expect(API.graphql).toHaveReturnedWith(Promise.resolve({data:{listBoxUsers: TEST_BOXUSERS }}))
    //expect(store.dispatch).toHaveReturnedWith(TEST_BOXUSERS);

    const idField = screen.getByTestId('id');
    expect(idField).toBeInTheDocument();
    expect(idField).not.toBeVisible();
    expect(within(idField).getByDisplayValue(USER.id)).toBeInTheDocument();

    //regex for startsWith
    expect(screen.getByLabelText(startsWith('Name'))).toBeInTheDocument();
    expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(USER.name);

    expect(screen.getByLabelText(startsWith('E-Mail'))).toBeInTheDocument();
    expect(screen.getByLabelText(startsWith('E-Mail'))).toHaveValue(USER.email);

    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    expect(uClan).toHaveTextContent(`${printClanType(USER.clan)}`);

    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(USER.waa);

    const isAdmin = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdmin).toBeInTheDocument();
    expect(isAdmin.hasAttribute('checked')).toBe(USER.isAdmin);
    expect(isAdmin).not.toBeChecked();

    //admin w/ auto-complete, or user w/ list?
    const uBoxes = screen.getByText(startsWith('Boxes'));
    expect(uBoxes).toBeInTheDocument();
    //screen.debug(uBoxes.parentElement!)
    const boxRole = TEST_BOXUSERS.items[0]!.boxRole;
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      expect(within(uBoxes.parentElement!).getByText(boxRole!.box!.name)).toBeInTheDocument();
      //expect(screen.getByText(boxRole!.box!.name)).toBeInTheDocument();
    });
    expect(screen.getByText(`${printRole(boxRole!.role)}`)).toBeInTheDocument();
  });

  test('E-mail validation works', async () =>
  {
    const USER  = { ...TEST_USER };
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

  test('able to set Name', async () =>
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

  test('able to set Waa', async () =>
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

  test('able to change selected Clan', async () =>
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
    const validateClan = async (clan: ClanEnum) =>
    {
      const changeClan = `${printClanType(clan)}`;
      const clanField = screen.getByTestId('clan');
      const clanButton = within(clanField).getByRole('button');
      await userEvent.click(clanButton);

      await waitFor(() => 
      { expect(screen.getByText(contains(clan.name))).toBeInTheDocument(); });

      await userEvent.click(screen.getByText(contains(clan.name)));

      await waitFor(() => 
      { expect(screen.getByLabelText('Clan')).toHaveTextContent(changeClan); });
    }

    //verify selectability of all 4 clans
    await validateClan(Clans.Killerwhale);
    await validateClan(Clans.Wolf);
    await validateClan(Clans.Raven);
    await validateClan(Clans.Eagle);
  });

  test('able to Check/Uncheck isAdmin', async () =>
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

  test('able to Select BoxRoles when user is an Admin', async () =>
  {
    const USER = { ...TEST_USER,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };

    renderWithState(STATE, <UserForm user={USER}/>);

    const getBoxField = (() => {
      return screen.getByTestId('boxes-autocomplete');
    } );

    const boxField = getBoxField();

    const textbox = within(getBoxField()).getByRole('combobox');

    //TODO: figure out how to do this buy mouse click and text selection
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //open the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //into the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //skip to expected entry
    fireEvent.keyDown(textbox, { key: 'ArrowDown' });
    fireEvent.keyDown(textbox, { key: 'Enter' });

    //isAdmin + RO/RW for TEST_BOXES = 5
    expect(screen.getAllByRole('checkbox').length).toEqual(5);
        
    const br: BoxRole = TEST_BOXUSERS.items[0]!.boxRole;
    const brStr = printBoxRole(br);

    await waitFor(() => {
      expect(within(boxField).getByText(contains(brStr))).toBeInTheDocument();
    })

  });
 
  //TODO: Save (valid and error states),

  test('Save Button only updates user on Valid form', async () => {
    const USER    = {...TEST_USER};
    const STATE = {...TEST_STATE};
    const {store} =
      renderWithState(STATE, <><UserForm user={USER}/><UserPrinter/></>);

    expect(screen.getByText('Save')).toBeInTheDocument();

    //change a value, so we have something to look for.
    const changedValue = 'A Different Value';
    const updateUser = {...USER, name: changedValue};
    setUpdatedUser(updateUser);

    const nameField = screen.getByLabelText(startsWith('Name'));
    await userEvent.clear(nameField);
    await userEvent.type(nameField, changedValue);

    //verify changed value
    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Name')))
         .toHaveValue(changedValue);
    });

    //trigger save action
    await userEvent.click(screen.getByText('Save'));

    //verify last dispatch was to update the name
    await waitFor(() => {
      expect(store.dispatch)
        .toHaveBeenCalledWith(userActions.updateUser(expect.objectContaining({name: changedValue})));
    });

    //screen.debug(screen.getByTestId('user-info-dumps'));
    const users = screen.getAllByText(/"__typename": "User",/);

    /* field level validation * /
    const updatedUser = JSON.parse(`${users[0].textContent}`);
    const currentUser = JSON.parse(`${users[1].textContent}`);
    expect(updatedUser.name).toBe(changedValue);
    expect(updatedUser.id).toBe(currentUser.id);
    expect(currentUser.name).toBe(changedValue);
    // */

    expect(users[0].textContent).toEqual(users[1].textContent);

    /* validate the state changes propagate as expected * /
    expect(store.getState().user.name).toEqual(changedValue);
    expect(store.getState().user.id).toEqual(store.getState().currentUser.id);
    expect(store.getState().user.name).toEqual(store.getState().currentUser.name);
    expect(store.getState().currentUser.name).toEqual(changedValue);
    // */
  });


  test('Save Button updates user & BoxUser when BoxRole Changes', async () => {
    const USER  = { ...TEST_USER, isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    const {store} =
       renderWithState(STATE,
          <><UserForm user={USER}/><UserPrinter/><BoxUserPrinter/></>
       );

    expect(screen.getByText('Save')).toBeInTheDocument();

    //change a value, so we have something to look for.
    const changedValue = 'A Different Value';
    const updateUser = {...USER, name: changedValue};
    setUpdatedUser(updateUser);

    const nameField = screen.getByLabelText(startsWith('Name'));
    await userEvent.clear(nameField);
    await userEvent.type(nameField, changedValue);

    //verify changed value
    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Name')))
         .toHaveValue(changedValue);
    });

    //change BoxRole
    const getboxField = (() => {
      return screen.getByTestId('boxes-autocomplete');
    } );

    const boxField = getboxField();

    const textBox = within(getboxField()).getByRole('combobox');

    //TODO: figure out how to do this buy mouse click and text selection
    fireEvent.keyDown(textBox, { key: 'ArrowDown' }); //open the menu
    fireEvent.keyDown(textBox, { key: 'ArrowDown' }); //into the menu
    fireEvent.keyDown(textBox, { key: 'ArrowDown' }); //skip to expected entry
    fireEvent.keyDown(textBox, { key: 'ArrowDown' });
    fireEvent.keyDown(textBox, { key: 'ArrowDown' });
    fireEvent.keyDown(textBox, { key: 'Enter' });

    //screen.debug(screen.getByRole('presentation'));

    //verify new entry
    const br: BoxRole = buildBoxRole(TEST_BOXES.items[1], Role.Read);
    //TEST_BOXUSERS.items[1]!.boxRole;
    const brStr = printBoxRole(br);
    const buStr = printBoxUser(buildBoxUser(updateUser, br));

    await waitFor(() => {
      expect(within(boxField).getByText(contains(brStr))).toBeInTheDocument();
    });

    //expect state not to have changed yet.
    expect(screen.getByTestId('boxUserList-dump'))
      .not.toHaveTextContent(contains(buStr));

    //trigger save action
    await userEvent.click(screen.getByText('Save'));

    //verify last dispatch was to update the name
    await waitFor(() => {
      expect(store.dispatch)
         .toHaveBeenCalledWith(userActions.updateUser(expect.objectContaining({name: changedValue})));
    });

    //verify after, the next dispatch was to update Box Users.
    await waitFor(() => {
      expect(store.dispatch)
         .toHaveBeenCalledWith(boxUserListActions.updateAllBoxUsersForUser(expect.anything()));
    });

    //screen.debug(screen.getByTestId('user-info-dumps'));
    const users = screen.getAllByText(/"__typename": "User",/);

    expect(users[0].textContent).toEqual(users[1].textContent);

    //validate BoxUserList Change
    expect(screen.getByTestId('boxUserList-dump')).toHaveTextContent(contains(buStr));
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
    // @ts-ignore
    const actionCount = store.dispatch.mock.calls.length;
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);

    //trigger save action
    await userEvent.click(screen.getByText("Save"));

    //verify action was never fired
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

});