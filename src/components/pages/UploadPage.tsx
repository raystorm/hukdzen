import React, { Component } from 'react';

import { v4 as randomUUID } from 'uuid';

import { useAppSelector } from "../../app/hooks";
import { initialDocumentDetail } from '../../docs/initialDocumentDetails';
import DocumentDetailsForm from '../forms/DocumentDetails';


interface UploadProps {

}

//TODO: translate this
export const title = 'Upload a New Smalgyax Document';

const UploadPage = (props: UploadProps) =>
{
   const author = useAppSelector(state => state.user);
   //const id = crypto.randomUUID();
   const id = randomUUID();

   return (
     <>
     <DocumentDetailsForm 
        pageTitle={title}
        editable={true} { ...initialDocumentDetail }
        authorId={author} id={id} isNew={true}
        />
     </>
   );
}

export default UploadPage;
