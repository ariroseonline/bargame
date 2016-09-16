import React, {Component, PropTypes} from 'react'
import {Router, Link, browserHistory} from 'react-router'
import style from './style.css'
import ReactFireMixin from 'reactfire'
import attachFirebaseAuthListener from '../../util/attachFirebaseAuthListener'
import firebaseLogout from '../../util/firebaseLogout'

let App = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node
  },

  componentDidMount() {
    attachFirebaseAuthListener()
  },

  render() {
    return (
      <div>
        <div id="sign-in-status"></div>
        <div id="sign-in"></div>
        <div id="account-details"></div>
        <h1>{'Bargame'}</h1>
        <ul>
          <li><Link to="/challenges">{'Challenges'}</Link></li>
          <li><Link to="/photos">{'Photos'}</Link></li>
          <li><a href="" onClick={firebaseLogout}>Log Out</a></li>
        </ul>


        {this.props.children}
      </div>
    )
  }
});

export default App;
