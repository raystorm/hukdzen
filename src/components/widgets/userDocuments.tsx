import { connect } from 'react-redux'
import React, { Component } from 'react'
import Documents from './DocumentsTable'

type Props = {}

type State = {}

export class userDocuments extends Component<Props, State> {
  state = {}

  render() {
    return (
        <Documents title='Authored Documents' />
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(userDocuments)