import react from 'react';
import { screen } from '@testing-library/react'
import { renderWithState, } from '../../../utilities/testUtilities';
import LoginPage from '../LoginPage';
import {emptyGyet, Gyet} from '../../../User/userType';

describe('User Page Tests', () => {

  test('Renders Correctly for user', () => {
    const TEST_USER: Gyet = {
      ...emptyGyet,
      id: 'test-GUID',
      name: 'TEST FACE',
      email: 'notReal@example.com',
    };

    renderWithState({ currentUser: TEST_USER } , <LoginPage />);

    expect(screen.getByText(`Hello ${TEST_USER.name}`)).toBeInTheDocument();
  });

});