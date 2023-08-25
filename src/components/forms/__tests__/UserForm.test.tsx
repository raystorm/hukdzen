import react from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {when} from "jest-when";
import {API} from "aws-amplify";

import { User } from '../../../User/userType';
import {Clans, printClanType, ClanType} from "../../../Gyet/ClanType";
import {printRole, Role } from '../../../Role/roleTypes';
import {
  contains, startsWith, renderPage,
} from '../../../__utils__/testUtilities';
import {ModelXbiisConnection} from "../../../types/AmplifyTypes";
import {userActions} from "../../../User/userSlice";
import {
  BoxUserPrinter,
  setupAmplifyUserMocking,
  setUpdatedUser,
  setupUserMocking,
  UserPrinter
} from "../../../__utils__/__fixtures__/UserAPI.helper";
import {setBoxList, setupBoxListMocking, setupBoxMocking} from "../../../__utils__/__fixtures__/BoxAPI.helper";
import {boxUserListActions} from "../../../BoxUser/BoxUserList/BoxUserListSlice";
import {BoxUserList} from "../../../BoxUser/BoxUserList/BoxUserListType";
import {BoxUser, buildBoxUser, printBoxRoleFromBoxUser, printBoxUser} from "../../../BoxUser/BoxUserType";
import * as queries from "../../../graphql/queries";
import UserForm from "../UserForm";
import {USER_PATH} from "../../shared/constants";
import {buildErrorAlert} from "../../../AlertBar/AlertBarTypes";
import {printGyet} from "../../../Gyet/GyetType";
import {setDocList, setupDocListMocking} from "../../../__utils__/__fixtures__/DocumentAPI.helper";
import {setupBoxUserListMocking, setupBoxUserMocking} from "../../../__utils__/__fixtures__/BoxUserAPI.helper";
import {emptyBoxList} from "../../../Box/BoxList/BoxListType";
import {emptyDocList} from "../../../docs/docList/documentListTypes";



//test constants
const TEST_USER: User = {
  __typename: "User",
  id:       'GUID goes here',
  name:     'testy McTesterson',
  email:    'fake@example.com',
  clan:     Clans.Wolf.value,
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
    buildBoxUser(TEST_USER, TEST_BOXES.items[0]!, Role.Read),
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
    setupBoxMocking();
  });
  
  test('Renders correctly', async () =>
  { 
    const USER = TEST_USER;
    renderPage(USER_PATH, <UserForm user={USER}/>, TEST_STATE);

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
    // eslint-disable-next-line testing-library/no-node-access
    expect(within(uClan.parentElement!).getByText(`${printClanType(USER.clan)}`))
      .toBeInTheDocument()

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
    const boxUser = TEST_BOXUSERS.items[0]!;
    expect(screen.getByText(boxUser!.box!.name)).toBeInTheDocument();
    expect(screen.getByText(`${printRole(boxUser!.role)}`)).toBeInTheDocument();
  });

  test('Renders correctly for Admin User', async () =>
  { 
    const USER  = { ...TEST_USER,  isAdmin: true };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    renderPage(USER_PATH, <UserForm user={USER}/>, STATE);

    expect(screen.getByTestId('id')).toBeInTheDocument();
    expect(screen.getByTestId('id')).not.toBeVisible();
    
    //regex for startsWith
    expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveValue(USER.name);

    expect(screen.getByLabelText(/^E-Mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^E-Mail/)).toHaveValue(USER.email);

    const uClan = screen.getByLabelText('Clan');
    expect(uClan).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(within(uClan.parentElement!).getByText(`${printClanType(USER.clan)}`))
       .toBeInTheDocument()

    expect(screen.getByLabelText('Waa')).toBeInTheDocument();
    expect(screen.getByLabelText('Waa')).toHaveValue(USER.waa);

    const isAdmin = screen.getByLabelText('Miyaan (Admin)');
    expect(isAdmin).toBeInTheDocument();
    expect(isAdmin.hasAttribute('checked')).toBe(USER.isAdmin);
    expect(isAdmin).toBeChecked();

    //admin w/ auto-complete, or user w/ list?
    const uBoxes = screen.getByLabelText(contains('Boxes'));
    expect(uBoxes).toBeInTheDocument();
    expect(screen.getByText(`${printBoxRoleFromBoxUser(TEST_BOXUSERS.items[0]!)}`))
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

    const {store} = renderPage(USER_PATH, <UserForm user={USER}/>, state);

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
    // eslint-disable-next-line testing-library/no-node-access
    expect(within(uClan.parentElement!).getByText(`${printClanType(TEST_USER.clan)}`))
       .toBeInTheDocument()

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
    const boxUser = TEST_BOXUSERS.items[0]!;
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      expect(within(uBoxes.parentElement!).getByText(boxUser!.box!.name)).toBeInTheDocument();
      //expect(screen.getByText(boxUser!.box!.name)).toBeInTheDocument();
    });
    expect(screen.getByText(`${printRole(boxUser!.role)}`)).toBeInTheDocument();
  });

  test('E-mail validation works', async () =>
  {
    const USER  = { ...TEST_USER };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    renderPage(USER_PATH, <UserForm user={USER}/>, STATE);

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
    renderPage(USER_PATH, <UserForm user={USER}/>, STATE);

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
    renderPage(USER_PATH, <UserForm user={USER}/>, STATE);

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
    renderPage(USER_PATH, <UserForm user={USER}/>, STATE);

    const uClan = screen.getByTestId('clan');
    expect(uClan).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(within(uClan.parentElement!).getByText(`${printClanType(TEST_USER.clan)}`))
      .toBeInTheDocument()

    /**
     * Helper function to select and verify clan selection
     * @param clan 
     */
    const validateClan = async (clan: ClanType) =>
    {
      const changeClan = `${printClanType(clan)}`;
      const clanField = screen.getByTestId('clan');
      const clanButton = within(clanField).getByRole('button');
      await userEvent.click(clanButton);

      await waitFor(() => 
      { expect(screen.getByText(contains(changeClan))).toBeInTheDocument(); });

      await userEvent.click(screen.getByText(contains(changeClan)));

      await waitFor(() => 
      { // eslint-disable-next-line testing-library/no-node-access
        expect(within(screen.getByTestId('clan').parentElement!)
                 .getByText(changeClan)).toBeInTheDocument();
      });
    }

    //verify selectability of all 4 clans
    await validateClan(Clans.Orca);
    await validateClan(Clans.Wolf);
    await validateClan(Clans.Raven);
    await validateClan(Clans.Eagle);
  });

  test('able to Check/Uncheck isAdmin', async () =>
  {
    const USER  = { ...TEST_USER,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    renderPage(USER_PATH, <UserForm user={USER}/>, STATE);

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

    renderPage(USER_PATH, <UserForm user={USER}/>, STATE);

    const getBoxField = (() => {
      return screen.getByTestId('boxes-autocomplete');
    } );

    const boxField = getBoxField();

    const textbox = within(getBoxField()).getByRole('combobox');

    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //open the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //into the menu
    fireEvent.keyDown(textbox, { key: 'ArrowDown' }); //skip to expected entry
    fireEvent.keyDown(textbox, { key: 'ArrowDown' });
    fireEvent.keyDown(textbox, { key: 'Enter' });

    //isAdmin + RO/RW for TEST_BOXES = 5
    expect(screen.getAllByRole('checkbox').length).toEqual(5);
        
    const bu: BoxUser = TEST_BOXUSERS.items[0]!;
    const brStr = printBoxRoleFromBoxUser(bu);

    await waitFor(() => {
      expect(within(boxField).getByText(contains(brStr))).toBeInTheDocument();
    })

  });
 
  test('Save Button only updates user on Valid form', async () => {
    const USER    = {...TEST_USER};
    const STATE = {...TEST_STATE};
    const {store} =
      renderPage(USER_PATH, <><UserForm user={USER}/><UserPrinter/></>, STATE);

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
       renderPage(USER_PATH,
                  <><UserForm user={USER}/><UserPrinter/><BoxUserPrinter/></>,
                  STATE);

    expect(screen.getByText('Save')).toBeInTheDocument();

    //change a value, so we have something to look for.
    const changedValue = 'A Different Value';
    const updateUser = {...USER, name: changedValue};
    setUpdatedUser(updateUser);
    setupUserMocking();

    const nameField = screen.getByLabelText(startsWith('Name'));
    await userEvent.clear(nameField);
    await userEvent.type(nameField, changedValue);

    //verify changed value
    await waitFor(() => {
      expect(screen.getByLabelText(startsWith('Name')))
         .toHaveValue(changedValue);
    });

    //change BoxRole
    const getBoxField = (() => {
      return screen.getByTestId('boxes-autocomplete');
    });

    const boxField = getBoxField();

    const textBox = within(getBoxField()).getByRole('combobox');

    fireEvent.keyDown(textBox, { key: 'ArrowDown' }); //open the menu
    fireEvent.keyDown(textBox, { key: 'ArrowDown' }); //into the menu
    fireEvent.keyDown(textBox, { key: 'ArrowDown' }); //skip to expected entry
    //fireEvent.keyDown(textBox, { key: 'ArrowDown' });
    //fireEvent.keyDown(textBox, { key: 'ArrowDown' });
    fireEvent.keyDown(textBox, { key: 'Enter' });

    //screen.debug(screen.getByRole('presentation'));

    //verify new entry
    const bu: BoxUser = buildBoxUser(updateUser, TEST_BOXES.items[1]!, Role.Read);
    //TEST_BOXUSERS.items[1]!.boxRole;
    const brStr = printBoxRoleFromBoxUser(bu);
    const buStr = printBoxUser(bu);

    console.log(`checking for: ${brStr}`);
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

    //broken because name isn't changing (Mock BoxUserAPI ?)
    //validate BoxUserList Change
    //expect(screen.getByTestId('boxUserList-dump'))
    //  .toHaveTextContent(contains(buStr));
    //TEST box Role only
    expect(screen.getByTestId('boxUserList-dump'))
      .toHaveTextContent(contains(brStr));
  });

  test("Save Button does not dispatch any actions when the form is inValid",
       async () =>
  {
    const USER  = { ...TEST_USER };
    const STATE = { ...TEST_STATE };

    const { store } = renderPage(USER_PATH, <UserForm user={USER} />, STATE);

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

  test('Delete Button errors when the user owns boxes', async () => {
    const USER    = {...TEST_USER};
    const STATE = {...TEST_STATE};
    const {store} =
       renderPage(USER_PATH, <UserForm user={USER} isAdminForm/>, STATE);

    expect(screen.getByText('DELETE')).toBeInTheDocument();

    //trigger save action
    await userEvent.click(screen.getByText('DELETE'));

    //verify last dispatch was to remove the user
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(userActions.removeUser(USER));
    });
    await waitFor(() => {
      const msg = buildErrorAlert(`Unable To Delete: ${printGyet(USER)}, since they own boxes.`);
      //expect(store.dispatch).toHaveBeenCalledWith(alertBarActions.DisplayAlertBox(msg));
      expect(store.getState().alertMessage.message).toBe(msg.message);
    });
  });

  test('Delete Button does not delete when the user owns items', async () => {
    const USER    = {...TEST_USER};
    const STATE = {...TEST_STATE};
    const {store} =
       renderPage(USER_PATH, <UserForm user={USER} isAdminForm/>, STATE);

    expect(screen.getByText('DELETE')).toBeInTheDocument();

    //clear boxes
    setBoxList(emptyBoxList);
    setupBoxListMocking();
    setupDocListMocking();

    //trigger save action
    await userEvent.click(screen.getByText('DELETE'));

    //verify last dispatch was to remove the user
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(userActions.removeUser(USER));
    });
    await waitFor(() => {
      const msg = buildErrorAlert(`Unable To Delete: ${printGyet(USER)}, since they own Items.`);
      //expect(store.dispatch).toHaveBeenCalledWith(alertBarActions.DisplayAlertBox(msg));
      expect(store.getState().alertMessage.message).toBe(msg.message);
    });
  });

  test('Delete Button removes the user', async () =>
  {
    const USER    = {...TEST_USER};
    const STATE = {...TEST_STATE};
    const {store} =
       renderPage(USER_PATH, <UserForm user={USER} isAdminForm/>, STATE);

    expect(screen.getByText('DELETE')).toBeInTheDocument();

    //clear boxes
    setBoxList(emptyBoxList);
    setupBoxListMocking();
    setDocList(emptyDocList);
    setupDocListMocking();
    setupBoxUserListMocking();
    setupBoxUserMocking();

    //trigger save action
    await userEvent.click(screen.getByText('DELETE'));

    //verify last dispatch was to remove the user
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(userActions.removeUser(USER));
    });
    await waitFor(() => {
      const msg = buildErrorAlert(`Successfully removed user: ${printGyet(USER)}`);
      //expect(store.dispatch).toHaveBeenCalledWith(alertBarActions.DisplayAlertBox(msg));
      expect(store.getState().alertMessage.message).toBe(msg.message);
    });
  });

});