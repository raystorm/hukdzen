import React from 'react';
import RecentDocuments from '../widgets/RecentDocuments';
import UserDocuments from '../widgets/userDocuments';
import Document from '../widgets/Details';
import { DocumentDetails } from '../../types';
import { initialDocumentDetail } from '../../types/initialValues';
import { BarChart, Description } from '@mui/icons-material';
import { Typography } from '@mui/material';
import docs from '../../types/__mocks__/docList.json';


export default function Dashboard()
{
    //TODO: Logic to generate and pass in Document details

/*
    Lorem ipsum dolor sit amet, 
    consectetur adipiscing elit, 
    sed do eiusmod tempor 
    incididunt ut labore et dolore magna aliqua. 
    Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. */

    /*
    const docDeets : DocumentDetails  = {
        ...initialDocumentDetail,
        id: '9470c8c5-1923-46fa-b164-ec5e32789193',
        title: 'Lorem Isum',
        description: 'consectetur adipiscing elit',
        author: 'J Doe',
        filePath: '/path/to/file/',
        created: new Date(),
        updated: new Date(),
        version: 1,        
        /*
        nahawtBC: '',
        magonBC:  '',
        nahawtAK: '',
        magonAK: ''
        // * /
    }

    //TODO: move this into the constructor above
    docDeets.bc.title.value = 'sed do eiusmod tempor';
    docDeets.bc.description.value = 'incididunt ut labore et dolore magna aliqua.';
    docDeets.ak.title.value = 'Ut enim ad minim veniam,';
    docDeets.ak.description.value = 'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    */

    const docDeets: DocumentDetails = docs.documents[0];

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
              <Document pageTitle='Selected Document Details'
                        {...docDeets} />
            </div>            
            <div style={{clear: 'both'}} />
        </div>
    );
}