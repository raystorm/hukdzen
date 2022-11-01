import React, { useEffect } from 'react'
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux'

import { GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { userListActions } from './userListSlice';
import { gyigyet } from './userListType';
import { ClanType, printClanType } from '../userType';

type UserListPageProps = {}

const UserListPage = (props: UserListPageProps) => 
{
  let userList = useSelector<ReduxState, gyigyet>(state => state.userList);

  useEffect(() => { 
    ReduxStore.dispatch(userListActions.getAllUsers(undefined));
    console.log('Loading Users List on Page Load.');
    console.log(JSON.stringify(ReduxStore.getState().userList));    
  }, []);

   //extract out desired fields from documents list, flattens out LangFields
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
         <div style={{display: 'flex', height: '100%'}}>
           <div style={{ flexGrow: 1 }} >
             <DataGrid autoHeight 
                       //onRowClick={handleRowClick}
                       rows={rows} columns={cols} 
                       columnVisibilityModel={{id: false }} 
                       components={{Toolbar:GridToolbar}}/>
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