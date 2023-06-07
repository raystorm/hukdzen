import React, { Component } from 'react';

import { v4 as randomUUID } from 'uuid';

import { useAppSelector } from "../../app/hooks";
import { emptyDocumentDetails } from '../../docs/initialDocumentDetails';
import DocumentDetailsForm from '../forms/DocumentDetails';


interface UploadProps {

}

//TODO: translate this
export const title = 'Upload a New Smalgyax Document';

const UploadPage = (props: UploadProps) =>
{
   const user = useAppSelector(state => state.user);
   const author = useAppSelector(state => state.author)
   //const id = crypto.randomUUID();
   const id = randomUUID();

   return (
     <>
     <DocumentDetailsForm 
        pageTitle={title}
        editable={true} { ...emptyDocumentDetails }
        id={id} isNew={true}
        author={author} docOwner={user}
        />
     </>
   );
}

export default UploadPage;
