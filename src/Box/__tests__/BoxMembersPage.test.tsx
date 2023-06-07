import react from 'react'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'

import { printGyet } from '../../Gyet/GyetType';
import { renderWithState } from '../../__utils__/testUtilities';
import BoxMembersPage from '../BoxMembersPage';

import boxList from '../../data/boxList.json';
import userList from '../../data/userList.json';
import {Xbiis} from "../boxTypes";
import {User} from "../../User/userType";

const initUser: User = userList.items[1] as User;
const initialBox: Xbiis = boxList.items[0] as Xbiis;

initialBox.owner = initUser;

const STATE = {
  userList: { items: [initUser] },
  boxList: { items: [initialBox] }
};

/* 
 * TODO: do this the correct way:  
 *       https://github.com/testing-library/react-testing-library/issues/654 
 *       https://medium.com/@aarling/mocking-a-react-router-match-object-in-your-component-tests-fa95904dcc55 
 */

//hack copied from: https://stackoverflow.com/a/66279179/659354
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: "a95212b3-dff4-4286-9602-aab1c6ef9c5a" }),
}));

describe('BoxMembersPage tests', () => { 
  
  test('Renders Correctly', () => { 
      
    renderWithState(STATE, <BoxMembersPage />);

    expect(screen.getByText('Xbiis Members')).toBeInTheDocument();
    expect(screen.getByText(initialBox.name)).toBeInTheDocument();
    expect(screen.getByText(printGyet(initialBox.owner))).toBeInTheDocument();

    //TODO: verify BoxMembersList displays

  });

});
