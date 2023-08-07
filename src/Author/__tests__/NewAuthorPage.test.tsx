import react from 'react';
import { screen } from '@testing-library/react'
import { renderPage, renderPageWithPath, } from '../../__utils__/testUtilities';
import { AuthorFormTitle } from '../../components/forms/AuthorForm';
import {AUTHOR_NEW_PATH} from "../../components/shared/constants";
import NewAuthorPage from "../NewAuthorPage";

describe('New Author Page', () => {

  test('Renders Correctly when mounted', () => {
    renderPage(AUTHOR_NEW_PATH, <NewAuthorPage path={AUTHOR_NEW_PATH} />);

    expect(screen.getByText(AuthorFormTitle)).toBeInTheDocument();
  });

  test('Renders nothing when not mounted', () => {
    renderPage('/testPage', <NewAuthorPage path={AUTHOR_NEW_PATH} />);

    expect(screen.queryByText(AuthorFormTitle)).not.toBeInTheDocument();

    //TODO: check for empty page
  });

});