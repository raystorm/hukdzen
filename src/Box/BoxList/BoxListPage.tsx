import React, { useEffect } from 'react'
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux'

import { GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { boxListActions } from './boxListSlice';
import { BoxList } from './boxListType';
import { RoleType, Xbiis, printRole } from '../boxTypes';
import UserForm from '../../components/forms/UserForm';
import { boxActions } from '../boxSlice';


type BoxListPageProps = {}

const BoxListPage = (props: BoxListPageProps) => 
{  
  let userList = useSelector<ReduxState, BoxList>(state => state.userList);

  useEffect(() => { 
    ReduxStore.dispatch(boxListActions.getAllBoxes(undefined));
    console.log('Loading Users List on Page Load.');
    //console.log(JSON.stringify(ReduxStore.getState().userList));
  }, []);

  let user = useSelector<ReduxState, Xbiis>(state => state.user);

  useEffect(() => { 
    ReduxStore.dispatch(boxActions.getSpecifiedBox(user));
    console.log('Loading User on Page Load.');
    console.log(JSON.stringify(ReduxStore.getState().user));
  }, [user]);

  const { getSpecifiedBoxById: getSpecifiedUserById, setSpecifiedBox: setSpecifiedUser } = boxActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => 
  {
    if ( !event.ctrlKey )
    { ReduxStore.dispatch(getSpecifiedUserById(params.row.id)); }
    else { ReduxStore.dispatch(setSpecifiedUser(null)); }
    //setDocument(document+1);
    console.log(`row ${event.ctrlKey? 'De':''}Selected with id: ${params.row.id}`);
  }

   let rows: GridRowsProp;
   if ( userList.boxes && 0 < userList.boxes.length )
   {
     rows = userList.boxes.map( u => (
            { 
              id: u.id, 
              name: u.name, 
              waa: u.waa, 
              clan: printRole(u.clan),
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
export default BoxListPage;