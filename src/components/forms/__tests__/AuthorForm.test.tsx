import react from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {when} from "jest-when";
import {API} from "aws-amplify";

import { User } from '../../../User/userType';
import { Clan, ClanType, printClanType } from "../../../Gyet/ClanType";
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
import {Author} from "../../../Author/AuthorType";
import {authorActions} from "../../../Author/authorSlice";
import {
  AuthorPrinter,
  setupAuthorListMocking,
  setupAuthorMocking
} from "../../../__utils__/__fixtures__/AuthorAPI.helper";


//TODO: test constants
const TEST_AUTHOR: Author = {
  __typename: "Author",
  id:       'GUID goes here',
  name:     'testy McTesterson',
  email:    'fake@example.com',
  clan:     Clan.Wolf,
  waa:      'Nabibuut Dan',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let TEST_STATE = {
  author: { ...TEST_AUTHOR },
};

userEvent.setup();

describe('UserForm', () => {

  beforeEach(() => {
    //setupUserMocking();
    //setupAmplifyUserMocking();

    //setupBoxListMocking();
    //setupBoxMocking();

    setupAuthorMocking();
    setupAuthorListMocking();
  });
  
  test('Renders correctly', async () =>
  { 
    const USER = TEST_AUTHOR;
    renderWithState(TEST_STATE, <AuthorForm author={USER}/>);

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
    
  });

  test('E-mail validation works', async () =>
  {
    const USER  = { ...TEST_AUTHOR };
    const STATE = { ...TEST_STATE };
    renderWithState(STATE, <AuthorForm author={USER}/>);

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
    const USER  = { ...TEST_AUTHOR };
    const STATE = { ...TEST_STATE };
    renderWithState(STATE, <AuthorForm author={USER}/>);

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
    const USER  = { ...TEST_AUTHOR,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    renderWithState(STATE, <AuthorForm author={USER}/>);

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
    const USER  = { ...TEST_AUTHOR,  isAdmin: true, };
    const STATE = { ...TEST_STATE, currentUser: { ...USER } };
    renderWithState(STATE, <AuthorForm author={USER}/>);

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
    await validateClan(Clan.Killerwhale);
    await validateClan(Clan.Wolf);
    await validateClan(Clan.Raven);
    await validateClan(Clan.Eagle);
  });
 
  //TODO: Save (valid and error states),

  test('Update Button only processes on Valid form', async () => {
    const USER    = {...TEST_AUTHOR};
    const STATE = {...TEST_STATE};
    const {store} =
      renderWithState(STATE, <><AuthorForm author={USER}/><AuthorPrinter/></>);

    expect(screen.getByText('Update')).toBeInTheDocument();

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
    await userEvent.click(screen.getByText('Update'));

    //verify last dispatch was to update the name
    await waitFor(() => {
      expect(store.dispatch)
        .toHaveBeenCalledWith(authorActions.updateAuthor(expect.objectContaining({name: changedValue})));
    });

    //screen.debug(screen.getByTestId('user-info-dumps'));
    const authors = screen.getAllByText(/"__typename": "Author",/);

    /* field level validation * /
    const updatedUser = JSON.parse(`${authors[0].textContent}`);
    const currentUser = JSON.parse(`${authors[1].textContent}`);
    expect(updatedUser.name).toBe(changedValue);
    expect(updatedUser.id).toBe(currentUser.id);
    expect(currentUser.name).toBe(changedValue);
    // */

    expect(authors[0].textContent).toContain(changedValue);

    /* validate the state changes propagate as expected * /
    expect(store.getState().user.name).toEqual(changedValue);
    expect(store.getState().user.id).toEqual(store.getState().currentUser.id);
    expect(store.getState().user.name).toEqual(store.getState().currentUser.name);
    expect(store.getState().currentUser.name).toEqual(changedValue);
    // */
  });

  test("Update Button doesnt dispatch any actions when the form is inValid", async () =>
  {
    const USER  = { ...TEST_AUTHOR };
    const STATE = { ...TEST_STATE };

    const { store } = renderWithState(STATE, <AuthorForm author={USER} />);

    expect(screen.getByText("Update")).toBeInTheDocument();
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
    await userEvent.click(screen.getByText("Update"));

    //verify action was never fired
    expect(store.dispatch).toHaveBeenCalledTimes(actionCount);
  });

});