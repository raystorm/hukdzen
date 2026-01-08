import React from 'react';
import { vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { v4 as randomUUID } from "uuid";
import userEvnt from '@testing-library/user-event';

import { Xbiis, emptyXbiis, DefaultBox, BoxPurpose } from '../boxTypes';
import {emptyBoxList} from "../BoxList/BoxListType";
import { User } from '../../User/userType';
import { printGyet } from "../../Gyet/GyetType";

import { renderWithState } from '../../__utils__/testUtilities';
import {
         getColumnHeadersTextContent, getColumnValues, getCell, sleep
       } from '../../__utils__/dataGridHelperFunctions';
import BoxMembersList, { BoxMembersListProps, MemberRowList } from '../BoxMembersList';
import userList from '../../data/userList.json';
import boxList from '../../data/boxList.json';
import {emptyBoxUserList} from "../../BoxUser/BoxUserList/BoxUserListType";
import {BoxUser, buildBoxUser} from "../../BoxUser/BoxUserType";
import {boxUserActions} from "../../BoxUser/BoxUserSlice";
import {setupBoxUserListMocking, setupBoxUserMocking} from "../../__utils__/__fixtures__/BoxUserAPI.helper";


const initialBox: Xbiis = { ...emptyXbiis, ...boxList.items[1] as Xbiis }

const STATE = {
  user: userList.items[0] as User,
  currentUser: userList.items[0] as User,
  boxList: boxList,
  box: initialBox,
  userList: userList,
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
};

const userEvent = userEvnt.setup();

describe('BoxMembersList', () =>
{
  beforeEach(() => {
     setupBoxUserListMocking();
     setupBoxUserMocking();
  })

  describe('Rendering', () =>
  {
    test('renders correctly when no data available', () => 
    { 
       const emptyState = { boxList: emptyBoxList, box: initialBox };
       renderWithState(emptyState, <BoxMembersList box={initialBox}
                                                   membersList={emptyBoxUserList}
                                                   disableVirtualization={true} />);

       expect(getColumnHeadersTextContent())
         .toEqual(['id', 'Member', 'Role', 'Actions']);
       
       expect(screen.getByText('No rows')).toBeInTheDocument();
    });

    test('renders correctly when data available', () => 
    { 
       renderWithState(STATE, <BoxMembersList { ...membersListProps } />);

       console.log(screen.getAllByRole('row')[0].textContent);

       expect(getColumnHeadersTextContent())
         .toEqual(['id', 'Member', 'Role', 'Actions']);

       expect(getCell(0, 1))
         .toHaveTextContent(printGyet(membersListProps.membersList!.items[0]!.user));
    });
  });

  /** Helper method to click the Add record button */          
  const clickAddButton = async () => 
  {
    const addButton = screen.getByText('Add record');
    expect(addButton).toBeInTheDocument();

    const initialRowCount = getColumnValues(0).length;

    await userEvent.click(addButton);

    await waitFor(() => {
       expect(getColumnValues(0)).toHaveLength(initialRowCount + 1);
    });
  }

  describe('Row Actions', () =>
  {
    test('Add record button inserts new empty row', async () =>
    {
       console.log('testing add Record Button');
       renderWithState(STATE, <BoxMembersList { ...membersListProps } />);

       expect(getColumnHeadersTextContent())
         .toEqual(['id', 'Member', 'Role', 'Actions']);

       await clickAddButton();

       expect(getCell(3,0)).toBeInTheDocument();
       expect(getCell(3,0)).not.toHaveValue(undefined);
       console.log('finished testing add Record Button');
    });

    test('Edit makes row editable', async () =>
    {
      console.log('testing Editable');
      const { store } = renderWithState(STATE,
                                        <BoxMembersList { ...membersListProps } />);

      console.log(`userList: ${JSON.stringify(userList,null,2)}`);
      console.log(`BoxUserList: ${JSON.stringify(buildBoxUserList(),null,2)}`);
      console.log(`BoxMembersList: ${JSON.stringify(membersListProps.membersList,null,2)}`);

      console.log(screen.getAllByRole('row')[0].textContent);

      expect(getColumnHeadersTextContent())
         .toEqual(['id', 'Member', 'Role', 'Actions']);

      const member = membersListProps.membersList!.items[0]!;

      //@ts-ignore
      expect(getCell(0, 1))
         .toHaveTextContent(printGyet(member.user));

      const edit = screen.getAllByLabelText("Edit")[0];
      expect(edit).toBeInTheDocument();

      await userEvent.click(edit);

      await waitFor(() => {
         expect(screen.getByLabelText("Save")).toBeVisible();
      });
      console.log('finished testing editable');
    });

    test('Cancel button removes new row', async () =>
    {
       console.log('testing Cancel Button');
       renderWithState(STATE, <BoxMembersList { ...membersListProps } />);
      
       expect(getColumnHeadersTextContent())
         .toEqual(['id', 'Member', 'Role', 'Actions']);

       await clickAddButton();
        
       expect(getCell(3,0)).toBeInTheDocument();     
       expect(getCell(3,0)).not.toHaveValue(undefined);

       const cancel = screen.getByLabelText('Cancel');

       await userEvent.click(cancel);

       await(waitFor(() => { expect(getColumnValues(0)).toHaveLength(3); }));
       console.log('finished testing Cancel Button');
    });

    test('Save button does nothing when row is empty', async () => 
    {
       console.log('Testing Save on Empty')
       renderWithState(STATE, <BoxMembersList { ...membersListProps } />);
      
       expect(getColumnHeadersTextContent())
         .toEqual(['id', 'Member', 'Role', 'Actions']);

       await clickAddButton();
        
       expect(getCell(3,0)).toBeInTheDocument();     
       expect(getCell(3,0)).not.toHaveValue(undefined);

       const save = screen.getByLabelText('Save');

       await userEvent.click(save);

       expect(save).toBeInTheDocument();
       console.log('finished testing save on Empty');
    });

    test('Save button ends editing when row has value', async () =>
    {
       console.log('Testing Save with Value');
       const userState = { ...STATE, userList: userList };

       const props: BoxMembersListProps = { ...membersListProps, };
       props.membersList!.items = [membersListProps.membersList!.items[0],
                                   membersListProps.membersList!.items[1]]

       const { store } = renderWithState(userState, <BoxMembersList { ...props } />);
      
       expect(getColumnHeadersTextContent())
         .toEqual(['id', 'Member', 'Role', 'Actions']);

       console.log("clicking Add Button");
       await clickAddButton();

       const added = getCell(2,0);
        
       expect(added).toBeInTheDocument();     
       expect(added).not.toHaveValue(undefined);

       console.log("clicking user List");
       const textBox = screen.getAllByRole('combobox')[0];
       await userEvent.click(textBox);

       const changeUser = printGyet(userList.items[2] as User);

       const userOption = () => screen.getByRole('option', { name: changeUser });
       await waitFor(() =>{ expect(userOption()).toBeInTheDocument(); })

       console.log("clicking to set user");
       await userEvent.click(userOption());

       console.log("After clicking user option");
       console.log("Cell 2,1 content:", getCell(2,1).textContent);
       console.log("Expected content:", changeUser);

       await waitFor(() => {
          console.log("Waiting for cell content to update...");
          console.log("Current cell content:", getCell(2,1).textContent);
          expect(getCell(2,1)).toHaveTextContent(changeUser);
       });

       console.log('Clicking Save Button');

       await userEvent.click(within(getCell(2, 3)).getByLabelText('Save'));

       // @ts-ignore
       console.log('All dispatch calls:', store?.dispatch.mock.calls);

       await waitFor(() => {
         const user = userList.items[2] as User;
         const newMember: BoxUser = {
                                      ...buildBoxUser(user, STATE.box, expect.anything()),
                                      id: expect.anything(),
                                      createdAt: expect.anything(),
                                      updatedAt: expect.anything(),
                                    };
         const action = boxUserActions.createBoxUser(newMember);
         expect(store?.dispatch).toHaveBeenCalledWith(action);
       });

       await waitFor(() => {
          expect(within(getCell(2,3)).queryByLabelText('Save'))
             .not.toBeInTheDocument();
       });
       console.log('finished testing Save with Value');
    });

    test('Save button dispatches update on change', async () =>
    {
        console.log('Testing Save Button Update');
        const userState = { ...STATE, userList: userList };

        const props: BoxMembersListProps = {
           ...membersListProps,
        };
        props.membersList!.items = [membersListProps.membersList!.items[0],
           membersListProps.membersList!.items[1]]

        const { store } = renderWithState(userState, <BoxMembersList { ...props } />);

        expect(getColumnHeadersTextContent())
           .toEqual(['id', 'Member', 'Role', 'Actions']);

        const edit = within(screen.getAllByRole('cell')[3])
                       .getByLabelText('Edit');
        expect(edit).toBeInTheDocument();

        await userEvent.click(edit);

        await waitFor(() => {
           expect(screen.getByLabelText("Save")).toBeVisible();
        });

        await waitFor(() =>{
          expect(within(screen.getAllByRole('cell')[1]).getByRole('combobox'))
            .toBeInTheDocument();
        });

        const textBox = within(screen.getAllByRole('cell')[1])
                                       .getByRole('combobox');
        await userEvent.click(textBox);

        const changeUser = printGyet(userList.items[2] as User);

        const userOption = () => screen.getByRole('option', { name: changeUser });
        await waitFor(() =>{ expect(userOption()).toBeInTheDocument(); })

        await userEvent.click(userOption());

        await waitFor(() => {
           expect(screen.getAllByRole('cell')[1]).toHaveTextContent(changeUser);
        });

        await userEvent.click(within(screen.getAllByRole('cell')[3])
                             .getByLabelText('Save'));

        await waitFor(() => {
           const user = userList.items[2] as User;
           const newMember: BoxUser = {
                                         ...buildBoxUser(user, STATE.box, expect.anything()),
                                         id: expect.anything(),
                                         createdAt: expect.anything(),
                                         updatedAt: expect.anything(),
                                      };
           const action = boxUserActions.updateBoxUser(newMember);
           expect(store?.dispatch).toHaveBeenCalledWith(action);
        });

        await waitFor(() => {
           expect(within(screen.getAllByRole('cell')[3]).queryByLabelText('Save'))
              .not.toBeInTheDocument();
        });
        console.log('finished testing Save Button update');
    }, 10000);

    test('Delete correctly dispatches remove event', async () =>
    {
        console.log('testing Delete');
        const { store } = renderWithState(STATE, <BoxMembersList { ...membersListProps } />);

        console.log(`userList: ${JSON.stringify(userList,null,2)}`);
        console.log(`BoxUserList: ${JSON.stringify(buildBoxUserList(),null,2)}`);
        console.log(`BoxMembersList: ${JSON.stringify(membersListProps.membersList,null,2)}`);

        console.log(screen.getAllByRole('row')[0].textContent);

        expect(getColumnHeadersTextContent())
          .toEqual(['id', 'Member', 'Role', 'Actions']);

        const member = membersListProps.membersList!.items[0]!;

        //@ts-ignore
        expect(getCell(0, 1))
           .toHaveTextContent(printGyet(member.user));

        const del = screen.getAllByLabelText("Delete")[0];
        expect(del).toBeInTheDocument();

        await userEvent.click(del);

        await waitFor(() => {
           const id = member.id;
           const action = boxUserActions.removeBoxUserById(id);
           expect(store?.dispatch).toBeCalledWith(action);
        });
        console.log('finished testing delete');
    });
  });

  describe('Access Restrictions', () =>
  {
    test('Edit button is disabled for box owner', async () =>
    {
        const ownerUser = { ...userList.items[0], id: 'owner-id' } as User;
        const ownerBox = { ...initialBox, xbiisOwnerId: 'owner-id' };
        const ownerBoxUser = buildBoxUser(ownerUser, ownerBox);

        const props = {
           ...membersListProps,
           box: ownerBox,
           membersList: { items: [ownerBoxUser] } as MemberRowList
        };

        renderWithState(STATE, <BoxMembersList {...props} />);

        const editButton = screen.getByLabelText('Edit');
        expect(editButton).toBeDisabled();
    });

    test('Delete button is disabled for box owner', async () =>
    {
        const ownerUser = { ...userList.items[0], id: 'owner-id' } as User;
        const ownerBox = { ...initialBox, xbiisOwnerId: 'owner-id' };
        const ownerBoxUser = buildBoxUser(ownerUser, ownerBox);

        const props = {
           ...membersListProps,
           box: ownerBox,
           membersList: { items: [ownerBoxUser] } as MemberRowList
        };

        renderWithState(STATE, <BoxMembersList {...props} />);

        const deleteButton = screen.getByLabelText('Delete');
        expect(deleteButton).toBeDisabled();
    });

    test('Edit button is disabled for DEFAULT box', () =>
    {
      const defaultBox = { ...initialBox, id: DefaultBox.id, purpose: BoxPurpose.DEFAULT };
      const defaultBoxUser = buildBoxUser(userList.items[0] as User, defaultBox);

      const props = {
         ...membersListProps,
         box: defaultBox,
         membersList: { items: [defaultBoxUser] } as MemberRowList
      };

      renderWithState(STATE, <BoxMembersList {...props} />);

      const editButton = screen.getByLabelText('Edit');
      expect(editButton).toBeDisabled();
    });

    test('Delete button is disabled for DEFAULT box', () =>
    {
      const defaultBox = { ...initialBox, id: DefaultBox.id, purpose: BoxPurpose.DEFAULT };
      const defaultBoxUser = buildBoxUser(userList.items[0] as User, defaultBox);

      const props = {
         ...membersListProps,
         box: defaultBox,
         membersList: { items: [defaultBoxUser] } as MemberRowList
      };

      renderWithState(STATE, <BoxMembersList {...props} />);

      const deleteButton = screen.getByLabelText('Delete');
      expect(deleteButton).toBeDisabled();
    });
  });
});
