import React, { Component } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import PropTypes from 'prop-types'
import ActionBar from './ActionBar'

import 'codemirror/lib/codemirror.css'
import './workspace.less'

class Workspace extends Component {
  constructor (props) {
    super(props)
    this.state = {
      originalContent: '',
      translatedContent: '',
      updatedContent: '',
      markedAsComplete: false
    }
    this.handleSave = this.handleSave.bind(this)
    this.handleComplete = this.handleComplete.bind(this)
  }

  componentDidMount () {
    const databaseRef = this.props.database.collection('resources').doc(this.props.documentId)
    databaseRef.get()
      .then(doc => {
        const { originalContent, translatedContent, markedAsComplete } = doc.data()
        this.setState({
          originalContent,
          translatedContent,
          markedAsComplete
        })
      })
  }

  applyReadOnly (codeMirror) {
    const lineCount = codeMirror.lineCount()
    for (let i = 0; i < lineCount; i++) {
      const lineContent = codeMirror.getLine(i)
      const openTagIndices = []
      const endTagIndices = []
      for (let x = 0; x < lineContent.length; x++) {
        if (lineContent[x] === '<') {
          openTagIndices.push(x)
        }
        if (lineContent[x] === '>') {
          endTagIndices.push(x + 1)
        }
      }
      openTagIndices.map((openTagIndex, index) => {
        codeMirror.markText({line: i, ch: openTagIndex}, {line: i, ch: endTagIndices[index]}, {
          readOnly: true,
          className: 'markup',
          atomic: true
        })
      })
    }
  }

  handleSave () {
    this.props.database
      .collection('resources')
      .doc(this.props.documentId)
      .update({
        translatedContent: this.state.updatedContent
      })
    console.log('You are saved')
  }

  handleComplete () {
    this.setState(prevState => {
      return {markedAsComplete: !prevState.markedAsComplete}
    }, () => {
      this.props.database
        .collection('resources')
        .doc(this.props.documentId)
        .update({
          markedAsComplete: this.state.markedAsComplete
        })
    })
  }

  render () {
    if (!this.state.originalContent && !this.state.translatedContent) {
      return null
    }

    return (
      <div className="workspace-container">
        <ActionBar
          className="action-bar"
          documentId={this.props.documentId}
          handleSave={this.handleSave}
          markedAsComplete={this.state.markedAsComplete}
          handleComplete={this.handleComplete}
        />
        <div className="editors">
          <div className="editor-container">
            <h3 className="editor-title">ORIGINAL</h3>
            <CodeMirror
              className="editor"
              value={this.state.originalContent}
              options={{lineWrapping: true, lineNumbers: true}}
            />
          </div>
          <div className="editor-container">
            <h3 className="editor-title">TRANSLATION</h3>
            <CodeMirror
              className="editor"
              value={this.state.translatedContent || this.state.originalContent}
              editorDidMount={editor => this.applyReadOnly(editor)}
              options={{lineWrapping: true, lineNumbers: true, readOnly: this.state.markedAsComplete}}
              onChange={(editor, data, value) => {
                this.setState({updatedContent: value})
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

Workspace.propTypes = {
  database: PropTypes.object.isRequired,
  documentId: PropTypes.string.isRequired
}

export default Workspace
