import React from 'react'
import { useDispatch } from 'react-redux'
import {
         DataGrid, 
         GridColDef, 
         GridRowsProp,
         GridToolbar,
         GridEventListener
       } from '@mui/x-data-grid';

import { DocumentFieldDefinition } from '../../types/fieldDefitions'
import { documentActions } from '../../docs/documentSlice'
import {ModelDocumentDetailsConnection} from "../../types/AmplifyTypes";
import {printGyet} from "../../Gyet/GyetType";
import {printBox} from "../../Box/boxTypes";
import {DocumentList} from "../../docs/docList/documentListTypes";


export interface DocTableProps 
{
  title: string;
  documents: DocumentList;
  //documents?: GridRowsProp; //TODO: Documents Type
  //columns?: GridColDef[];
}

const DocumentsTable: React.FC<DocTableProps> = (docTableProps) =>
{
  const dispatch = useDispatch();

  const { title, documents } = docTableProps;
  //const [ document, setDocument ] = useStore().getState();
  const { getDocumentById } = documentActions;

  const handleRowClick: GridEventListener<'rowClick'> = (params, event) => {
    if ( !event.ctrlKey ) { dispatch(getDocumentById(params.row.id)); }
    else { dispatch(documentActions.clearDocument()) }
    //else { dispatch(removeDocument(null)); }
    //setDocument(document+1);
    console.log('row', (event.ctrlKey? 'De':''),'Selected with id:', params.row.id);
  }

  //extract out desired fields from documents list, flattens out LangFields
  let rows: GridRowsProp = [];

  //console.log(`Documents to load ${JSON.stringify(documents)}`);

  //TODO: pass the full DocDetails items list
  if ( 0 < documents.items.length  )
  {
    rows = documents.items.map(doc => (
    {
      id:            doc?.id,
      eng_title:     doc?.eng?.title ?? '',
      bc_title:      doc?.bc?.title ?? '',
      ak_title:      doc?.ak?.title ?? '',
      box_name:      doc ? printBox(doc.box)           : 'Missing',
      author:        doc ? printGyet(doc.author)       : 'Missing',
      contentOwner:  doc ? printGyet(doc.contentOwner) : 'Missing',
    }));
  }

  //map Fields to Cols for DataGrid
  const ddfd = DocumentFieldDefinition;
  const cols: GridColDef[] = [
    { field: 'id', },
    {
      field:       ddfd.eng.title.name,
      headerName:  ddfd.eng.title.label,
      description: ddfd.eng.title.description,
      flex: 1, //width: 150, 
    },
    { 
      field:       ddfd.bc.title.name,
      headerName:  ddfd.bc.title.label,
      description: ddfd.bc.title.description,
      flex: 1, //width: 175,
    },
    { 
      field:       ddfd.ak.title.name,
      headerName:  ddfd.ak.title.label,
      description: ddfd.ak.title.description,
      flex: 1, //width: 175,  
    },
    {
      field:       ddfd.author.name,
      headerName:  ddfd.author.label,
      description: ddfd.author.description,
      flex: 0.75
    },
    { //TODO: use printBox
      field:       'box_name',
      headerName:  ddfd.box.label,
      description: ddfd.box.description,
      flex: 1
    },
    {
      field:       ddfd.contentOwner.name,
      headerName:  ddfd.contentOwner.label,
      description: ddfd.contentOwner.description,
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