import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ReduxState } from '../app/reducers';
import ReduxStore from '../app/store';
import { printUser } from '../User/userType';
import { boxActions } from './boxSlice';
import { Xbiis } from './boxTypes';
import BoxMembersList from './BoxMembersList';
import { userListActions } from '../User/UserList/userListSlice';
import { gyigyet } from '../User/UserList/userListType';

export interface BoxMemberProps {

}

const BoxMembersPage = (props: BoxMemberProps) => 
{
  /*
   * TODOs: 
   *   1. Load Box from Box Id in page URL
   *   2. Load/Display current Members.
   *   3. Form for adding new Users.
   *   4. Remove current users
   *   5. Disable Add/Edit for "Default Group."
   */

  const { id } = useParams(); //Item 
  console.log(`BoxId: ${id}`);

  const membersList = useSelector<ReduxState, gyigyet>(state => state.userList);

  useEffect(() => {
     ReduxStore.dispatch(boxActions.getSpecifiedBoxById(id));
     ReduxStore.dispatch(userListActions.getAllUsersForBoxId(id))
  }, [id]);

  const box = useSelector<ReduxState, Xbiis>(state => state.box);

  console.log(`Box to Edit: ${box.name}`);




  return (<>
    <h2>Xbiis Members</h2>
    <h3><strong>Name:</strong> {box.name}</h3>
    <h4><strong>Owner:</strong> {printUser(box.owner)}</h4>
    <p>Page to Add/Remove Users</p>
    <div style={{width: '80%', display: 'box', 
                 marginLeft: 'auto', marginRight: 'auto'}}>
      <BoxMembersList members={membersList.users} />
    </div>
  </>);
}

export default BoxMembersPage;