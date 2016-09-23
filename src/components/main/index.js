import React, {Component, PropTypes} from 'react'
import {Router, Link, browserHistory} from 'react-router'
import ReactFireMixin from 'reactfire'
import style from './style.css'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';

var Main = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function () {
    return {
      loggedIn: (null !== firebase.auth().currentUser),
      user: null,
      communityPhotos: [],
      newPhotoNotificationsCount: 0,
      seenPhotosCount: 0
    }
  },
  componentWillMount: function () {
    //MIGHT BE ABLE TO COMBINE THIS WITH SAME HANDLER IN index.js
    firebase.auth().onAuthStateChanged(firebaseUser => {
      this.setState({
        loggedIn: (null !== firebaseUser)
      });

      if (firebaseUser) {
        console.log("Logged IN", firebaseUser);

        let ref = firebase.database().ref(`users/${firebaseUser.uid}`);
        this.bindAsObject(ref, 'user');

        // User is signed in.
        var usersRef = firebase.database().ref('users');
        usersRef.child(firebaseUser.uid).once('value', (snapshot) => {
          let userRecord = snapshot.val();
          if (userRecord === null) {


            // //Set state newly created user
            // this.setState({ user: {
            //   uid: firebaseUser.uid,
            //   provider:  firebaseUser.providerData[0].providerId,
            //   name: firebaseUser.providerData[0].displayName,
            //   email: firebaseUser.providerData[0].email,
            //   level: 0
            // }})

          } else {
            //User already in database. Just set state with it.
            // this.setState({ user: userRecord})
          }
        });
      } else {
        console.log('Not logged in');
      }
    });

    //testing
    let ref = firebase.database().ref(`photos`).orderByChild('level');
    // this.bindAsArray(ref, 'communityPhotos');
    let communityPhotos = this.state.communityPhotos;
    //TODO may need child removed as well
    ref.on("child_added", function(dataSnapshot) {
      communityPhotos.push(dataSnapshot.val());
      let newPhotoNotificationsCount = communityPhotos.length - this.state.seenPhotosCount;

      this.setState({
        communityPhotos: communityPhotos,
        newPhotoNotificationsCount: newPhotoNotificationsCount

      });
    }.bind(this));
  },

  componentDidMount() {
    let currentUser = firebase.auth().currentUser;
    if (currentUser) {

    }


  },

  componentDidUpdate(prevProps, prevState) {

    //when firebase updates community photos basically

    // let newPhotoNotificationsCount = this.state.communityPhotos.length - this.state.newPhotoNotificationsCount;
    // this.setState({
    //   newPhotoNotificationsCount: newPhotoNotificationsCount
    // });
    // return true;
  },

  resetPhotoNotifications() {
    this.setState({
      seenPhotosCount: this.state.newPhotoNotificationsCount + this.state.seenPhotosCount,
      newPhotoNotificationsCount: 0
    });
  },

  render: function () {
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

    let childrenWithUser = React.cloneElement(this.props.children, {
      user: this.state.user,
      communityPhotos: this.state.communityPhotos,
      resetPhotoNotifications: this.resetPhotoNotifications
    });

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
                                  ({this.state.newPhotoNotificationsCount})
                                  {<NotificationBadge count={this.state.newPhotoNotificationsCount}
                                                     effect={Effect.ROTATE_Y}/> }
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
