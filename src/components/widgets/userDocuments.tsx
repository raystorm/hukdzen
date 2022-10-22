import React from 'react'
import { Dispatch } from 'redux'
import { connect, useDispatch } from 'react-redux'
import DocumentsTable from './DocumentsTable'
import { ReduxState }  from '../../app/reducers'
import docList from '../../data/docList.json'
import { documentListActions } from '../../documents/documentList/documentListSlice'


interface UserDocumentsProps {

}

const userDocuments: React.FC<UserDocumentsProps> = (props) => {

  //TODO: load docList via REST call.

  return (
        <DocumentsTable title='Owned/Authored Documents'
                   documents={docList.documents} />
  );
};


const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(userDocuments);