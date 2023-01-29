import React, { Component } from 'react';
import { useSelector } from 'react-redux';
import { v4 as randomUUID } from 'uuid';

import { initialDocumentDetail } from '../../docs/initialDocumentDetails';
import DocumentDetailsForm from '../forms/DocumentDetails';
import { ReduxState } from '../../app/reducers';
import { Gyet } from '../../User/userType';

interface UploadProps {

}

//TODO: translate this
export const title = 'Upload a New Smalgyax Document';

const UploadPage = (props: UploadProps) =>
{
   const author = useSelector<ReduxState, Gyet>(state => state.user);
   //const id = crypto.randomUUID();
   const id = randomUUID();

   return (
     <>
     <DocumentDetailsForm 
        pageTitle={title}
        editable={true} { ...initialDocumentDetail }
        authorId={author.id} id={id} isNew={true}
        />
     </>
   );
}

export default UploadPage;
