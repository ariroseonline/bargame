import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'
import style from './style.css'

class Login extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      username: ''
    };
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    if(this.state.username) { //TODO: and doesn't conflict with another person
     this.props.route.loginUser(this.state.username);
    } else {
      alert('must put a username in')
    }

  }

  render() {
    return (
        <div>
          <form onSubmit={this.onSubmit.bind(this)}>
            <input type="text" id="username" onChange={this.handleUsernameChange.bind(this)} placeholder="Username" />
            <input type="submit" value={"Go!"} />
          </form>
        </div>
    )
  }
}

Login.propTypes = {
  children: PropTypes.node,
  loginUser: PropTypes.func
}

export default Login;
