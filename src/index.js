import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './components/app'
import Challenges from './components/challenges'
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

function requireAuth(nextState, replace) {
  if(null === firebase.auth().currentUser) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

//Always be watching for sign in/out changes
firebase.auth().onAuthStateChanged(function(user) {
  //Wait to render app until Firebase figures out what it's doing
  render((
    <Router history={browserHistory}>
      <Route component={App} path="/" onEnter={requireAuth}>
        <IndexRoute component={Challenges}  />
        <Route component={Challenges} path="/challenges" />
        <Route component={Photos} user={user} path="/photos" />
      </Route>
      <Route component={Login} path="/login" />

    </Router>
  ), document.getElementById('app'));

  if (user) {
    // User is signed in.
    //add user to database if not already there
    var usersRef = firebase.database().ref('users');
    usersRef.child(user.uid).once('value', function(snapshot) {

      if(snapshot.val() === null) {

        usersRef.child(user.uid).set({
          provider:  user.providerData[0].providerId,
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          level: 0
        });
      }
    });




  } else {
    // User is signed out.
  }
}, function(error) {
  console.log(error);
});


