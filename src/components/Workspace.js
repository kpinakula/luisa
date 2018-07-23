import React, { Component } from 'react'
import _ from 'underscore'
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
      name: '',
      markedAsComplete: false,
      currentLine: 0,
      hasChange: false,
      lastSaved: '',
      translated: false,
      mode: ''
    }

    this.highlightCurrentLine = this.highlightCurrentLine.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleComplete = this.handleComplete.bind(this)
  }

  componentDidMount () {
    const databaseRef = this.props.database.collection('resources').doc(this.props.documentId)
    databaseRef.get()
      .then(doc => {
        const { originalContent, translatedContent, markedAsComplete, name } = doc.data()
        this.setState({
          originalContent,
          translatedContent,
          translated: Boolean(translatedContent),
          markedAsComplete,
          name
        })
      })
    this.getTimeLastSaved()
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

  hideStyleTag (editor) {
    const lineCount = editor.lineCount()
    const start = {}
    const end = {}

    for (let i = 0; i < lineCount; i++) {
      const lineContent = editor.getLine(i)
      const openStyleTagIndex = lineContent.indexOf('<style')
      const endStyleTagIndex = lineContent.indexOf('</style>')

      if (openStyleTagIndex > -1) {
        start.line = i
        start.ch = openStyleTagIndex
      }

      if (endStyleTagIndex > -1) {
        end.line = i
        end.ch = endStyleTagIndex + 8
      }
    }

    // todo: check if collapsed: true is obsolete
    if (start.line && end.line) {
      editor.markText(start, end, {collapsed: true})
    }
  }

  highlightCurrentLine (editor) {
    const { line } = editor.getCursor()

    this.setState(prevState => {
      this.state.originalEditor.removeLineClass(prevState.currentLine, 'background', 'current-line')
      this.state.translationEditor.removeLineClass(prevState.currentLine, 'background', 'current-line')

      return {currentLine: line}
    }, () => {
      this.state.originalEditor.addLineClass(line, 'background', 'current-line')
      this.state.translationEditor.addLineClass(line, 'background', 'current-line')
    })
  }

  handleSave () {
    if (this.state.hasChange) {
      this.props.database
        .collection('resources')
        .doc(this.props.documentId)
        .update({
          translatedContent: this.state.updatedContent
        })

      // todo: only set state if db update succeeded
      this.setState({
        hasChange: false,
        translated: true,
        lastSaved: new Date().toLocaleString()
      })

      console.log('You are saved')
    }
  }

  getTimeLastSaved () {
    // todo: store docRef in state?
    const docRef = this.props.database.collection('resources').doc(this.props.documentId)
    docRef.get()
      .then(({ _document }) => {
        const lastSaved = new Date(_document.version.timestamp.seconds * 1000).toLocaleString()
        this.setState({lastSaved})
      })
  }

  getFileExtension () {
    const fileType = this.state.name.split('.').pop()
    if (fileType === 'html') {
      this.setState({mode: 'htmlmixed'})
    } else this.setState({mode: fileType})
  }

  // todo: reverse order
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
          documentId={this.props.documentId}
          handleSave={this.handleSave}
          markedAsComplete={this.state.markedAsComplete}
          handleComplete={this.handleComplete}
          hasChange={this.state.hasChange}
          lastSaved={this.state.lastSaved}
          translated={this.state.translated}
          resourceName={this.state.name}
        />
        {this.state.markedAsComplete
          ? <div className="overlay-complete"><h1>Excellent! You've marked this translation as complete.</h1><p>In case you wish to make further edits, please uncheck the Mark as complete box.</p><p>Happy editing!</p></div>
          : null}
        <div className="editors">
          <div className="editor-container">
            <h3 className="editor-title">ORIGINAL</h3>
            <CodeMirror
              className="editor"
              value={this.state.originalContent}
              mode={this.state.mode}
              editorDidMount={editor => {
                this.applyReadOnly(editor)
                this.hideStyleTag(editor)
                this.setState({originalEditor: editor})
                this.getFileExtension()
              }}
              options={{lineWrapping: true, lineNumbers: true, readOnly: true}}
              onCursorActivity={this.highlightCurrentLine}
              onScroll={editor => {
                this.state.translationEditor.scrollTo(0, editor.getScrollInfo().top)
              }}
            />
          </div>
          <div className="editor-container">
            <h3 className="editor-title">TRANSLATION</h3>
            <CodeMirror
              className="editor"
              value={this.state.translatedContent || this.state.originalContent}
              mode={this.state.mode}
              editorDidMount={editor => {
                this.applyReadOnly(editor)
                this.hideStyleTag(editor)
                this.setState({translationEditor: editor})
              }}
              options={{
                lineWrapping: true,
                lineNumbers: true,
                readOnly: this.state.markedAsComplete,
                extraKeys: {Enter: () => null}
              }}
              onChange={(editor, data, value) => {
                this.setState({updatedContent: value})
                this.setState({hasChange: true})
                _.debounce(this.handleSave, 4000)()
              }}
              onCursorActivity={this.highlightCurrentLine}
              onScroll={editor => {
                this.state.originalEditor.scrollTo(0, editor.getScrollInfo().top)
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
