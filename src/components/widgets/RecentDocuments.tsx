import { connect } from 'react-redux'
import React from 'react'
import { Dispatch } from 'redux'
import { ReduxState }  from '../../app/reducers'
import docList from '../../data/docList.json'
import DocumentsTable from './DocumentsTable'

interface RecentDocumentsProps 
{
   //TODO: fields here
}

const RecentDocuments: React.FC<RecentDocumentsProps> = (props) =>
{  
  //TODO: logic to get a list of Recent documents here.

  //TODO: useEffect hook here to load the data
  

  return ( 
      <DocumentsTable title='Recent Documents' 
                 documents={docList.documents} />
  );
};

const mapStateToProps = (state: ReduxState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentDocuments);