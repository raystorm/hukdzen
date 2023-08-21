import React, { useEffect, useState } from 'react';
import {matchPath, useLocation} from "react-router-dom";
import { Typography } from '@mui/material';

import { useAppSelector } from "../../app/hooks";
import RecentDocuments from '../widgets/RecentDocuments';
import DocumentDetailsForm from '../forms/DocumentDetails';
import {DASHBOARD_PATH} from "../shared/constants";

//TODO: Localize this: 
export const docDetailsFormTitle = 
       "txa'nii hałelsa goo dzabn (Selected Document Details)";

export const DocDetailsLinkText = 'Full Document Details.';


const Dashboard = () =>
{
   const location = useLocation();
   const skipRender = (): boolean => !matchPath(DASHBOARD_PATH, location.pathname);

   const docDeets= useAppSelector(state => state.document);
    
   //LOAD documents List once, Sort/Filter, in the UI?

   const[itemId, setItemId] = useState(docDeets.id);

   let itemUrl = `/item/${itemId}`;
   useEffect(() => {
       if ( skipRender() ) { return; }
       setItemId(docDeets.id)
       itemUrl = `/item/${docDeets.id}`;
   } ,[docDeets])

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
             <Typography component='a' href={itemUrl}>
               {DocDetailsLinkText}
             </Typography>
           </p>
           <DocumentDetailsForm pageTitle={docDetailsFormTitle}
                                editable={false} doc={docDeets} />
         </div>
     </div>
   );
}

export default Dashboard;