import React, { useEffect } from 'react'
import { useDispatch, } from 'react-redux'

import { GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { useAppSelector } from '../../app/hooks';
import { boxListActions } from './BoxListSlice';
import { printRole } from '../../Role/roleTypes';
import BoxForm from '../../components/forms/BoxForm';
import { boxActions } from '../boxSlice';
import { emptyGyet, printUser } from '../../User/userType';
import {emptyXbiis} from "../boxTypes";


type BoxListPageProps = {}

const BoxListPage = (props: BoxListPageProps) => 
{  
  const dispatch = useDispatch();
  let boxList = useAppSelector(state => state.boxList);

  useEffect(() => {
    dispatch(boxListActions.getAllBoxes(undefined));
    console.log('Loading Boxes List on Page Load.');
  }, []);

  let box = useAppSelector(state => state.box);

  useEffect(() => {
    if ( box?.id !== emptyXbiis.id )
    {
       dispatch(boxActions.getBox(box));
       console.log(`Loading Box on Page Load. (${box.id})`);
    }
  }, []);

  const { getBoxById, setBox } = boxActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => 
  {
    // console.log(`Box Table Row Clicked ${JSON.stringify(params.row.id)}`);
    if ( !event.ctrlKey ) { dispatch(getBoxById(params.row.id)); }
    else { dispatch(setBox(undefined)); }
    //setDocument(document+1);
    console.log(`row ${event.ctrlKey? 'De':''}Selected with id: ${params.row.id}`);
  }

  console.log(`boxList: ${JSON.stringify(boxList)}`);
  //console.log(`boxList len: ${boxList.boxes? boxList.boxes.length : 0}`);
  let rows: GridRowsProp;
  if ( boxList && boxList.items && 0 < boxList.items.length )
  {
     rows = boxList.items.map( b => (
            {
              id:          b?.id,
              name:        b?.name,
              owner:       b?.owner ? printUser(b.owner) : '',
              defaultRole: printRole(b?.defaultRole),
            }
     ));
  }
  else 
  { 
     rows = [{
       id: '', name: 'ERROR', owner: 'Boxes', defaultRole: 'Not Loaded',
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
       field: 'owner',
       headerName: 'Owner',
       description: 'The person responsible for this box of Documents',
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
          {/* TODO: Il8n */}
         <h2 style={{textAlign: 'center'}}>Wilgoosgm Xbiism (Smart Boxes)</h2>
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
};

export default BoxListPage;