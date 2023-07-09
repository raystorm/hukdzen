import React, { Component } from 'react';

import { v4 as randomUUID } from 'uuid';

import { useAppSelector } from "../../app/hooks";
import { emptyDocumentDetails } from '../../docs/initialDocumentDetails';
import DocumentDetailsForm from '../forms/DocumentDetails';
import {matchPath, useLocation} from "react-router-dom";
import {DASHBOARD_PATH, UPLOAD_PATH} from "../shared/constants";


interface UploadProps {

}

//TODO: translate this
export const title = 'Upload a New Smalgyax Document';

const UploadPage = (props: UploadProps) =>
{
   const location = useLocation();
   const skipRender = (): boolean => !matchPath(UPLOAD_PATH, location.pathname);

   const user = useAppSelector(state => state.user);
   const author = useAppSelector(state => state.author)
   //const id = crypto.randomUUID();
   const id = randomUUID();

   if ( skipRender() ) { return <></>; }

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
