import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReduxState } from '../../app/reducers';
import { DocumentDetails } from '../../docs/DocumentTypes';
import DocumentsTable from './DocumentsTable';
import { documentListActions } from '../../docs/docList/documentListSlice';

export const OwnedDocumentsTitle = 'Owned/Authored Documents';

interface UserDocumentsProps
{
   //TODO: fields here
}

const UserDocuments: React.FC<UserDocumentsProps> = (props) => 
{
  const dispatch = useDispatch();

  //REST call to get a list of Owned documents
  let docList = useSelector<ReduxState, DocumentDetails[]>
                           (state => state.documentList);
  useEffect(() => { 
    dispatch(documentListActions.getOwnedDocuments(undefined));
    // console.log('Loading Document List on Page Load.');
  }, []);

  return <DocumentsTable title={OwnedDocumentsTitle} documents={docList} />;
};

export default UserDocuments;