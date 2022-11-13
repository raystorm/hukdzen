import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import RecentDocuments from '../widgets/RecentDocuments';
import UserDocuments from '../widgets/UserDocuments';
import DocumentDetailsForm from '../forms/DocumentDetails';
import { DocumentDetails } from '../../documents/DocumentTypes';
import { ReduxState } from '../../app/reducers';


export default function Dashboard()
{
    const docDeets = useSelector<ReduxState, DocumentDetails>
                                (state => state.document);
    
    //LOAD documents List once, Sort/Filter, in the UI?

    const[itemId, setItemId] = useState(docDeets.id);

    let itemUrl = `/item/${itemId}`;
    useEffect(() => {
       setItemId(docDeets.id)
       itemUrl = `/item/${docDeets.id}`;
      } ,[docDeets])

    // Configurable dashboard
    return (
        <div className='twoColumn'>
            <div>
              <RecentDocuments />
              <UserDocuments />
            </div>
            <div>
              <p>
                <Typography component='a' href={itemUrl}>
                    Full Document Details.
                </Typography>
              </p>
              <DocumentDetailsForm pageTitle="txa’nii hałelsa goo dzabn (Selected Document Details)"
                                   editable={false} {...docDeets} />
            </div>
        </div>
    );
}