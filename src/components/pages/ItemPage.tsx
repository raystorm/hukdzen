import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReduxStore from '../../app/store';
import { documentActions } from '../../documents/documentSlice';
import DocumentDetailsForm from '../forms/DocumentDetails';


export default function ItemPage()
{
   const { itemId } = useParams(); //Item 
   console.log(`ItemId: ${itemId}`);

   useEffect(() => {
     ReduxStore.dispatch(documentActions.selectDocumentById(itemId));
   }, [])
   
   return <DocumentDetailsForm pageTitle='Item Details' isVersion={true} 
            { ...ReduxStore.getState().document }
   />
}