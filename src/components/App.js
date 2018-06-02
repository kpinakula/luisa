import React, { Component } from 'react'
import firebaseConfig from '../../secrets'
import firebase from 'firebase'

class App extends Component {
  constructor () {
    super()
    firebase.initializeApp(firebaseConfig)
  }

  render () {
    return <div>Hi</div>
  }
}

export default App
