import { connect } from 'react-redux'
import React from 'react'
import { Dispatch } from 'redux'
import Documents from './DocumentsTable'
import { ReduxState }  from '../../reducers/index'


interface UserDocumentsProps {

}

const userDocuments: React.FC<UserDocumentsProps> = (props) => {

  return (
        <Documents title='Owned/Authored Documents' />
  );
};


const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(userDocuments);