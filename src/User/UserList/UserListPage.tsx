import React, { useEffect } from 'react'
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';

import { GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { gyigyet } from './userListType';
import { userListActions } from './userListSlice';
import { Gyet } from '../userType';
import { ClanType, printClanType } from "../ClanType";
import UserForm from '../../components/forms/UserForm';
import { userActions } from '../userSlice';


type UserListPageProps = {}

const UserListPage = (props: UserListPageProps) => 
{

  let userList = useSelector<ReduxState, gyigyet>(state => state.userList);

  useEffect(() => { 
    ReduxStore.dispatch(userListActions.getAllUsers(undefined));
    console.log('Loading Users List on Page Load.');
    //console.log(JSON.stringify(ReduxStore.getState().userList));
  }, []);

  let user = useSelector<ReduxState, Gyet>(state => state.user);

  useEffect(() => { 
    ReduxStore.dispatch(userActions.getSpecifiedUser(user));
    console.log('Loading User on Page Load.');
    console.log(JSON.stringify(ReduxStore.getState().user));
  }, [user]);

  const { getSpecifiedUserById, setSpecifiedUser } = userActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => 
  {
    if ( !event.ctrlKey )
    { ReduxStore.dispatch(getSpecifiedUserById(params.row.id)); }
    else { ReduxStore.dispatch(setSpecifiedUser(null)); }
    //setDocument(document+1);
    console.log(`row ${event.ctrlKey? 'De':''}Selected with id: ${params.row.id}`);
  }

   let rows: GridRowsProp;
   if ( userList.users && 0 < userList.users.length )
   {
     rows = userList.users.map( u => (
            { 
              id: u.id, 
              name: u.name, 
              waa: u.waa, 
              clan: printClanType(u.clan),
              email: u.email, 
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
   
   return ( 
       <div>
         <h2 style={{textAlign: 'center'}}>User Accounts</h2>
         {/* TODO: response size the parent DIV */}
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
/*
const mapStateToProps = (state: ReduxState) => (state);

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(UserListPage);
*/
export default UserListPage;