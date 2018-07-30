import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import firebase from 'firebase'

import Dashboard from './Dashboard'
import Workspace from './Workspace'

import './app.less'

import { firebaseConfig } from '../../secrets'

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
          <Route path="/workspace/:id" render={(props) => <Workspace documentId={props.match.params.id} database={firestore()} />} />
          <Route render={() => <div>Where is Luisa? 🐶</div>} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
