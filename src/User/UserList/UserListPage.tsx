import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

import { GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { useAppSelector } from '../../app/hooks';
import { userListActions } from './userListSlice'
import {ClanEnum, getClanFromName, printClanType} from "../../Gyet/ClanType";
import { userActions } from '../userSlice';
import UserForm from "../../components/forms/UserForm";
import {useLocation} from "react-router-dom";
import {ADMIN_USERLIST_PATH, SEARCH_PATH} from "../../components/shared/constants";

export interface UserListPageProps { };

const UserListPage = (props: UserListPageProps) => 
{
   const location = useLocation();
   const skipRender = (): boolean => ADMIN_USERLIST_PATH !== location.pathname;

   const dispatch = useDispatch();

  let userList = useAppSelector(state => state.userList);

  useEffect(() => {
     if ( skipRender() ) { return; }
     dispatch(userListActions.getAllUsers());
     console.log('Loading Users List on Page Load.');
  }, []);

  let user = useAppSelector(state => state.user);

  useEffect(() => {
     if ( skipRender() ) { return; }
     console.log(`userList updated. \n ${JSON.stringify(userList)}`);
  }, [userList]);

  const { getUserById, clearUser } = userActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => 
  {
    if ( !event.ctrlKey ) { dispatch(getUserById(params.row.id)); }
    else { dispatch(clearUser()); }
    //setDocument(document+1);
    // console.log(`row ${event.ctrlKey? 'De':''}Selected with id: ${params.row.id}`);
  }

   let rows: GridRowsProp;
   if ( userList && userList.items && 0 < userList.items.length )
   {
     rows = userList.items.map( u => (
            { 
              id:    u?.id,
              name:  u?.name,
              waa:   u?.waa,
              clan:  printClanType(getClanFromName(u?.clan)),
              email: u?.email,
            }
     ));
   }
   else 
   { 
     rows = [{
       id: '', name: 'ERROR', waa: 'users', clan: null, email: 'not loaded'
     }]; 
   };

   console.log(`loaded rows: ${JSON.stringify(rows)}`);
 
   //map Fields to Cols for DataGrid
   const cols: GridColDef[] = [
     { field: 'id', },
     { 
       field: 'name',
       headerName: 'Name',
       description: 'English Name', //add smalgyax english/foreign here
       flex: 1, //width: 150,
     },
     { 
       field: 'waa',
       headerName: 'Waa',
       description: 'Smalgyax name',
       flex: 1, //width: 175,
     },
     { 
       field: 'clan', 
       headerName: 'Clan', 
       description: 'Clan or Crest',
       flex: 1, //width: 175,
     },
     { 
       field: 'email', 
       headerName: 'E-mail', 
       description: 'Email address',
       flex: 0.75 
     },
   ];

   if ( skipRender() ) { return <></>; }

   return ( 
       <div>
         <h2 style={{textAlign: 'center'}}>User Accounts</h2>
         <div className='twoColumn'>
           <div style={{display: 'flex', height: '100%'}}>
             <div style={{ flexGrow: 1 }} >
               <DataGrid autoHeight
                         onRowClick={handleRowClick}
                         rows={rows} columns={cols}
                         columnVisibilityModel={{id: false }}
                         components={{Toolbar:GridToolbar}} />
             </div>
           </div>
           <div>
            <UserForm user={user} />
           </div>
         </div>
         <hr />
       </div>
     );
}

export default UserListPage;