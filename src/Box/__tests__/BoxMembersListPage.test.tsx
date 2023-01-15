import React from 'react';
import { fireEvent, getByText, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Xbiis, DefaultBox } from '../boxTypes';
import { Gyet, printUser } from '../../User/userType';
import { Role, DefaultRole, printRole } from '../../Role/roleTypes';
import { Clan } from '../../User/ClanType';

import { renderWithState } from '../../utilities/testUtilities';
import { 
         getColumnHeadersTextContent, getColumnValues, getCell
       } from '../../components/widgets/__tests__/dataGridHelperFunctions';
import BoxMembersList, { BoxMembersListProps } from '../BoxMembersList';
import userList from '../../data/userList.json';
import boxList from '../../data/boxList.json';

/*
const initUser: Gyet = {
  id: 'USER GUID HERE',
  name: 'I am a Test User',
  waa: 'not a Kampshewampt name',
  email: 'test@example.com',
  isAdmin: false,
  clan: Clan.Eagle,
  boxRoles: [{ box: DefaultBox, role: DefaultRole }]
};

const initialBox: Xbiis = {
  id: 'BOX-GUID-HERE',
  name: 'BoxName',
  owner: initUser,
  defaultRole: Role.Write
};
*/

const initUser: Gyet = boxList.boxes[0].owner;

//@ts-ignore
const initialBox: Xbiis = boxList.boxes[0];

const STATE = {
  //boxList: { boxes: [initialBox] },
  boxList: boxList,
  box: initialBox
};

const membersListProps: BoxMembersListProps = {
  members: userList.users as Gyet[],
};

userEvent.setup();

describe('BoxListPage tests', () => 
{
  test('Renders Correctly when no data available', () => 
  { 
     const emptyState = { boxList: { boxes: [] }, box: initialBox };
     const emptyProps: BoxMembersListProps = { members: [] }
     renderWithState(emptyState, <BoxMembersList { ...emptyProps } />);

     //TODO: check for ID
     
     expect(getColumnHeadersTextContent())
       .toEqual(['Member', 'Actions']);
     
     expect(getColumnValues(0)).toEqual(['No Members List Loaded']);
  });

  test('Renders Correctly when data available', () => 
  { 
     renderWithState(STATE, <BoxMembersList { ...membersListProps } />);

     //TODO: check for ID
     
     expect(getColumnHeadersTextContent())
       .toEqual(['Member', 'Actions']);
     
     //@ts-ignore  
     expect(getCell(0, 0)).toHaveTextContent(printUser(userList.users[0]));
     //TODO: check for icons in column 1
  });

  /* verify empty operation * /
  test('Renders Correctly when data available without owner', () => 
  { 
     const ownerLess = { ...initialBox, owner: undefined };
     const ownerLessState = { boxList: { boxes: [ownerLess] }, box: ownerLess };
     renderWithState(ownerLessState, <BoxMembersList { ...membersListProps } />);

     //TODO: check for ID
     
     expect(getColumnHeadersTextContent())
       .toEqual(['Member', 'Actions']);
     
    expect(getCell(0, 0)).toEqual(initialBox.name);
  });
  // */

  /*
    TODO: BoxMembersList testing for:
        * add action
        * edit action
          1 Select different user
          2.a. Save change
          2.b. cancel change
        * Delete action  
  */

  test('Add Record Button inserts a new Empty row to the bottom of the table', 
       async () => 
  {   
     renderWithState(STATE, <BoxMembersList { ...membersListProps } />);
    
     expect(getColumnHeadersTextContent())
       .toEqual(['Member', 'Actions']);

     const addButton = screen.getByText('Add record');
      
     expect(addButton).toBeInTheDocument();
     screen.debug(addButton);

     console.log(getColumnValues(0));

     await userEvent.click(addButton);

     await waitFor(() => {
        expect(getColumnValues(0)).toHaveLength(4);
        //expect(screen.getByText('Owner *')).toBeInTheDocument();
     });
      
      
     expect(getCell(3,0)).toBeInTheDocument();     
     expect(getCell(3,0)).not.toHaveValue(undefined); //means does not have any value

});

});