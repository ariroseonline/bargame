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


// Initialize Firebase
var config = {
  apiKey: "AIzaSyCF52_JHNP0WfyMKH7GLjLXgHJ5eM_XSVs",
  authDomain: "bargame-37938.firebaseapp.com",
  databaseURL: "https://bargame-37938.firebaseio.com",
  storageBucket: "bargame-37938.appspot.com",
};
firebase.initializeApp(config);


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



