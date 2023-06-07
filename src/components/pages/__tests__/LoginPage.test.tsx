import react from 'react';
import { screen } from '@testing-library/react'
import { renderWithState, } from '../../../__utils__/testUtilities';
import LoginPage from '../LoginPage';
import {emptyUser, User} from '../../../User/userType';

describe('User Page Tests', () => {

  test('Renders Correctly for user', () => {
    const TEST_USER: User = {
      ...emptyUser,
      id: 'test-GUID',
      name: 'TEST FACE',
      email: 'notReal@example.com',
    };

    renderWithState({ currentUser: TEST_USER } , <LoginPage />);

    expect(screen.getByText(`Hello ${TEST_USER.name}`)).toBeInTheDocument();
  });

});