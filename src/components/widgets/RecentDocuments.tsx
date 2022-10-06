import { connect } from 'react-redux'
import React, { Component } from 'react'
import Documents from './DocumentsTable'

type Props = {}

type State = {}

export class RecentDocuments extends Component<Props, State> 
{
  state = {}

  //TODO: logic to get a list of Recent documents here.

  render() {
    return ( 
        <Documents title='Recent Documents' />
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(RecentDocuments)