import React, { useState } from 'react';
import { fireEvent, getByText, screen, waitFor, within } from '@testing-library/react';
import { v4 as randomUUID } from "uuid";
import userEvent from '@testing-library/user-event';

import {Xbiis, DefaultBox, emptyXbiis} from '../boxTypes';
import {emptyBoxList} from "../BoxList/BoxListType";
import { User } from '../../User/userType';
import { printGyet } from "../../Gyet/GyetType";

import {renderWithState, contains, startsWith, renderPage} from '../../__utils__/testUtilities';
import {
         getColumnHeadersTextContent, getColumnValues, getCell, sleep
       } from '../../__utils__/dataGridHelperFunctions';
import BoxMembersList, { BoxMembersListProps } from '../BoxMembersList';
import userList from '../../data/userList.json';
import boxList from '../../data/boxList.json';
import {emptyBoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";
import {BoxUser, buildBoxUser} from "../../BoxUser/BoxUserType";


const initialBox: Xbiis = { ...emptyXbiis, ...boxList.items[0] as Xbiis }

const STATE = {
  //boxList: { boxes: [initialBox] },
  boxList: boxList,
  box: initialBox
};

const buildBoxUserList = (): BoxUser[] => {
   return userList.items.map(user => {
      return {
               ...buildBoxUser(user as User, initialBox),
               id: randomUUID(),
             };
   })
}

const membersListProps: BoxMembersListProps = {
  box: initialBox,
  membersList: {
     __typename: 'ModelBoxUserConnection',
     items: buildBoxUserList(),
  },
  disableVirtualization: true,
  //userList.items as User[],
};

userEvent.setup();

describe('BoxMembersListPage tests', () =>
{
  test('Renders Correctly when no data available', () => 
  { 
     const emptyState = { boxList: emptyBoxList, box: initialBox };
     //const emptyProps: BoxMembersListProps = { box: initialBox, membersList: [] }
     renderWithState(emptyState, <BoxMembersList box={initialBox}
                                                 membersList={emptyBoxUserList}
                                                 disableVirtualization={true} />);

     //TODO: check for ID
     
     expect(getColumnHeadersTextContent())
       .toEqual(['id', 'Member', 'Role', 'Actions']);
     
     //expect(getColumnValues(0)).toEqual(['No Members List Loaded']);
     expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  test('Renders Correctly when data available', () => 
  { 
     renderWithState(STATE, <BoxMembersList { ...membersListProps } />);

     //TODO: check for ID

     console.log(`userList: ${JSON.stringify(userList,null,2)}`);
     console.log(`BoxUserList: ${JSON.stringify(buildBoxUserList(),null,2)}`);
     console.log(`BoxMembersList: ${JSON.stringify(membersListProps.membersList,null,2)}`);

     console.log(screen.getAllByRole('row')[0].textContent);
     /*
     console.log(screen.getAllByRole('row')[1].textContent);
     console.log(screen.getAllByRole('row').length);
     console.log(screen.getAllByRole('row')[2].textContent);
     console.log(screen.getAllByRole('row')[3].textContent);
     */

     //TODO: find out why Actions isn't found.
     expect(getColumnHeadersTextContent())
       .toEqual(['id', 'Member', 'Role', 'Actions']);

     //expect(screen.getByText(printGyet(membersListProps.membersList!.items[0]!.user)))
     //  .toBeInTheDocument();

     //@ts-ignore  
     expect(getCell(0, 1))
       .toHaveTextContent(printGyet(membersListProps.membersList!.items[0]!.user));
     //TODO: check for icons in column 1
  });

  /* verify empty operation * /
  test('Renders Correctly when data available without owner', () => 
  { 
     const ownerLess = { ...initialBox, owner: undefined };
     const ownerLessState = { boxList: { items: [ownerLess] }, box: ownerLess };
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
       .toEqual(['id', 'Member', 'Role', 'Actions']);

     await clickAddButton();
      
     expect(getCell(3,0)).toBeInTheDocument();     
     expect(getCell(3,0)).not.toHaveValue(undefined); //means does not have any value
  });

  test('Cancel Button removes the new row', 
       async () => 
  {   
     renderWithState(STATE, <BoxMembersList { ...membersListProps } />);
    
     expect(getColumnHeadersTextContent())
       .toEqual(['id', 'Member', 'Role', 'Actions']);

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
       .toEqual(['id', 'Member', 'Role', 'Actions']);

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
        ...membersListProps,
        //membersList: { items: [userList.items[0] as User, userList.items[1] as User] },
     };
     props.membersList!.items = [membersListProps.membersList!.items[0],
                                 membersListProps.membersList!.items[1]]


     renderWithState(userState, <BoxMembersList { ...props } />);
    
     expect(getColumnHeadersTextContent())
       .toEqual(['id', 'Member', 'Role', 'Actions']);

     await clickAddButton();

     const added = getCell(2,0);
      
     expect(added).toBeInTheDocument();     
     expect(added).not.toHaveValue(undefined); //means does not have any value

     const textBox = screen.getAllByRole('button')[1];
     await userEvent.click(textBox);

     const changeUser = printGyet(userList.items[2] as User);

     const userOption = () => screen.getByRole('option', { name: changeUser });
     await waitFor(() =>{ expect(userOption()).toBeInTheDocument(); })
     //screen.debug(userOption());
     //screen.debug(screen.getByRole('presentation'));

     //screen.debug(screen.getByRole('option', { name: changeUser }));
     await userEvent.click(userOption());

     await waitFor(() => {
        expect(getCell(2,1)).toHaveTextContent(changeUser);
     });

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