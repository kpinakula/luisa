import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import firebase from 'firebase'

// import { firebaseConfig } from '../../secrets'
import Dashboard from './Dashboard'
import Workspace from './Workspace'

class App extends Component {
  constructor () {
    super()
    const firebaseConfig = {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID
    }
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
