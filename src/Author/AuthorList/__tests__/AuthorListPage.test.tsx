import react from 'react';
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { renderWithState, startsWith } from '../../../__utils__/testUtilities';
import AuthorListPage, {AuthorListPageTitle} from '../AuthorListPage';
import {emptyAuthor, Author} from '../../AuthorType';
import { getCell } from '../../../components/widgets/__tests__/dataGridHelperFunctions';
import { authorActions } from '../../authorSlice';

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
    renderWithState(TEST_STATE, <AuthorListPage />);

    expect(screen.getByText(AuthorListPageTitle)).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_AUTHOR.name);

    expect(getCell(0,0)).toHaveTextContent(TEST_AUTHOR.name);
  });

  test('Renders Correctly without authorList', () => {
    const state = { author: TEST_AUTHOR };
    renderWithState(state, <AuthorListPage />);

    expect(screen.getByText(AuthorListPageTitle)).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_AUTHOR.name);

    expect(getCell(0,0)).toHaveTextContent('ERROR');
  });

  test('Clicking on Data Grid dispatches the correct action', async () => {
    
    const { store } = renderWithState(TEST_STATE , <AuthorListPage />);

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