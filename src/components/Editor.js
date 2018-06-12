import React, { Component } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import PropTypes from 'prop-types'

import 'codemirror/lib/codemirror.css'
import './editor.less'

class Editor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      originalContent: '',
      translatedContent: ''
    }
  }

  componentDidMount () {
    const databaseRef = this.props.database.collection('resources').doc(`I'm a New Mother_1.html`)
    databaseRef.get()
      .then(doc => {
        const { originalContent, translatedContent } = doc.data()
        this.setState({
          originalContent,
          translatedContent
        })
      })
  }

  render () {
    return (
      <div className="editor-container">
        <CodeMirror
          className="editor"
          ref="editor"
          value={this.state.originalContent}
          options={{lineWrapping: true, lineNumbers: true}}
        />
        <CodeMirror
          className="editor"
          ref="editor"
          value={this.state.translatedContent}
          options={{lineWrapping: true, lineNumbers: true}}
          onBeforeChange={(editor, data, value) => this.setState({translatedContent: value})}
        />
      </div>
    )
  }
}

Editor.propTypes = {
  database: PropTypes.object.isRequired
}

export default Editor
