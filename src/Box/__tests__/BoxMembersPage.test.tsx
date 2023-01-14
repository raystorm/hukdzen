import react from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event';

import { Gyet, printUser } from '../../User/userType';
import { DefaultBox, Xbiis } from '../boxTypes';
import { DefaultRole } from '../../Role/roleTypes';
import { renderWithState } from '../../utilities/testUtilities';
import BoxMembersPage from '../BoxMembersPage';

//TODO: use /data object versions.

const initUser: Gyet = {
  id: 'USER_GUID_HERE',
  name: 'Test UserFace',
  email: 'email@example.com',
  isAdmin: false,
  boxRoles: [{ box: DefaultBox, role: DefaultRole }]
};

const initialBox: Xbiis = {
  id: 'box-guid-here',
  name: 'My Special Box',
  //owner: initUser,
  owner: { ...initUser },
  //defaultRole: DefaultRole
};

initialBox.owner = initUser;

const STATE = {
  userList: { users: [initUser] },
  boxList: { boxes: [initialBox] }
};

/* 
 * TODO: do this the correct way:  
 *       https://github.com/testing-library/react-testing-library/issues/654 
 *       https://medium.com/@aarling/mocking-a-react-router-match-object-in-your-component-tests-fa95904dcc55 
 */

//hack copied from: https://stackoverflow.com/a/66279179/659354
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: 'box-guid-here' }),
}));

describe('BoxMembersPage tests', () => { 
  
  test('Renders Correctly', () => { 
      
    renderWithState(STATE, <BoxMembersPage />);

    expect(screen.getByText('Xbiis Members')).toBeInTheDocument();
    expect(screen.getAllByText(initialBox.name)).toBeInTheDocument();
    expect(screen.getAllByText(printUser(initialBox.owner))).toBeInTheDocument();

    //TODO: verify BoxMembersList displays

  });

});
