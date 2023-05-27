import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../app/hooks';
import { printUser } from '../User/userType';
import { boxActions } from './boxSlice';
import BoxMembersList from './BoxMembersList';
import { userListActions } from '../User/UserList/userListSlice';

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

  const dispatch = useDispatch();

  const { id } = useParams(); //Box Id, from URL
  console.log(`BoxId: ${id}`);

  const membersList = useAppSelector(state => state.userList);

  useEffect(() => {
     dispatch(boxActions.getBoxById(id));
     dispatch(userListActions.getAllUsersForBoxId(id))
  }, [id]);

  const box = useAppSelector(state => state.box);

  console.log(`Box to Edit: ${box.name}`);

  return (<>
    <h2>Xbiis Members</h2>
    <h3><strong>Name:</strong> {box.name}</h3>
    <h4><strong>Owner:</strong> {printUser(box.owner)}</h4>
    <p>Page to Add/Remove Users</p>
    <div style={{width: '80%', display: 'box', 
                 marginLeft: 'auto', marginRight: 'auto'}}>
      <BoxMembersList members={membersList.items} />
    </div>
  </>);
}

export default BoxMembersPage;