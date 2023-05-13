import react from 'react';
import { screen } from '@testing-library/react'
import { renderWithProviders, renderWithState, startsWith } from '../../utilities/testUtilities';
import UserPage from '../UserPage';
import { userFormTitle } from '../../components/forms/UserForm';
import { Gyet } from '../userType';

describe('User Page Tests', () => {

  test('Renders Correctly for no user', () => {
    renderWithProviders(<UserPage />);

    expect(screen.getByText(userFormTitle)).toBeInTheDocument();

    expect(screen.getByLabelText(startsWith('Name'))).not.toHaveValue();
  });

  test('Renders Correctly for user', () => {
    const TEST_USER: Gyet = {
      id: 'test-GUID',
      name: 'TEST FACE',
      email: 'notReal@example.com',
    };
  
    renderWithState({ currentUser: TEST_USER } , <UserPage />);

    expect(screen.getByText(userFormTitle)).toBeInTheDocument();

    expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(TEST_USER.name);
  });

});