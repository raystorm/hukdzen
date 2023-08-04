import react from 'react';
import { screen } from '@testing-library/react'
import {renderPage, renderWithProviders, renderWithState, startsWith} from '../../__utils__/testUtilities';
import AuthorPage from '../AuthorPage';
import { AuthorFormTitle } from '../../components/forms/AuthorForm';
import {emptyAuthor, Author} from '../AuthorType';
import {AUTHOR_PATH} from "../../components/shared/constants";

describe('Author Page', () => {

  test('Renders Correctly for no user', () => {
    renderPage(AUTHOR_PATH, <AuthorPage path={AUTHOR_PATH} />);

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
  
    renderPage(AUTHOR_PATH, <AuthorPage path={AUTHOR_PATH} />,
               { author: TEST_USER });

    expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();

    expect(screen.getByLabelText(startsWith('Name'))).toHaveValue(TEST_USER.name);
  });

});