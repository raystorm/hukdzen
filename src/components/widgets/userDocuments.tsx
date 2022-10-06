import { connect } from 'react-redux'
import React, { Component } from 'react'
import Documents from './DocumentsTable'

interface UserDocumentsProps {

}

const userDocuments: React.FC<UserDocumentsProps> (props) => {

  return (
        <Documents title='Authored Documents' />
  );
};


const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(userDocuments);