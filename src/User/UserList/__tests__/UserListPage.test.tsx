import react from 'react';
import { screen, waitFor } from '@testing-library/react'
import userEvnt from '@testing-library/user-event';
import { generateClient } from '@aws-amplify/api'
import { when } from 'vitest-when';

import boxList from '../../../__utils__/__fixtures__/boxList.json';

import {ctrlClick, renderPage, startsWith} from '../../../__utils__/testUtilities';
import { getCell } from '../../../__utils__/dataGridHelperFunctions';
import {ADMIN_USERLIST_PATH} from "../../../components/shared/constants";
import {emptyUser, User} from '../../userType';
import { userActions } from '../../userSlice';
import UserListPage from '../UserListPage';
import {setupUserMocking} from "../../../__utils__/__setup__/UserAPI.helper";
import {setupBoxUserListMocking} from "../../../__utils__/__setup__/BoxUserAPI.helper";
import {setupCommonEnv} from "vitest/dist/browser";
import {setupBoxListMocking} from "../../../__utils__/__setup__/BoxAPI.helper";


const TEST_USER: User = {
  ...emptyUser,
  id: 'TEST_UL_U_GUID',
  name: 'Test user',
  email: 'DoNotEmail@Example.com'
};

const TEST_USER_2: User = {
  ...emptyUser,
  id: 'TEST_UL_U_GUID_2',
  name: 'Test user 2',
  email: 'DoNotEmail2@Example.com'
};

const TEST_STATE = {
  user: TEST_USER,
  userList: {
    __typename: "ModelGyetConnection",
    items: [TEST_USER, TEST_USER_2]
  },
  boxList: boxList,
  //TODO: build boxUserList
};

const userEvent = userEvnt.setup();

const client = generateClient();

describe('UserList Page Tests', () => {

   beforeEach(() => {
    setupBoxUserListMocking();
    setupBoxListMocking();
  });

  test('Renders Correctly with userList', () => {
    renderPage(ADMIN_USERLIST_PATH, <UserListPage />, TEST_STATE);

    expect(screen.getByText('User Accounts')).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_USER.name);

    expect(getCell(0,0)).toHaveTextContent(TEST_USER.name);
  });

  test('Renders Correctly without userList', () => {
    const state = { user: TEST_USER };
    renderPage(ADMIN_USERLIST_PATH, <UserListPage />, state);

    expect(screen.getByText('User Accounts')).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_USER.name);

    //test for default no results message
    expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  test('Clicking on Data Grid dispatches the correct action',
       async () =>
  {
    const { store } =
       renderPage(ADMIN_USERLIST_PATH, <UserListPage />, TEST_STATE);

    expect(screen.getByText('User Accounts')).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_USER.name);
      
    const nameCell2 = getCell(1,0); 

    expect(getCell(0,0)).toHaveTextContent(TEST_USER.name);
    expect(nameCell2).toHaveTextContent(TEST_USER_2.name);

    await userEvent.click(nameCell2);

    await waitFor(() => { 
      const action = userActions.getUserById(TEST_USER_2.id);
      expect(store.dispatch).toBeCalledWith(action);
    });

    /* [CTRL] click the sell to deselect */
    await ctrlClick(nameCell2);

    console.log('CTRL clicked on "nameCell2"');

    await waitFor(() => { 
      const action = userActions.clearUser();
      expect(store.dispatch).toBeCalledWith(action);
    });

  });

});