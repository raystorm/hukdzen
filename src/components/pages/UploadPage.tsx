import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from '../../app/reducers'
import { initialDocumentDetail } from '../../docs/initialDocumentDetails'
import DocumentDetailsForm from '../forms/DocumentDetails'

interface UploadProps {

}

const UploadPage: React.FC<UploadProps> = (props) => 
{
    //TODO: set author to current user
    const author = 'hukmalsk';
    const id = crypto.randomUUID();

    return (
      <>
      <DocumentDetailsForm 
          pageTitle='Upload a New Smalgyax Document' 
          editable={true} { ...initialDocumentDetail }
          authorId={author} id={id} isNew={true}
          />
      </>
    );
}

const mapStateToProps = (state: ReduxState) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UploadPage)
