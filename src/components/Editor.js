import React, { Component } from 'react'
import CodeMirror from 'react-codemirror'

import 'codemirror/lib/codemirror.css'
import './editor.less'

class Editor extends Component {
  render () {
    return (
      <div className="editor-container">
        <CodeMirror className="editor" ref="editor" value="Hello" options={{lineWrapping: true, lineNumbers: true}} />
        <CodeMirror className="editor" ref="editor" value="Hello" options={{lineWrapping: true, lineNumbers: true}} />
      </div>
    )
  }
}

export default Editor
