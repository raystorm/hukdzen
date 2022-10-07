import React from 'react';
import RecentDocuments from '../widgets/RecentDocuments';
import UserDocuments from '../widgets/userDocuments';
import Document from '../widgets/Details';
import { DocumentDetails } from '../../types';


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

    const docDeets : DocumentDetails  = {
        id: '9470c8c5-1923-46fa-b164-ec5e32789193',
        name: 'Lorem Isum',
        description: 'consectetur adipiscing elit',
        author: 'J Doe',
        filePath: '/path/to/file/',
        created: new Date(),
        updated: new Date(),
        version: 1,
        nahawtBC: 'sed do eiusmod tempor',
        magonBC: 'incididunt ut labore et dolore magna aliqua. ',
        nahawtAK: 'Ut enim ad minim veniam,',
        magonAK: 'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }

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
              <Document pageTitle='Selected Document Details'
                        {...docDeets} />
            </div>            
            <div style={{clear: 'both'}} />
        </div>
    );
}