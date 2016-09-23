import React, {Component, PropTypes} from 'react'
import {Router, Link, browserHistory} from 'react-router'
import ReactFireMixin from 'reactfire'
import style from './style.css'
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import settings from '../../settings'
import _ from 'underscore'

var Main = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function () {
    return {
      loggedIn: (null !== firebase.auth().currentUser),
      user: null,
      communityPhotos: [],
      challenges: [],
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

        let userRef = firebase.database().ref(`users/${firebaseUser.uid}`);
        this.bindAsObject(userRef, 'user');

        //Don't think we need this DEPRECATE
        // User is signed in.
        // let usersRef = firebase.database().ref('users');
        // usersRef.child(firebaseUser.uid).once('value', (snapshot) => {
        //   let userRecord = snapshot.val();
        //   if (userRecord === null) {
        //
        //
        //   } else {
        //     //User already in database. Just set state with it.
        //     // this.setState({ user: userRecord})
        //   }
        // });

        //setting up challenges realtime data.
        let ref = firebase.database().ref(`users/${firebaseUser.uid}/challenges`).orderByChild('level');
        this.bindAsArray(ref, 'challenges');


        //setting up photos realtime data. Not using ReactFireMixin for this, because we have to do custom stuff in callback
        let photosRef = firebase.database().ref(`photos`).orderByChild('level');
        // this.bindAsArray(photosRef, 'communityPhotos');
        let communityPhotos = this.state.communityPhotos;
        //TODO may need child removed as well
        photosRef.on("child_added", function(dataSnapshot) {
          communityPhotos.push(dataSnapshot.val());
          let newPhotoNotificationsCount = communityPhotos.length - this.state.seenPhotosCount;

          this.setState({
            communityPhotos: communityPhotos,
            newPhotoNotificationsCount: newPhotoNotificationsCount

          });
        }.bind(this));



      } else {
        console.log('Not logged in');
      }
    });

  },

  updateUserLevel() {
    let levelChallenges = _.filter(this.state.challenges, (challenge)=> {
      return challenge.level === this.state.user.level;
    });

    let levelChallengesCompleted = _.filter(levelChallenges, (challenge) => {
      return challenge.completed === true;
    });

    //if so, update user level
    if (levelChallengesCompleted.length >= settings.challengesThresholdPerLevel) {
      this.incrementUserLevel();
    }
  },

  incrementUserLevel() {
    let uid = firebase.auth().currentUser.uid;
    let ref = firebase.database().ref(`users/${uid}`).update({
      level: this.state.user.level + 1
    })
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
      resetPhotoNotifications: this.resetPhotoNotifications,
      challenges: this.state.challenges,
      updateUserLevel: this.updateUserLevel
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
                            Challenges (Level {this.state.user.level})
                        </Link>
                    </li>
                    <li>
                        <Link to="/photos" className="navbar-brand">
                            Photos
                          ({this.state.newPhotoNotificationsCount} new)
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
