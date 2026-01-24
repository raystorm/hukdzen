import react from 'react';
import { screen } from '@testing-library/react'

import {renderPage, startsWith} from '../../__utils__/testUtilities';

import {USER_PATH} from "../../components/shared/constants";
import {userFormTitle} from "../UserForm";
import {emptyUser, User} from '../userType';
import UserPage from '../UserPage';
import {setupBoxUserListMocking} from "../../__utils__/__fixtures__/BoxUserAPI.helper";
import {setupBoxListMocking} from "../../__utils__/__fixtures__/BoxAPI.helper";

describe('User Page Tests', () => {

   beforeEach(() => {
    setupBoxUserListMocking();
    setupBoxListMocking();
  });

  test('Renders Correctly for no user', () => {

    renderPage(USER_PATH, <UserPage path={USER_PATH} />);

    expect(screen.getByText(userFormTitle)).toBeInTheDocument();

    expect(screen.getByLabelText(startsWith('Name'))).not.toHaveValue();
  });

  test('Renders Correctly for user', () => {
    const TEST_USER: User = {
      ...emptyUser,
      id: 'test-GUID',
      name: 'TEST FACE',
      email: 'notReal@example.com',
    };
  
    renderPage(USER_PATH, <UserPage path={USER_PATH} />,
               { user: TEST_USER, currentUser: TEST_USER});

    expect(screen.getByText(userFormTitle)).toBeInTheDocument();

    expect(screen.getByLabelText(startsWith('Name')))
      .toHaveValue(TEST_USER.name);
  });

  test('Skips rendering when path match fails', () => {
    renderPage('/testPath', <UserPage path={USER_PATH} />);

    expect(screen.queryByText(userFormTitle)).not.toBeInTheDocument();
  });
});