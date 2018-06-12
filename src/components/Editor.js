import React, { Component } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import PropTypes from 'prop-types'

import 'codemirror/lib/codemirror.css'
import './editor.less'

class Editor extends Component {
  constructor () {
    super()
    this.state = {
      content: 'hello'
    }
  }

  componentDidMount () {
    const databaseRef = this.props.database.collection('resources').doc('Acknowledgements.html')
    databaseRef.get()
      .then(doc => {
        const content = doc.data().content
        this.setState({content})
      })
  }

  render () {
    return (
      <div className="editor-container">
        <CodeMirror className="editor" ref="editor" value={this.state.content} options={{lineWrapping: true, lineNumbers: true}} />
        <CodeMirror className="editor" ref="editor" value={this.state.content} options={{lineWrapping: true, lineNumbers: true}} />
      </div>
    )
  }
}

Editor.propTypes = {
  database: PropTypes.object.isRequired
}

export default Editor
