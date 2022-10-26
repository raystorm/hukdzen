import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ReduxState } from '../../app/reducers';
import ReduxStore from '../../app/store';
import { documentActions } from '../../documents/documentSlice';
import { DocumentDetails } from '../../documents/DocumentTypes';
import DocumentDetailsForm from '../forms/DocumentDetails';


export default function ItemPage()
{
   const { itemId } = useParams(); //Item 
   console.log(`ItemId: ${itemId}`);

   useEffect(() => {
     ReduxStore.dispatch(documentActions.selectDocumentById(itemId));
   }, [itemId]);

   const docDeets = useSelector<ReduxState, DocumentDetails>
                               (state => state.document);

   return <DocumentDetailsForm pageTitle='Item Details' 
                               editable={true} isVersion={true}
            { ...docDeets }
          />
}