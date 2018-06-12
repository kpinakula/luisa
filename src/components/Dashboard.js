import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'

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
    databaseRef.get()
      .then(snapshot => {
        const resources = snapshot.docs.map(document => document.data())
        this.setState({ resources })
      })
  }

  renderResources () {
    return this.state.resources.map((resource, index) => {
      return <li key={index}>{resource.name}</li>
    })
  }

  onDrop (acceptedFiles) {
    acceptedFiles.forEach(file => {
      const reader = new window.FileReader()
      reader.onload = () => {
        this.props.database
          .collection('resources')
          .doc(file.name)
          .set({
            content: reader.result,
            name: file.name
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
        <ul>
          {this.renderResources()}
        </ul>
      </div>
    )
  }
}

Dashboard.propTypes = {
  database: PropTypes.object.isRequired
}

export default Dashboard
