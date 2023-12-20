import React from 'react';
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
   const author = useAppSelector(state => state.author)
   //const id = crypto.randomUUID();
   const id = randomUUID();

   const doc: DocumentDetails = {
      ...emptyDocumentDetails,
      id: id,
      author: author,
      documentDetailsAuthorId: author.id,
      docOwner: user,
      documentDetailsDocOwnerId: user.id,
      box: DefaultBox,
      documentDetailsBoxId: DefaultBox.id,
   };

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
