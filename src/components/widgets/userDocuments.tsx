import { connect } from 'react-redux'
import React from 'react'
import { Dispatch } from 'redux'
import DocumentsTable from './DocumentsTable'
import { ReduxState }  from '../../app/reducers'
import docList from '../../data/docList.json'


interface UserDocumentsProps {

}

const userDocuments: React.FC<UserDocumentsProps> = (props) => {

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