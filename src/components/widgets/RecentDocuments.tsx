import { connect } from 'react-redux'
import React, { Component, Dispatch } from 'react'
import Documents from './DocumentsTable'

interface RecentDocumentsProps 
{
    //TODO: fields here
}

const RecentDocuments: React.FC<RecentDocumentsProps> (props) =>
{
  
    //TODO: logic to get a list of Recent documents here.

  return ( 
      <Documents title='Recent Documents' />
  );
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentDocuments);