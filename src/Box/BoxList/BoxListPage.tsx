import React, { useEffect } from 'react'
import { useDispatch, } from 'react-redux'

import { GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { useAppSelector } from '../../app/hooks';
import { boxListActions } from './BoxListSlice';
import { printRole } from '../../Role/roleTypes';
import BoxForm from '../../components/forms/BoxForm';
import { boxActions } from '../boxSlice';
import { printGyet } from "../../Gyet/GyetType";
import {emptyXbiis} from "../boxTypes";
import {matchPath, useLocation} from "react-router-dom";
import {ADMIN_BOXLIST_PATH} from "../../components/shared/constants";


type BoxListPageProps = {}

const BoxListPage = (props: BoxListPageProps) => 
{
   const location = useLocation();
   const skipRender = (): boolean => !matchPath(ADMIN_BOXLIST_PATH, location.pathname);

   const dispatch = useDispatch();
   let boxList = useAppSelector(state => state.boxList);
   let box = useAppSelector(state => state.box);

   useEffect(() => {
      if ( skipRender() ) { return; }
      dispatch(boxListActions.getAllBoxes());
      console.log('Loading Boxes List on Page Load.');
      /*
      if ( box?.id !== emptyXbiis.id )
      {
         dispatch(boxActions.setBox(box));
         console.log(`Loading Box on Page Load. (${box.id})`);
      }
      */
   }, []);

   const { getBoxById, setBox } = boxActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => 
  {
    // console.log(`Box Table Row Clicked ${JSON.stringify(params.row.id)}`);
    if ( !event.ctrlKey ) { dispatch(getBoxById(params.row.id)); }
    else { dispatch(setBox(emptyXbiis)); }
    //setDocument(document+1);
    console.log(`row ${event.ctrlKey? 'De':''}Selected with id: ${params.row.id}`);
  }

  console.log(`boxList: ${JSON.stringify(boxList)}`);
  //console.log(`boxList len: ${boxList.boxes? boxList.boxes.length : 0}`);
  let rows: GridRowsProp;
  //TODO: use `boxList.items` directly, and remove mangling
  if ( boxList && boxList.items && 0 < boxList.items.length )
  {
     rows = boxList.items.map( b => (
            {
              id:          b?.id,
              name:        b?.name,
              waa:         b?.waa,
              owner:       b?.owner ? printGyet(b.owner) : '',
              defaultRole: printRole(b?.defaultRole),
            }
     ));
  }
  else { rows = []; };

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
       field: 'waa',
       headerName: 'Waa',
       description: 'Smalgyax Name',
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

   if ( skipRender() ) { return <></>; }

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
            <BoxForm box={box} isAdminForm />
           </div>
         </div>
         <hr />
       </div>
     );
};

export default BoxListPage;