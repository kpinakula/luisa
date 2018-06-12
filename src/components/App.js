import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import firebase from 'firebase'

import { firebaseConfig } from '../../secrets'
import Dashboard from './Dashboard'
import Editor from './Editor'

class App extends Component {
  constructor () {
    super()
    firebase.initializeApp(firebaseConfig)
  }

  render () {
    const { firestore } = firebase
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Dashboard database={firestore()} />} />
          <Route exact path="/editor" render={() => <Editor database={firestore()} />} />
          <Route render={() => <div>Where is Luisa? 🐶</div>} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
