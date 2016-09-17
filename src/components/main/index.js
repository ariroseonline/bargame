// import React, {Component, PropTypes} from 'react'
// import {Router, Link, browserHistory} from 'react-router'
// import style from './style.css'
// import ReactFireMixin from 'reactfire'
// // import attachFirebaseAuthListener from '../../util/attachFirebaseAuthListener'
// // import firebaseLogout from '../../util/firebaseLogout'
//
// let Main = React.createClass({
//   mixins: [ReactFireMixin],
//
//   propTypes: {
//     children: PropTypes.node
//   },
//
//   getInitialState() {
//     return {
//       user: {}
//     }
//   },
//
//   componentDidMount() {
//     // attachFirebaseAuthListener(this)
//   },
//
//   render() {
//     // var childrenWithProps = React.cloneElement(this.props.children, { user: this.state.user});
//
//     return (
//       <div>
//         <div id="sign-in-status"></div>
//         <div id="sign-in"></div>
//         <div id="account-details"></div>
//         <h1>{'Bargame'}</h1>
//         <ul>
//           <li><Link to="/challenges">{'Challenges'}</Link></li>
//           <li><Link to="/photos">{'Photos'}</Link></li>
//           <li><a href="" onClick={firebaseLogout}>Log Out</a></li>
//         </ul>
//
//
//         {this.props.children}
//       </div>
//     )
//   }
// });
//
// export default Main;


import React, {Component, PropTypes} from 'react'
import {Router, Link, browserHistory} from 'react-router'
import style from './style.css'

var Main = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: (null !== firebase.auth().currentUser)
    }
  },
  componentWillMount: function() {
    //MIGHT BE ABLE TO COMBINE  THIS WITH SAME HANDLER IN index.js
    firebase.auth().onAuthStateChanged(firebaseUser => {

      this.setState({
        loggedIn: (null !== firebaseUser)
      })

      if (firebaseUser) {
        console.log("Logged IN", firebaseUser);

        // User is signed in.
        var usersRef = firebase.database().ref('users');
        usersRef.child(firebaseUser.uid).once('value', (snapshot) => {
          let userRecord = snapshot.val();
          //add user to database if not already there
          if(userRecord === null) {
            usersRef.child(firebaseUser.uid).set({
              provider:  firebaseUser.providerData[0].providerId,
              name: firebaseUser.providerData[0].displayName,
              email: firebaseUser.providerData[0].email,
              level: 0
            });

            //Set state newly created user
            this.setState({ user: {
              uid: firebaseUser.uid,
              provider:  firebaseUser.providerData[0].providerId,
              name: firebaseUser.providerData[0].displayName,
              email: firebaseUser.providerData[0].email,
              level: 0
            }})

          } else {
            //User already in database. Just set state with it.
            this.setState({ user: userRecord})
          }
        });
      } else {
        console.log('Not logged in');
      }
    });
  },
  render: function() {
    var loginOrOut;
    var register;
    if (this.state.loggedIn) {
      loginOrOut = <li>
        <Link to="/logout" className="navbar-brand">Logout</Link>
      </li>;
      register = null
    } else {
      loginOrOut = <li>
        <Link to="/login" className="navbar-brand">Login</Link>
      </li>;
      register = <li>
        <Link to="/register" className="navbar-brand">
          Register
        </Link>
      </li>;
    }

    let childrenWithUser = React.cloneElement(this.props.children, { user: this.state.user});

    return (
      <span>
                <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">
                                Bargame
                            </Link>
                        </div>
                        <ul className="nav navbar-nav pull-right">
                            <li>
                                <Link to="/" className="navbar-brand">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/challenges" className="navbar-brand">
                                    Challenges
                                </Link>
                            </li>
                            <li>
                                <Link to="/photos" className="navbar-brand">
                                    Photos
                                </Link>
                            </li>
                          {register}
                          {loginOrOut}
                        </ul>
                    </div>
                </nav>
                <div className="container">
                    <div className="row">
                      {childrenWithUser}

                    </div>
                </div>
            </span>
    )
  }
});

export default Main;
