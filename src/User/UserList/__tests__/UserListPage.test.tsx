import react from 'react';
import { screen } from '@testing-library/react'

import { renderWithState, startsWith } from '../../../utilities/testUtilities';
import UserListPage from '../UserListPage';
import { Gyet } from '../../userType';
import { Email } from '@mui/icons-material';

const TEST_USER: Gyet = {
  id: 'TEST_UL_U_GUID',
  name: 'Test user',
  email: 'DoNotEmail@Example.com'
};

const TEST_USER_2: Gyet = {
  id: 'TEST_UL_U_GUID_2',
  name: 'Test user 2',
  email: 'DoNotEmail2@Example.com'
};

const TEST_STATE = {
  user: TEST_USER,
  userList: [TEST_USER, TEST_USER_2],
};

describe('UserList Page Tests', () => {

  test('Renders Correctly', () => {
    const TEST_USER: Gyet = {
      id: 'test-GUID',
      name: 'TEST FACE',
      email: 'notReal@example.com',
    };
  
    renderWithState(TEST_STATE , <UserListPage />)

    expect(screen.getByText('User Accounts')).toBeInTheDocument();

    expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(TEST_USER.name);
  });

  /* TODO: test: DataGrid Loads and Clicks */    

});