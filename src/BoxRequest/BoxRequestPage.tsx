import React, { useCallback } from 'react';

import { useSkipRender } from "../components/hooks/useSkipRender";

import BoxRequestForm from './BoxRequestForm';
import { emptyBoxRequest } from '../BoxRequest/boxRequestType';
import { BOX_REQUEST_NEW_PATH } from '../components/shared/constants';

const BoxRequestPage: React.FC = () =>
{
   const skipRender = useSkipRender(BOX_REQUEST_NEW_PATH);

   if ( skipRender() ) { return <></>; }

   return (
      <div style={{ display: 'flex', flexDirection: 'column',
                    alignItems: 'center', padding: '2em' }}>
         <h1>Request a New Box</h1>
         <p>Submit a request to create a new box for organizing your documents.</p>
         <div style={{ width: '100%', maxWidth: '50em', display: 'flex',
                       justifyContent: 'center' }}>
            <BoxRequestForm
               boxRequest={emptyBoxRequest}
               mode='create'
            />
         </div>
      </div>
   );
};

export default BoxRequestPage;
