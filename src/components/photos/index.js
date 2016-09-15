import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import ReactFireMixin from 'reactfire'
import style from './style.css'

let Photos = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node
  },

  getInitialState() {
    return {
      communityPhotos: [],
      user: {}
    }

  },

  componentWillMount: function () {
    //get user
    var currentUserUid = firebase.auth().currentUser.uid;
    var userRef = firebase.database().ref('users').child(currentUserUid);

    //when user level changes, photos update to show those from community up to that level
    userRef.on("value", function (snapshot) {
      this.setState({
        user: snapshot.val()
      });
      if (this.state.user.level > 0) {
        var ref = firebase.database().ref("photos").orderByChild('level').endAt(snapshot.val().level).once('value', function (snapshot) {
          this.setState({
            communityPhotos: snapshot.val()
          })
        }.bind(this));

      }

    }.bind(this));

  },

  renderCommunityPhotos() {
    return (
      <div>
        <h1>Photos</h1>
        <h2>Hi {this.state.user.name}, you've unlocked level {this.state.user.level}!</h2>
        <h3>Now you can see all photos from level {this.state.user.level} and below.</h3>
        <p>Go back to <Link to="/challenges">Challenges</Link> to unlock more photos.</p>
        <ul>
          {this.state.communityPhotos.map(function (photo, i) {
            return <li key={i}><img src={photo.url} alt=""/></li>
          }) }
        </ul>
      </div>
    )
  },

  render() {
    return (
      <div>

        { this.state.communityPhotos.length ?
          this.renderCommunityPhotos() :
          <h1>You haven't unlocked any levels yet :( Go take some photos in the <Link to="/challenges">Challenges</Link>
             :)</h1>
        }

      </div>
    )
  }
})

export default Photos;
