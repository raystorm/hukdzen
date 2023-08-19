import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
         DataGrid, 
         GridColDef, 
         GridRowsProp,
         GridToolbar,
         GridEventListener
       } from '@mui/x-data-grid';

import { DocumentDetails } from '../../docs/DocumentTypes';
import { DocumentDetailsFieldDefinition } from '../../types/fieldDefitions'
import { documentActions } from '../../docs/documentSlice'
import {ModelDocumentDetailsConnection} from "../../types/AmplifyTypes";
import {printGyet} from "../../Gyet/GyetType";


export interface DocTableProps 
{
  title: string;
  documents: ModelDocumentDetailsConnection;
  //documents?: GridRowsProp; //TODO: Documents Type
  //columns?: GridColDef[];
};

const DocumentsTable: React.FC<DocTableProps> = (docTableProps) =>
{
  const dispatch = useDispatch();

  const { title, documents } = docTableProps;
  //const [ document, setDocument ] = useStore().getState();
  const { selectDocumentById, removeDocument } = documentActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => {
    if ( !event.ctrlKey ) { dispatch(selectDocumentById(params.row.id)); }
    else { dispatch(documentActions.clearDocument()) }
    //else { dispatch(removeDocument(null)); }
    //setDocument(document+1);
    console.log(`row ${event.ctrlKey? 'De':''}Selected with id: ${params.row.id}`);
  }

  //extract out desired fields from documents list, flattens out LangFields
  let rows: GridRowsProp = [];

  //console.log(`Documents to load ${JSON.stringify(documents)}`);

  if ( 0 < documents.items.length  )
  {
    rows = documents.items.map(doc => (
    {
      id:        doc?.id,
      eng_title: doc?.eng_title,
      bc_title:  doc?.bc_title,
      ak_title:  doc?.ak_title,
      author:    doc ? printGyet(doc.author) : 'Missing',
      docOwner:  doc ? printGyet(doc.docOwner) : 'Missing',
    }));
  }

  //map Fields to Cols for DataGrid
  const ddfd = DocumentDetailsFieldDefinition;
  const cols: GridColDef[] = [
    { field: 'id', },
    {
      field: ddfd.eng_title.name,
      headerName: ddfd.eng_title.label,
      description: ddfd.eng_title.description,
      flex: 1, //width: 150, 
    },
    { 
      field: ddfd.bc_title.name,
      headerName: ddfd.bc_title.label,
      description: ddfd.bc_title.description,
      flex: 1, //width: 175,
    },
    { 
      field: ddfd.ak_title.name,
      headerName: ddfd.ak_title.label,
      description: ddfd.ak_title.description,
      flex: 1, //width: 175,  
    },
    {
      field: ddfd.author.name,
      headerName: ddfd.author.label,
      description: ddfd.author.description,
      flex: 0.75
    },
    {
      field: ddfd.docOwner.name,
      headerName: ddfd.docOwner.label,
      description: ddfd.docOwner.description,
      flex: 0.75
    },
  ];
  
  return (      
      <div>
        <h2 style={{textAlign: 'center'}}>{title}</h2>
        {/* TODO: response size the parent DIV */}
        <div style={{display: 'flex', height: '100%'}}>
          <div style={{ flexGrow: 1 }} >
            <DataGrid autoHeight onRowClick={handleRowClick}
                      rows={rows} columns={cols} 
                      columnVisibilityModel={{id: false }} 
                      components={{Toolbar:GridToolbar}}/>
          </div>        
        </div>
        <hr />
      </div>
    );
};

export default DocumentsTable;