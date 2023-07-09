import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

import {Button} from "@mui/material";
import { GridRowsProp, GridColDef, GridEventListener } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { useAppSelector } from '../../app/hooks';
import { authorListActions } from './authorListSlice'
import { ClanEnum, printClanType } from "../../Gyet/ClanType";
import AuthorForm from '../../components/forms/AuthorForm';
import { authorActions } from '../authorSlice';
import {Author} from "../AuthorType";
import {AUTHOR_NEW_PATH, AUTHORLIST_PATH, SEARCH_PATH} from "../../components/shared/constants";
import {matchPath, useLocation} from "react-router-dom";

export interface UserListPageProps { };

export const AuthorListPageTitle = "'Niism Na T'amt (Authors)";

const AuthorListPage = (props: UserListPageProps) =>
{
  const location = useLocation();
  const skipRender = (): boolean => !matchPath(AUTHORLIST_PATH, location.pathname);

  const dispatch = useDispatch();

  let authorList = useAppSelector(state => state.authorList);

  useEffect(() => {
    if ( skipRender() ) { return; }
    dispatch(authorListActions.getAllAuthors());
    console.log('Loading Users List on Page Load.');
  }, []);

  let author = useAppSelector(state => state.author);

  useEffect(() => {
     if ( skipRender() ) { return; }
     console.log(`authorList updated. \n ${JSON.stringify(authorList)}`);
  }, [authorList]);

  const { getAuthorById, clearAuthor } = authorActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => 
  {
    if ( !event.ctrlKey ) { dispatch(getAuthorById(params.row.id)); }
    else { dispatch(clearAuthor()); }
    //setDocument(document+1);
    // console.log(`row ${event.ctrlKey? 'De':''}Selected with id: ${params.row.id}`);
  }

   let rows: GridRowsProp;
   if ( authorList && authorList.items && 0 < authorList.items.length )
   {
     rows = authorList.items.map( a => (
            { 
              id:    a?.id,
              name:  a?.name,
              waa:   a?.waa,
              clan:  printClanType(a?.clan),
              email: a?.email,
            }
     ));
   }
   else 
   { 
     rows = [{
       id: '', name: 'ERROR', waa: 'authors', clan: null, email: 'not loaded'
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
         <h2 style={{textAlign: 'center'}}>{AuthorListPageTitle}</h2>
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
            <div>
              <Button href={AUTHOR_NEW_PATH} variant='outlined'>
                Load New Author Form
              </Button>
            </div>
            <div>
              <AuthorForm author={author} />
            </div>
           </div>
         </div>
         <hr />
       </div>
     );
}

export default AuthorListPage;