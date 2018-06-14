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
      return (
        <li key={index}>
          <Link to={{pathname: resource.data().url}}>{resource.data().name}</Link>
        </li>
      )
    })
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
          url: `/editor/${newDocument.id}`
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
