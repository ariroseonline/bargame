import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './components/app'
import Challenges from './components/challenges'
import Photos from './components/photos'
import Login from './components/login'

let loginUser = (username) => {
  alert('logging in ' + username)
  localStorage.setItem('username', username);
  browserHistory.push('/challenges');
}

let logoutUser = () => {
  alert('logging out')
  localStorage.removeItem('username');
  browserHistory.push('/login')
}


render((
    <Router history={browserHistory}>
        <Route component={App} logoutUser={logoutUser} path="/">
          <IndexRoute component={Challenges} />
          <Route component={Challenges} path="/challenges" />
          <Route component={Photos} path="/photos" />
          <Route component={Login} loginUser={loginUser} path="/login" />
        </Route>

    </Router>
), document.getElementById('app'))
