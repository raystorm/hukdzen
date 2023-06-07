import react from 'react';
import { screen } from '@testing-library/react'
import { renderWithProviders, renderWithState, startsWith } from '../../__utils__/testUtilities';
import AuthorPage from '../AuthorPage';
import { AuthorFormTitle } from '../../components/forms/AuthorForm';
import {emptyAuthor, Author} from '../AuthorType';

describe('Author Page', () => {

  test('Renders Correctly for no user', () => {
    renderWithProviders(<AuthorPage />);

    expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();

    expect(screen.getByLabelText(startsWith('Name'))).not.toHaveValue();
  });

  test('Renders Correctly for user', () => {
    const TEST_USER: Author = {
      ...emptyAuthor,
      id: 'test-GUID',
      name: 'TEST FACE',
      email: 'notReal@example.com',
    };
  
    renderWithState({ currentUser: TEST_USER } , <AuthorPage />);

    expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();

    expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(TEST_USER.name);
  });

});