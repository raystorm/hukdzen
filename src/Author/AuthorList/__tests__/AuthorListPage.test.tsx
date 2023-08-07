import react from 'react';
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import {renderPage, renderPageWithPath, startsWith} from '../../../__utils__/testUtilities';
import AuthorListPage, {AuthorListPageTitle} from '../AuthorListPage';
import {emptyAuthor, Author} from '../../AuthorType';
import { getCell } from '../../../__utils__/dataGridHelperFunctions';
import { authorActions } from '../../authorSlice';
import {AUTHORLIST_PATH} from "../../../components/shared/constants";

const TEST_AUTHOR: Author = {
  ...emptyAuthor,
  id: 'TEST_UL_U_GUID',
  name: 'Test user',
  email: 'DoNotEmail@Example.com'
};

const TEST_AUTHOR_2: Author = {
  ...emptyAuthor,
  id: 'TEST_UL_U_GUID_2',
  name: 'Test user 2',
  email: 'DoNotEmail2@Example.com'
};

const TEST_STATE = {
  author: TEST_AUTHOR,
  authorList: {
    __typename: "ModelAuthorConnection",
    items: [TEST_AUTHOR, TEST_AUTHOR_2]
  },
};

userEvent.setup();

describe('AuthorList Page Tests', () => {

  test('Renders Correctly with userList', () => {
    renderPage(AUTHORLIST_PATH, <AuthorListPage />, TEST_STATE);

    expect(screen.getByText(AuthorListPageTitle)).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_AUTHOR.name);

    expect(getCell(0,0)).toHaveTextContent(TEST_AUTHOR.name);
  });

  test('Renders Correctly without authorList', () => {
    const state = { author: TEST_AUTHOR };
    renderPage(AUTHORLIST_PATH, <AuthorListPage />, state);

    expect(screen.getByText(AuthorListPageTitle)).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_AUTHOR.name);

    expect(getCell(0,0)).toHaveTextContent('ERROR');
  });

  test('Skips Rendering when path fails to match', () => {
    renderPage('/test-Fail-Path', <AuthorListPage />);

    expect(screen.queryByText(AuthorListPageTitle)).not.toBeInTheDocument();
  });

  test('Clicking on Data Grid dispatches the correct action', async () => {
    
    const { store } =
          renderPage(AUTHORLIST_PATH, <AuthorListPage />, TEST_STATE);

    expect(screen.getByText(AuthorListPageTitle)).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_AUTHOR.name);
      
    const nameCell2 = getCell(1,0); 

    expect(getCell(0,0)).toHaveTextContent(TEST_AUTHOR.name);
    expect(nameCell2).toHaveTextContent(TEST_AUTHOR_2.name);

    await userEvent.click(nameCell2);

    await waitFor(() => { 
      const action = authorActions.getAuthorById(TEST_AUTHOR_2.id);
      expect(store.dispatch).toBeCalledWith(action);
    });

    //TEST ctrl click
    /* [CTRL] click the sell to deselect */
    await userEvent.click(nameCell2,      /* keyboard event to hold [CTRL] */
                          {keyboardState: (await userEvent.keyboard('{Control>}'))});
    /* NOTE: if further interactions are required,
       [CTRL] would need to be released */

    console.log('CTRL clicked on "nameCell2"');

    await waitFor(() => { 
      const action = authorActions.clearAuthor();
      expect(store.dispatch).toBeCalledWith(action);
    });

  });

});