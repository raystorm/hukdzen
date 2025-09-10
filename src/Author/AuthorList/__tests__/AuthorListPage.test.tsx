import react from 'react';
import { act, screen, waitFor } from '@testing-library/react'
import userEvnt from '@testing-library/user-event';

import authorList from '../../../data/authorList.json';

import {renderPage, startsWith} from '../../../__utils__/testUtilities';
import AuthorListPage, {AuthorListPageTitle} from '../AuthorListPage';
import {emptyAuthor, Author} from '../../AuthorType';
import { getCell } from '../../../__utils__/dataGridHelperFunctions';
import { authorActions } from '../../authorSlice';
import {AUTHORLIST_PATH} from "../../../components/shared/constants";
import {setupAuthorListMocking, setupAuthorMocking} from "../../../__utils__/__fixtures__/AuthorAPI.helper";

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

const userEvent = userEvnt.setup();

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

  test('Clicking on Data Grid dispatches the correct action',
       async () =>
  {
     const author:  Author = authorList.items[0] as Author;
     const author2: Author = authorList.items[1] as Author;
     const state = { author: author, authorList: authorList };

     setupAuthorListMocking();
     setupAuthorMocking();

     const { store } =
          renderPage(AUTHORLIST_PATH, <AuthorListPage />, state);

    expect(screen.getByText(AuthorListPageTitle)).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(author.name);
      
    const nameCell2 = getCell(1,0); 

    expect(getCell(0,0)).toHaveTextContent(author.name);
    expect(nameCell2).toHaveTextContent(author2.name);

    await act( async () => { userEvent.click(nameCell2); })

    await waitFor(() => { 
      const action = authorActions.getAuthorById(author2.id);
      expect(store.dispatch).toBeCalledWith(action);
    });

    //TEST ctrl click
    /* [CTRL] click the sell to deselect */
    await act( async () =>
    {
       userEvent.click(nameCell2,      /* keyboard event to hold [CTRL] */
                       //{ctrlKey: true});
                       {keyboardState: (await userEvent.keyboard('{Control>}'))});
    })
    /* NOTE: if further interactions are required,
       [CTRL] would need to be released */

    console.log('CTRL clicked on "nameCell2"');

    await waitFor(() => { 
      const action = authorActions.clearAuthor();
      expect(store.dispatch).toBeCalledWith(action);
    });

  });

});