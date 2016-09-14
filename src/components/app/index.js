import React, { Component, PropTypes } from 'react'
import { Router, Link, browserHistory } from 'react-router'
import style from './style.css'

class App extends Component {
  constructor(props, context) {
    super(props, context);
  }

  logOut() {
      firebase.auth().signOut().then(function() {
          // window.location.reload either of these work
          Router.replace(location);
      });
  }


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
                <li><a href="" onClick={this.logOut}>Log Out</a></li>
            </ul>


            {this.props.children}
        </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.node
}

export default App;
