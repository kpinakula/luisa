import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Dashboard extends Component {
  constructor (props) {
    super(props)

    this.state = {
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

      this.setState({ resources })
    })
  }

  componentWillUnmount () {
    const unsubscribe = this.props.database
      .collection('resources')
      .onSnapshot(() => {})

    unsubscribe()
  }

  renderResources () {
    return this.state.resources.map((resource, index) => {
      const { url, name, lastModified } = resource.data()
      console.log('last modified on server:', new Date(resource._document.version.timestamp.seconds * 1000).toLocaleString())

      return (
        <li key={index}>
          <Link to={{pathname: url}}>{name}</Link>
          <div>
            Original last updated: {new Date(lastModified).toLocaleString()}
          </div>
          <div>
            Translation last updated: {new Date(resource._document.version.timestamp.seconds * 1000).toLocaleString()}
          </div>
          <button onClick={() => this.deleteDocument(resource.id)}>Delete</button>
        </li>
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
        <Dropzone onDrop={this.onDrop} />
        {this.state.resources.length
          ? <ul>{this.renderResources()}</ul>
          : <div>Loading ...</div>}
      </div>
    )
  }
}

Dashboard.propTypes = {
  database: PropTypes.object.isRequired
}

export default Dashboard
