import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Dashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      resources: []
    }
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

  render () {
    return (
      <ul>
        {this.renderResources()}
      </ul>
    )
  }
}

Dashboard.propTypes = {
  database: PropTypes.object.isRequired
}

export default Dashboard
