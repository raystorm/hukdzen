import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import {matchPath, useLocation, useParams} from 'react-router-dom';

import { useAppSelector } from '../app/hooks';
import { printGyet } from '../Gyet/GyetType';
import { boxActions } from './boxSlice';
import BoxMembersList from './BoxMembersList';
import {ADMIN_BOXMEMBERS_PATH} from "../components/shared/constants";
import {boxUserListActions} from "../BoxUser/BoxUserList/BoxUserListSlice";

export interface BoxMemberProps {

}

const BoxMembersPage = (props: BoxMemberProps) => 
{
  /*
   * Steps:
   *   1. Load Box from Box Id in page URL
   *   2. Load/Display current Members.
   *   3. Form for adding new Users.
   *   4. Remove current users
   *   5. Disable Add/Edit for "Default Group."
   */
  const location = useLocation();
  const skipRender = (): boolean => !matchPath(ADMIN_BOXMEMBERS_PATH, location.pathname);

  console.log(`${skipRender()} ${ADMIN_BOXMEMBERS_PATH} !== ${location.pathname}`)
  const dispatch = useDispatch();

  const { id } = useParams(); //Box Id, from URL
  console.log(`BoxId: ${id}`);

  useEffect(() => {
     if ( skipRender() ) { return; }
     const idString = `${id}`;
     dispatch(boxActions.getBoxById(idString));
     dispatch(boxUserListActions.getAllBoxUsersForBoxId(idString));
  }, [id]);

  const membersList = useAppSelector(state => state.boxUserList);
  const box = useAppSelector(state => state.box);

  console.log(`Box to Edit: ${box.name}`);
  console.log(`Members to Display (PAGE): ${JSON.stringify(membersList)}`);

  if ( skipRender() ) { return <></>; }
  return (<>
    <h2>Xbiis Members</h2>
    <h3><strong>Name:</strong> {box.name}</h3>
    <h4><strong>Owner:</strong> {printGyet(box.owner)}</h4>
    <p>Page to Add/Remove Users</p>
    <div style={{width: '80%', display: 'box', 
                 marginLeft: 'auto', marginRight: 'auto'}}>
      <BoxMembersList box={box} membersList={membersList} />
    </div>
  </>);
}

export default BoxMembersPage;