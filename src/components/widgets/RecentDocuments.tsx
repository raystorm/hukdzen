import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from "../../app/hooks";
import DocumentsTable from './DocumentsTable';
import { documentListActions } from '../../docs/docList/documentListSlice';

export const RecentDocumentsTitle = 
       "Sut'amiis da lax sa'winsk (Recent Documents)";

interface RecentDocumentsProps 
{
   //TODO: fields here
}

const RecentDocuments: React.FC<RecentDocumentsProps> = (props) =>
{  
  const dispatch = useDispatch();

  //get a list of Recent documents
  let docList = useAppSelector(state => state.documentList);

  useEffect(() => {
    dispatch(documentListActions.getRecentDocuments(undefined)); 
     console.log('Loading Recent Document List on Page Load.');
  }, []);

  return <DocumentsTable title={RecentDocumentsTitle} documents={docList} />;
};

export default RecentDocuments;