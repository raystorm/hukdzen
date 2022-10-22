import { connect, useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { ReduxState } from '../../app/reducers';
import { 
         DataGrid, 
         GridColDef, 
         GridRowsProp,
         GridToolbar,
         GridEventListener
       } from '@mui/x-data-grid';
import { store } from '../../app/store';
import { DocumentDetails } from '../../documents/DocumentTypes';
import { DocumentDetailsFieldDefintion } from '../../types/fieldDefitions'
import { documentActions } from '../../documents/documentSlice'


interface DocTableProps 
{
  title: string;
  documents: DocumentDetails[];
  //documents?: GridRowsProp; //TODO: Documents Type
  //columns?: GridColDef[];
};

const DocumentsTable: React.FC<DocTableProps> = (docTableProps) =>
{

  const { title, documents } = docTableProps;
  //const [ document, setDocument ] = useStore().getState();
  const { selectDocument, selectDocumentById } = documentActions;
  const dispatch = useDispatch();


  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    store.dispatch(selectDocumentById(params.row.id));
    //setDocument(document+1);
    console.log('row Selected with id: ' + params.row.id);
  }

  useEffect(() =>{ console.log('Table Effect') });

  //extract out desired fields from documents list, flattens out LangFields
  const rows: GridRowsProp = documents.map(doc => (
    {
      id: doc.id,
      title: doc.title,
      nahawtBC: doc.bc.title,
      nahawtAK: doc.ak.title,
      authorId: doc.authorId
    }));
  

  //map Fields to Cols for DataGrid
  const ddfd = DocumentDetailsFieldDefintion;
  const cols: GridColDef[] = [
    { field: 'id', },
    { 
      field: ddfd.title.name,
      headerName: ddfd.title.label,
      description: ddfd.title.description,
      flex: 1, //width: 150, 
    },
    { 
      field: ddfd.bc.title.name,
      headerName: ddfd.bc.title.label,
      description: ddfd.bc.title.description,
      flex: 1, //width: 175,
    },
    { 
      field: ddfd.ak.title.name, 
      headerName: ddfd.ak.title.label, 
      description: ddfd.ak.title.description,
      flex: 1, //width: 175,  
    },
    { 
      field: ddfd.authorId.name, 
      headerName: ddfd.authorId.label, 
      description: ddfd.authorId.description,
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


const mapStateToProps = (state: ReduxState) => (state);

const mapDispatchToProps = { ...documentActions };


export default connect(mapStateToProps, mapDispatchToProps)(DocumentsTable);