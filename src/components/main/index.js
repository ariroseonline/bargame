import React, {Component, PropTypes} from 'react'
import {Router, Link, browserHistory} from 'react-router'
import ReactFireMixin from 'reactfire'
import style from './style.scss'
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

        this.unbind("user");
        this.unbind("challenges");
        console.log('Not logged in');
      }
    });

  },

  componentDidMount() {
    require('offcanvas-bootstrap/dist/js/bootstrap.offcanvas.js');

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

  logOut: function() {
    firebase.auth().signOut();
  },

  renderSideMenu() {
    var loginOrOut;
    var register;
    if (this.state.loggedIn) {
      loginOrOut = <li>
        <a href="#" onClick={this.logOut}>Logout</a>
      </li>;
      register = null
    } else {
      loginOrOut = <li>
        <Link to="/login">Login</Link>
      </li>;
      register = <li>
        <Link to="/register">
          Register
        </Link>
      </li>;
    }
    return (
      <nav className="navbar navbar-default navbar-offcanvas navbar-offcanvas-touch navbar-offcanvas-fade" role="navigation" id="js-bootstrap-offcanvas">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">Brand</a>
          </div>
          <div>
            <ul className="nav navbar-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/challenges">Challenges</Link></li>
              <li><Link to="/photos">
                Photos {this.state.user && this.state.newPhotoNotificationsCount ?
                <span className="badge"> {`${this.state.newPhotoNotificationsCount} new`}</span> :
                null
              }
              </Link>
              </li>
            </ul>

            <ul className="nav navbar-nav navbar-right">
              {/*<li className="level-badge">*/}
              {/*<span> {this.state.user ? `Level ${this.state.user.level}` : null }</span>*/}
              {/*</li>*/}
              {register}
              {loginOrOut}
            </ul>
          </div>
        </div>
      </nav>
    )
  },

  render: function () {

    let childrenWithUser = React.cloneElement(this.props.children, {
      user: this.state.user,
      communityPhotos: this.state.communityPhotos,
      resetPhotoNotifications: this.resetPhotoNotifications,
      challenges: this.state.challenges,
      updateUserLevel: this.updateUserLevel
    });

    return (
      <div>
        <nav className="main-nav">
            <div className="container">

              <button type="button" className="navbar-toggle offcanvas-toggle" data-toggle="offcanvas" data-target="#js-bootstrap-offcanvas">
                <span className="sr-only">Toggle navigation</span>
                <span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </span>
              </button>

              {this.renderSideMenu()}


            </div>
        </nav>
        <div className="container">
              {childrenWithUser}
        </div>
    </div>
    )
  }
});

export default Main;
