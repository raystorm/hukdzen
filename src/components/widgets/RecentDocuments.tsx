import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReduxState } from '../../app/reducers';
import { DocumentDetails } from '../../docs/DocumentTypes';
import DocumentsTable from './DocumentsTable';
import { documentListActions } from '../../docs/docList/documentListSlice';


interface RecentDocumentsProps 
{
   //TODO: fields here
}

const RecentDocuments: React.FC<RecentDocumentsProps> = (props) =>
{  
  const dispatch = useDispatch();

  //get a list of Recent documents
  let docList = useSelector<ReduxState, DocumentDetails[]>
                           (state => state.documentList);
  useEffect(() => { 
    dispatch(documentListActions.getRecentDocuments(undefined)); 
    console.log('Loading Document List on Page Load.');
  }, []);

  //TODO: move title to a const and export
  return ( 
      <DocumentsTable title="Sut'amiis da lax sa'winsk (Recent Documents)"
                      documents={docList} />
  );
};

export default RecentDocuments;