import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RecentDocuments from '../widgets/RecentDocuments';
import UserDocuments from '../widgets/userDocuments';
import DocumentDetailsForm from '../forms/DocumentDetails';
import { DocumentDetails } from '../../documents/DocumentTypes';
import { initialDocumentDetail } from '../../documents/initialDocumentDetails';
import { BarChart, Description } from '@mui/icons-material';
import { Typography } from '@mui/material';
import docs from '../../data/docList.json';
import { ReduxState } from '../../app/reducers';
import documentSlice from '../../documents/documentSlice';


export default function Dashboard()
{
    //TODO: Logic to generate and pass in Document details
    
    const docDeets = useSelector<ReduxState, DocumentDetails>(state => state.document);
    

    // TODO: Configurable dashboard
    // TODO: Recent Documents Widget
    // TODO: Owned Documents Widget
    // TODO: Document details view
    return (
        <div>
            <div className='left' >
              {/* TODO: Replace w/ Recent Documents Widget (limit/scroll) */}
              <RecentDocuments />
              {/* TODO: Replace w/ Owned/Authored Documents Widget (limit/scroll) */}
              <UserDocuments />
            </div>            
            {/* TODO: float right */}
            <div className='right'>              
              <p>Detail Properties for Selected Document</p>  
              <p>link to go to full document properties</p>
              <p>download a copy</p>
              <p>
                {/* TODO: update link with ID */}
                <Typography component='a' href="/item/:itemId">
                    Full Document Details.
                </Typography>
              </p>
              <DocumentDetailsForm pageTitle='Selected Document Details'
                        {...docDeets} />
            </div>            
            <div style={{clear: 'both'}} />
        </div>
    );
}