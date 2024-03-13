import React, {useEffect, useState} from 'react';
import {matchPath, useLocation} from "react-router-dom";
import { v4 as randomUUID } from 'uuid';

import { useAppSelector } from "../../app/hooks";
import { emptyDocumentDetails } from '../../docs/initialDocumentDetails';
import DocumentDetailsForm from '../forms/DocumentDetails';
import {UPLOAD_PATH} from "../shared/constants";
import {DocumentDetails} from "../../docs/DocumentTypes";
import {DefaultBox} from "../../Box/boxTypes";


interface UploadProps {

}

//TODO: translate this
export const title = 'Upload a New Smalgyax Document';

const UploadPage = (props: UploadProps) =>
{
   const location = useLocation();
   const skipRender = (): boolean => !matchPath(UPLOAD_PATH, location.pathname);

   const user = useAppSelector(state => state.user);
   const author = useAppSelector(state => state.author);
   const initDoc = useAppSelector(state => state.document);

   const docGen = (): DocumentDetails => {
      console.log('resetting doc object');
      if ( emptyDocumentDetails !== initDoc) { return initDoc; }
      return {
         ...emptyDocumentDetails,
         id:                        randomUUID(),
         author:                    author,
         docOwner:                  user,
         version:                   0,
         box:                       DefaultBox,
         documentDetailsAuthorId:   author.id,
         documentDetailsDocOwnerId: user.id,
         documentDetailsBoxId:      DefaultBox.id,
      };
   }

   const doc = docGen();

   if ( skipRender() ) { return <></>; }

   return (
     <>
       <DocumentDetailsForm pageTitle={title} editable={true} isNew={true}
                            doc={doc}
       />
     </>
   );
}

export default UploadPage;
