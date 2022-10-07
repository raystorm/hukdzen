import { connect } from 'react-redux'
import React, { Component, ReactComponentElement } from 'react'
import { ReactComponent } from 'tss-react/tools/ReactComponent';
import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid';
import { height } from '@mui/system';

interface DocTableProps {
    title: string;
    documents?: GridRowsProp; //TODO: Documents Type
    columns?: GridColDef[];
};

const Documents: React.FC<DocTableProps> = (docTableProps) =>
{
  const { title } = docTableProps;  

  //TODO: move into 
  const rows: GridRowsProp = [
    {
      id: 1,
      name: 'Lorem ipsum',
      nahawtBC: 'dolor sit amet',
      nahawtAK: 'consectetur,',
      author: 'adipisicing elit.',
    },
    {
      id: 2,
      name: 'Doloribus',
      nahawtBC: 'nostrum',
      nahawtAK: 'iusto possimus',
      author: 'quas totam,',
    },
    {
      id: 3,
      name: 'sed mollitia,',
      nahawtBC: 'cumque nisi voluptate explicabo',
      nahawtAK: 'quis et velit in quae officiis,',
      author: 'quibusdam enim?',
    }
  ];

  const cols: GridColDef[] = [
    { field: 'id', },
    { field: 'name',     headerName: 'Document Name', width: 150, },
    { field: 'nahawtBC', headerName: 'Nahawt (BC)', 
      description: 'Title of the Document in BC (Dunn) Orthography', 
      flex: 1, //width: 175,
    },
    { field: 'nahawtAK', headerName: 'Nahawt (AK)', 
      description: 'Title of the Document in AK Orthography',    
      flex: 1, //width: 175,  
    },
    { field: 'author',   headerName: 'Auhthor Name', flex: 0.75 },
  ];

  return (      
      <div>
        <h2 style={{textAlign: 'center'}}>{title}</h2>
        {/* TODO: response size the parent DIV */}
        <div style={{display: 'flex', height: '100%'}}>
          <div style={{ flexGrow: 1 }} >
            <DataGrid autoHeight
                      rows={rows} columns={cols} 
                      columnVisibilityModel={{id: false }} 
                      components={{Toolbar:GridToolbar}}/>
          </div>        
        </div>
        <hr />
      </div>
    );
};

export default Documents;