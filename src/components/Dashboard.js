import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './dashboard.less'

class Dashboard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoading: true,
      resources: []
    }

    this.onDrop = this.onDrop.bind(this)
  }

  componentDidMount () {
    const databaseRef = this.props.database.collection('resources')
    databaseRef.onSnapshot(snapshot => {
      const resources = snapshot.docs
        .sort((a, b) => {
          const options = {numeric: true, sensitivity: 'base'}
          return a.data().name.localeCompare(b.data().name, undefined, options)
        })

      this.setState({ resources, isLoading: false })
    })
  }

  componentWillUnmount () {
    const unsubscribe = this.props.database
      .collection('resources')
      .onSnapshot(() => {})

    unsubscribe()
  }

  handleDownload (translatedContent) {
    const download = new window.Blob([translatedContent], {type: 'text/plain'})
    return URL.createObjectURL(download)
  }

  renderResourceTable () {
    const resourcesTable = (
      <table className="resources">
        <tr className="resources-header">
          <th className="name">Name</th>
          <th className="last-modified">Last Modified</th>
          <th className="last-translated">Last Translated</th>
          <th className="complete centered">Marked as Complete</th>
          <th className="download centered">Download Translation</th>
          <th className="delete centered">Delete</th>
        </tr>
        {this.renderResources()}
      </table>
    )

    return this.state.resources.length
      ? resourcesTable
      : <div className="status">No resources to display. Upload files above 🐾</div>
  }

  renderResources () {
    return this.state.resources.map((resource, index) => {
      const {
        url,
        name,
        lastModified,
        translatedContent,
        markedAsComplete
      } = resource.data()
      const lastTranslated = new Date(resource._document.version.timestamp.seconds * 1000).toLocaleString()
      const translationDownload = this.handleDownload(translatedContent)

      return (
        <tr className="resource" key={index}>
          <td className="name">
            <Link to={{pathname: url}} target="_blank">{name}</Link>
          </td>
          <td className="last-modified">
            {new Date(lastModified).toLocaleString()}
          </td>
          <td className="last-translated">
            {translatedContent
              ? lastTranslated
              : null}
          </td>
          <td className="complete centered">
            {markedAsComplete
              ? <span>&#x2714;</span>
              : null}
          </td>
          <td className="download centered">
            {translatedContent
              ? <a href={`${translationDownload}`} download={name}>&#x2601;</a>
              : null}
          </td>
          <td className="delete centered">
            <button onClick={() => this.deleteDocument(resource.id)}>&#x2718;</button>
          </td>
        </tr>
      )
    })
  }

  deleteDocument (id) {
    const databaseRef = this.props.database.collection('resources')
    databaseRef.doc(id).delete()
  }

  onDrop (acceptedFiles) {
    acceptedFiles.forEach(file => {
      const reader = new window.FileReader()
      reader.onload = () => {
        const newDocument = this.props.database
          .collection('resources')
          .doc()

        newDocument.set({
          name: file.name,
          originalContent: reader.result,
          lastModified: file.lastModified,
          url: `/workspace/${newDocument.id}`
        })
      }
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')

      reader.readAsText(file)
    })
  }

  render () {
    return (
      <div>
        <h2 className="page-title">🐶 LUISA</h2>
        <Dropzone onDrop={this.onDrop} accept=".html, .xml" className="dropzone">
          <p className="dz-message">Drop files here or click to upload.</p>
          <p className="dz-note">Only *.html and *.xml files will be accepted</p>
        </Dropzone>
        <h3 className="table-title">Available Resources</h3>
        {this.state.isLoading
          ? <div className="status">Loading ...</div>
          : this.renderResourceTable()
        }
      </div>
    )
  }
}

Dashboard.propTypes = {
  database: PropTypes.object.isRequired
}

export default Dashboard
