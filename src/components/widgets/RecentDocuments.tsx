import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import ReduxStore from '../../app/store';
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
  //get a list of Recent documents
  let docList = useSelector<ReduxState, DocumentDetails[]>
                           (state => state.documentList);
  useEffect(() => { 
    ReduxStore.dispatch(documentListActions.getRecentDocuments(undefined)); 
    console.log('Loading Document List on Page Load.');
  }, []);

  return ( 
      <DocumentsTable title="Sut'amiis da lax sa'winsk (Recent Documents)"
                      documents={docList} />
  );
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentDocuments);