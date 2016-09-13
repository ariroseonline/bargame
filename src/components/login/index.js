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

  componentDidMount() {
    // FirebaseUI config.
    var uiConfig = {
      'signInSuccessUrl': '/challenges',
      'signInOptions': [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      // Terms of service url.
      'tosUrl': 'http://google.com',
    };

    // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);

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
          <div id="firebaseui-auth-container"></div>

          <p>Rules:
            Pick one of the suggestions on the next screen and take a picture that fulfills its requirements.
            Repeat!
            Why:
            A lot of people will be taking pics. If you complete a challenge, you will be able to see all pictures completed at that level and below (and only those pics).
            The uploader will be kept anonymous in all pictures.
            I didn't have enough pictures from my party last year. It's my birthday!
          </p>
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
