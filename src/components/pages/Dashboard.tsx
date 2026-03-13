import React, { useCallback, useEffect, useState } from 'react';
import {matchPath, useLocation} from "react-router";
import { Typography } from '@mui/material';

import { useAppSelector } from "../../app/hooks";
import { useSkipRender } from '../hooks/useSkipRender';

import RecentDocuments from '../widgets/RecentDocuments';
import DocumentDetailsForm from '../forms/DocumentDetails';
import { DASHBOARD_PATH } from "../shared/constants";

//TODO: Localize this: 
export const docDetailsFormTitle = 
       "txa'nii hałelsa goo dzabn (Selected Document Details)";

export const DocDetailsLinkText = 'Full Document Details.';


const Dashboard = () =>
{
   const skipRender = useSkipRender(DASHBOARD_PATH);

   const docDeets= useAppSelector(state => state.document.item);
    
   //LOAD documents List once, Sort/Filter, in the UI?

   const[itemId,  setItemId]  = useState(docDeets.id);
   const[itemUrl, setItemUrl] = useState(`/item/${itemId}`);

   useEffect(() => {
       if ( skipRender() ) { return; }
       setItemId(docDeets.id)
       if ( docDeets.id ) { setItemUrl(`/item/${docDeets.id}`); }
       else { setItemUrl('#'); }
   }, [docDeets, skipRender])

   if ( skipRender() ) { return <></>; }

   // Configurable dashboard
   return (
     <div className='twoColumn'>
       <div>
         <RecentDocuments />
          {/* <UserDocuments /> */}
       </div>
         <div>
           <p>
              {/* TODO: look into <Link> */}
              { itemId ? (
                 <Typography component='a' href={itemUrl}>
                    {DocDetailsLinkText}
                 </Typography>
              ) : (
                  <Typography component='span' style={{ color: '#4D5157' }}>
                     {DocDetailsLinkText}
                  </Typography>
              )}
           </p>
           <DocumentDetailsForm pageTitle={docDetailsFormTitle}
                                editable={false} doc={docDeets} />
         </div>
     </div>
   );
}

export default Dashboard;