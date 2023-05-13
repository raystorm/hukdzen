import React, { useState } from 'react';
import { fireEvent, getByText, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Xbiis, DefaultBox } from '../boxTypes';
import { Gyet, printUser } from '../../User/userType';
import { Role, DefaultRole, printRole } from '../../Role/roleTypes';
import { Clan } from '../../User/ClanType';

import { renderWithState, contains, startsWith } from '../../utilities/testUtilities';
import { 
         getColumnHeadersTextContent, getColumnValues, getCell, sleep
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
        * edit action
          1 Select different user
          2.a. Save change
          2.b. cancel change
        * Delete action  
  */

  /** Helper method to click the Add record button */          
  const clickAddButton = async () => 
  {
    const addButton = screen.getByText('Add record');
    expect(addButton).toBeInTheDocument();
    //screen.debug(addButton);

    //console.log(getColumnValues(0));

    await userEvent.click(addButton);

    await waitFor(() => { expect(getColumnValues(0)).not.toHaveLength(0); });
  }

  test('Add Record Button inserts a new Empty row to the bottom of the table', 
       async () => 
  {   
     renderWithState(STATE, <BoxMembersList { ...membersListProps } />);
    
     expect(getColumnHeadersTextContent())
       .toEqual(['Member', 'Actions']);

     await clickAddButton();
      
     expect(getCell(3,0)).toBeInTheDocument();     
     expect(getCell(3,0)).not.toHaveValue(undefined); //means does not have any value
  });

  test('Cancel Button removes the new row', 
       async () => 
  {   
     renderWithState(STATE, <BoxMembersList { ...membersListProps } />);
    
     expect(getColumnHeadersTextContent())
       .toEqual(['Member', 'Actions']);

     await clickAddButton();
      
     expect(getCell(3,0)).toBeInTheDocument();     
     expect(getCell(3,0)).not.toHaveValue(undefined); //means does not have any value

     //TODO: click cancel button, verify result
     const cancel = screen.getByLabelText('Cancel');

     await userEvent.click(cancel);

     await(waitFor(() => { expect(getColumnValues(0)).toHaveLength(3); }));
  });

  test('Save Button does nothing when row is empty.', async () => 
  {   
     renderWithState(STATE, <BoxMembersList { ...membersListProps } />);
    
     expect(getColumnHeadersTextContent())
       .toEqual(['Member', 'Actions']);

     await clickAddButton();
      
     expect(getCell(3,0)).toBeInTheDocument();     
     expect(getCell(3,0)).not.toHaveValue(undefined); //means does not have any value

     //TODO: click cancel button, verify result
     const save = screen.getByLabelText('Save');

     await userEvent.click(save);

     //await(waitFor(() => { expect(getColumnValues(0)).toHaveLength(3); }));

     //TODO: pause for 1/2 second
     await sleep(500);

     expect(save).toBeInTheDocument();
  });

  test('Save Button ends editing when the row has a value.', async () => 
  {   
     const userState = { ...STATE, userList: userList };

     const props: BoxMembersListProps = {
      members: [userList.users[0] as Gyet, userList.users[1] as Gyet],
     };

     renderWithState(userState, <BoxMembersList { ...props } />);
    
     expect(getColumnHeadersTextContent()).toEqual(['Member', 'Actions']);

     await clickAddButton();

     const added = getCell(2,0);
      
     expect(added).toBeInTheDocument();     
     expect(added).not.toHaveValue(undefined); //means does not have any value

     const textBox = screen.getByLabelText(startsWith('Owner'));
     await userEvent.click(textBox);

     const changeUser = printUser(userList.users[2] as Gyet);

     const userOption = () => screen.getByRole('option', { name: changeUser });
     await waitFor(() =>{ expect(userOption()).toBeInTheDocument(); })
     screen.debug(userOption());
     screen.debug(screen.getByRole('presentation'));

     //screen.debug(screen.getByRole('option', { name: changeUser }));
     await userEvent.click(userOption());

     await waitFor(() => { expect(getCell(2,0)).toHaveTextContent(changeUser); } );

     /* 
     screen.debug(getCell(2, 0));
     screen.debug(added);
     screen.debug(getCell(2, 1));
     */
    
     await waitFor(() => { 
      expect(within(getCell(2,1)).queryByLabelText('Save'))
        .not.toBeInTheDocument();
     });
  });  //, 10000);
});