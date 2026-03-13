import React, {useEffect, useState} from 'react';
import {matchPath, useLocation} from "react-router";
import { v4 as randomUUID } from 'uuid';

import { useAppSelector } from "../../app/hooks";
import { emptyDocument } from '../../docs/initialDocumentDetails';
import DocumentDetailsForm from '../forms/DocumentDetails';
import {UPLOAD_PATH} from "../shared/constants";
import {Document} from "../../docs/DocumentTypes";
import {DefaultBox} from "../../Box/boxTypes";


interface UploadProps {

}

//TODO: translate this
export const title = 'Upload a New Smalgyax Document';

const UploadPage = (props: UploadProps) =>
{
   const location = useLocation();
   const skipRender = (): boolean => !matchPath(UPLOAD_PATH, location.pathname);

   const user    = useAppSelector(state => state.user);
   const author  = useAppSelector(state => state.author);
   const initDoc = useAppSelector(state => state.document.item);

   const docGen = (): Document => {
      console.log('resetting doc object');
      if ( emptyDocument !== initDoc) { return initDoc; }
      return {
         ...emptyDocument,
         id:                        randomUUID(),
         author:                    author,
         contentOwner:              user,
         version:                   0,
         box:                       DefaultBox,
         documentAuthorId:          author.id,
         documentContentOwnerUserId: user.id,
         documentBoxXbiisId:        DefaultBox.id,
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
