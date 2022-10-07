import React from 'react';
import RecentDocuments from '../widgets/RecentDocuments';
import UserDocuments from '../widgets/userDocuments';



export default function Dashboard()
{
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
            </div>
            <div style={{clear: 'both'}} />
        </div>
    );
}