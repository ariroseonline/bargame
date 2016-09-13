import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'
import style from './style.css'

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loggedIn: !!localStorage.getItem('username')
    };

  }

  componentWillMount() {
      // if(!localStorage.getItem('username')) {
      //   browserHistory.push('/login')
      // } else {
      //   return true;
      // }
  }

  handleLogout() {
    this.props.route.logoutUser();
  }

  render() {
    return (
        <div>

          <h1>{'Bargame'}</h1>
            <ul>
                <li><Link to="/challenges">{'Challenges'}</Link></li>
                <li><Link to="photos">{'Photos'}</Link></li>
              { this.state.loggedIn ?
                  <li><a href="#" onClick={this.handleLogout.bind(this)}>Logout</a></li>
                  : null
              }
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
