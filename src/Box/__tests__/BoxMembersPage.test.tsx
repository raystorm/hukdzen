import react from 'react'
import { screen } from '@testing-library/react'

import { printGyet } from '../../Gyet/GyetType';
import {renderPageWithPath} from '../../__utils__/testUtilities';
import BoxMembersPage from '../BoxMembersPage';

import boxList from '../../data/boxList.json';
import userList from '../../data/userList.json';
import {Xbiis} from "../boxTypes";
import {User} from "../../User/userType";
import {ADMIN_BOXMEMBERS_PATH} from "../../components/shared/constants";
import {buildBoxUser} from "../../BoxUser/BoxUserType";

const initUser: User = userList.items[1] as User;
const initialBox: Xbiis = boxList.items[0] as Xbiis;

initialBox.owner = initUser;

const STATE = {
  userList: { items: [initUser] },
  boxList: { items: [initialBox] },
  boxUserList: { items: [buildBoxUser(initUser, initialBox)] }
};

describe('BoxMembersPage tests', () => {
  
  test('Renders Correctly', () => {
    const current =
          ADMIN_BOXMEMBERS_PATH.replace(':id',
                                        'a95212b3-dff4-4286-9602-aab1c6ef9c5a')
    renderPageWithPath(current, ADMIN_BOXMEMBERS_PATH,
                       <BoxMembersPage />, STATE);

    expect(screen.getByText('Xbiis Members')).toBeInTheDocument();
    expect(screen.getByText(initialBox.name)).toBeInTheDocument();
    expect(screen.getByText(printGyet(initialBox.owner))).toBeInTheDocument();

    //TODO: verify BoxMembersList displays

  });

});
