import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './components/app'
import Challenges from './components/challenges'
import Challenge from './components/challenge'
import Photos from './components/photos'
import Login from './components/login'
// import firebase from 'firebase'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCF52_JHNP0WfyMKH7GLjLXgHJ5eM_XSVs",
  authDomain: "bargame-37938.firebaseapp.com",
  databaseURL: "https://bargame-37938.firebaseio.com",
  storageBucket: "bargame-37938.appspot.com",
};
firebase.initializeApp(config);

function requireAuth (nextState, replace) {
  if (!firebase.auth().currentUser) {
    let hasLocalStorageUser = false;
    for (let key in localStorage) {
      if (key.startsWith("firebase:authUser:")) {
        hasLocalStorageUser = true;
      }
    }
    if (!hasLocalStorageUser) {
      console.log('Attempting to access a secure route. Please authenticate first.');
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }
}

//Wait to render app until Firebase figures out what it's doing with user
render((
  <Router history={browserHistory}>
    <Route component={App} path="/">
      <IndexRoute component={Challenges}  />
      <Route component={Challenges} path="/challenges" onEnter={requireAuth} />
      <Route component={Challenge}  path="/challenges/:challenge_id" onEnter={requireAuth} />
      <Route component={Photos} path="/photos" onEnter={requireAuth}/>
      <Route component={Login} path="/login" />
    </Route>
  </Router>
), document.getElementById('app'));



