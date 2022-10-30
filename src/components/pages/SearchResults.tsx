import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import DocumentDetailsForm from '../forms/DocumentDetails';
import { DocumentDetails } from '../../documents/DocumentTypes';
import { ReduxState } from '../../app/reducers';
import { documentListActions } from '../../documents/documentList/documentListSlice';
import ReduxStore from '../../app/store';
import DocumentsTable from '../widgets/DocumentsTable';


export default function SearchResults()
{
    //TODO: Logic to generate and pass in Document details
    
    const docDeets = useSelector<ReduxState, DocumentDetails>
                                (state => state.document);

    const[itemId, setItemId] = useState(docDeets.id);

    let itemUrl = `/item/${itemId}`;
    useEffect(() => {
       setItemId(docDeets.id)
       itemUrl = `/item/${docDeets.id}`;
      } ,[docDeets]);

  const urlSearchParams = new URLSearchParams(useLocation().search);
  const keywords = urlSearchParams.get('q');
  //TODO: get sortBy, Direction, and pagination details
      
  //Perform the search
  let docList = useSelector<ReduxState, DocumentDetails[]>
  (state => state.documentList);
  useEffect(() => { 
    ReduxStore.dispatch(documentListActions.searchForDocuments(keywords)); 
    console.log('Performing Search on Page Load.');
  }, []);

    return (
        <>
        <div>
          TODO: add a Search form here.
          <hr />
        </div>
        <div>
            <div className='left' >
              <DocumentsTable title='Search Results' documents={docList} />
            </div>
            {/* TODO: float right */}
            <div className='right'>              
              <p>Detail Properties for Selected Document</p>
              <p>link to go to full document properties</p>
              <p>download a copy</p>
              <p>
                <Typography component='a' href={itemUrl}>
                    Full Document Details.
                </Typography>
              </p>
              <DocumentDetailsForm pageTitle='Selected Document Details'
                                   editable={false} {...docDeets} />
            </div>
            <div style={{clear: 'both'}} />
        </div>
        </>
    );
}