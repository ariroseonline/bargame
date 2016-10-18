import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Main from './components/main'
import Home from './components/home'
import Challenges from './components/secure/challenges'
import Challenge from './components/secure/challenge'
import Photos from './components/secure/photos'
import Login from './components/login-register/login'
import Logout from './components/login-register/logout'
import Register from './components/login-register/register'
import 'bootstrap-loader';
require('offcanvas-bootstrap/dist/css/bootstrap.offcanvas.min.css');
var cloudinary = require('cloudinary-core');





// Initialize Firebase
var config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};
firebase.initializeApp(config);


window.cl = cloudinary.Cloudinary.new( {cloud_name: "bargame"});


function requireAuth(nextState, replace, callback) {

  firebase.auth().onAuthStateChanged((user) => {


    if (!user) {
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
      //
      // replace({
      //   pathname: '/login',
      //   state: { nextPathname: nextState.location.pathname },
      // });
    }
    callback();
  });
}

function closeSideMenu() {
  $("#js-bootstrap-offcanvas").trigger("offcanvas.close");
}

render((
  <Router history={browserHistory}>
    <Route component={Main} path="/" onChange={closeSideMenu}>
      <IndexRoute component={Home} />
      <Route component={Challenges} path="/challenges" onEnter={requireAuth} />
      <Route component={Challenge}  path="/challenges/:challenge_id" onEnter={requireAuth} />
      <Route component={Photos} path="/photos" onEnter={requireAuth}/>
      <Route component={Login} path="/login" />
      <Route component={Logout} path="/logout" />
      <Route component={Register} path="/register" />
    </Route>
  </Router>
), document.getElementById('app'));



