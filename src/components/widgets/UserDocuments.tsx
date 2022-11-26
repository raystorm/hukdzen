import React, { useEffect } from 'react';
import { Dispatch } from 'redux';
import { connect, useSelector } from 'react-redux';
import ReduxStore from '../../app/store';
import { ReduxState }  from '../../app/reducers';
import { DocumentDetails } from '../../docs/DocumentTypes';
import DocumentsTable from './DocumentsTable';
import { documentListActions } from '../../docs/docList/documentListSlice';


interface UserDocumentsProps
{
   //TODO: fields here
}

const UserDocuments: React.FC<UserDocumentsProps> = (props) => 
{
  //REST call to get a list of Owned documents
  let docList = useSelector<ReduxState, DocumentDetails[]>
                           (state => state.documentList);
  useEffect(() => { 
    ReduxStore.dispatch(documentListActions.getOwnedDocuments(undefined));
    console.log('Loading Document List on Page Load.');
  }, []);

  return (<DocumentsTable title='Owned/Authored Documents'
                          documents={docList} />);
};


const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDocuments);