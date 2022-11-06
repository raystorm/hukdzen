import React, { useEffect } from 'react'
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux'

import { GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import ReduxStore from '../../app/store';
import { ReduxState } from '../../app/reducers';
import { boxListActions } from './BoxListSlice';
import { BoxList } from './BoxListType';
import { RoleType, Xbiis, printRole } from '../boxTypes';
import BoxForm from '../../components/forms/BoxForm';
import { boxActions } from '../boxSlice';


type BoxListPageProps = {}

const BoxListPage = (props: BoxListPageProps) => 
{  
  let boxList = useSelector<ReduxState, BoxList>(state => state.boxList);

  useEffect(() => { 
    ReduxStore.dispatch(boxListActions.getAllBoxes(undefined));
    console.log('Loading Boxes List on Page Load.');
    //console.log(JSON.stringify(ReduxStore.getState().userList));
  }, []);

  let box = useSelector<ReduxState, Xbiis>(state => state.box);

  useEffect(() => { 
    ReduxStore.dispatch(boxActions.getSpecifiedBox(box));
    console.log('Loading Box on Page Load.');
    console.log(JSON.stringify(ReduxStore.getState().user));
  }, [box]);

  const { getSpecifiedBoxById, setSpecifiedBox } = boxActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => 
  {
    if ( !event.ctrlKey )
    { ReduxStore.dispatch(getSpecifiedBoxById(params.row.id)); }
    else { ReduxStore.dispatch(setSpecifiedBox(null)); }
    //setDocument(document+1);
    console.log(`row ${event.ctrlKey? 'De':''}Selected with id: ${params.row.id}`);
  }

  //console.log(`boxList: ${JSON.stringify(boxList)}`);
  //console.log(`boxList len: ${boxList.boxes? boxList.boxes.length : 0}`);
  let rows: GridRowsProp;
  if ( boxList.boxes && 0 < boxList.boxes.length )
  {
     rows = boxList.boxes.map( b => (
            { 
              id:          b.id, 
              name:        b.name, 
              ownerId:     b.ownerId,
              defaultRole: printRole(b.defaultRole),
            }
     ));
  }
  else 
  { 
     rows = [{
       id:          '',
       name:        'ERROR',
       ownerId:     'Boxes',
       defaultRole: 'Not Loaded',
     }];
  };

   console.log(`loaded rows: ${JSON.stringify(rows)}`);
 
   //map Fields to Cols for DataGrid
   const cols: GridColDef[] = [
     { field: 'id', },
     { 
       field: 'name',
       headerName: 'Name',
       description: 'Name',
       flex: 1, //width: 150,
     },
     { 
       field: 'ownerId',
       headerName: 'Owner Id',
       description: 'Id of the person responsible for this box of Documents',
       flex: 1, //width: 175,
     },
     { 
       field: 'defaultRole', 
       headerName: 'Default Role', 
       description: 'Default Role to apply to users when accessing content',
       flex: 1, //width: 175,
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
            <BoxForm box={box} />
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