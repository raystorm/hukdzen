import react from 'react';
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { renderWithState, startsWith } from '../../../utilities/testUtilities';
import UserListPage from '../UserListPage';
import { Gyet } from '../../userType';
import { getCell } from '../../../components/widgets/__tests__/dataGridHelperFunctions';
import { userActions } from '../../userSlice';

const TEST_USER: Gyet = {
  id: 'TEST_UL_U_GUID',
  name: 'Test user',
  email: 'DoNotEmail@Example.com'
};

const TEST_USER_2: Gyet = {
  id: 'TEST_UL_U_GUID_2',
  name: 'Test user 2',
  email: 'DoNotEmail2@Example.com'
};

const TEST_STATE = {
  user: TEST_USER,
  userList: { users: [TEST_USER, TEST_USER_2] },
};

userEvent.setup();

describe('UserList Page Tests', () => {

  test('Renders Correctly with userList', () => {
    renderWithState(TEST_STATE, <UserListPage />);

    expect(screen.getByText('User Accounts')).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_USER.name);

    expect(getCell(0,0)).toHaveTextContent(TEST_USER.name);
  });

  test('Renders Correctly without userList', () => {
    const state = { user: TEST_USER };
    renderWithState(state, <UserListPage />);

    expect(screen.getByText('User Accounts')).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_USER.name);

    expect(getCell(0,0)).toHaveTextContent('ERROR');
  });

  test('Clicking on Data Grid dispatches the correct action', async () => {
    
    const { store } = renderWithState(TEST_STATE , <UserListPage />);

    expect(screen.getByText('User Accounts')).toBeInTheDocument();

    expect(screen.getAllByLabelText(startsWith('Name'))[0])
      .toHaveValue(TEST_USER.name);
      
    const nameCell2 = getCell(1,0); 

    expect(getCell(0,0)).toHaveTextContent(TEST_USER.name);
    expect(nameCell2).toHaveTextContent(TEST_USER_2.name);

    await userEvent.click(nameCell2);

    await waitFor(() => { 
      const action = userActions.getSpecifiedUserById(TEST_USER_2.id);
      expect(store.dispatch).toBeCalledWith(action);
    });

    //TEST ctrl click
    /* [CTRL] click the sell to deselect */
    await userEvent.click(nameCell2,      /* keyboard event to hold [CTRL] */
                          {keyboardState: (await userEvent.keyboard('{Control>}'))});
    /* NOTE: if futher interactions are required, 
       [CTRL] would need to be released */

    console.log('CTRL clicked on "nameCell2"');

    await waitFor(() => { 
      const action = userActions.clearUser();
      expect(store.dispatch).toBeCalledWith(action);
    });

  });

});