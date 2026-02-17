import react from 'react';
import { screen } from '@testing-library/react'
import {renderPage, renderPageWithPath, renderWithState, startsWith} from '../../__utils__/testUtilities';
import AuthorPage from '../AuthorPage';
import { AuthorFormTitle } from '../../components/forms/AuthorForm';
import {emptyAuthor, Author} from '../AuthorType';
import {AUTHOR_PATH} from "../../components/shared/constants";
import {setupAuthorMocking} from "../../__utils__/__setup__/AuthorAPI.helper";

describe('Author Page', () =>
{

   test('Renders Correctly for no user', () =>
   {
     setupAuthorMocking();
     renderPage(AUTHOR_PATH, <AuthorPage path={AUTHOR_PATH} />);

     expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();

     expect(screen.getByLabelText(startsWith('Name'))).not.toHaveValue();
  });

  test('Renders Correctly for user', () =>
  {
     const TEST_AUTHOR: Author = {
       ...emptyAuthor,
       id: 'test-GUID',
       name: 'TEST FACE',
       email: 'notReal@example.com',
     };

     const authorPath: string = `/author/${TEST_AUTHOR.id}`;
     renderPageWithPath(authorPath, AUTHOR_PATH, <AuthorPage path={AUTHOR_PATH} />,
                        { author: TEST_AUTHOR });

     expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();

     expect(screen.getByLabelText(startsWith('Name')))
       .toHaveValue(TEST_AUTHOR.name);
  });

  test('Skips rendering correctly when path matching fails', () => {
    renderPage('/test', <AuthorPage path={AUTHOR_PATH} />);

    expect(screen.queryByText(AuthorFormTitle)).not.toBeInTheDocument();
  });

});