import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import style from './style.css'

let Photos = React.createClass({

  propTypes: {
    children: PropTypes.node,
    user: PropTypes.object
  },

  getInitialState() {
    return {
      communityPhotos: [],
      user: {}
    }

  },

  componentWillReceiveProps: function(nextProps) {

      if (nextProps.user.level > 0) {
        var ref = firebase.database().ref("photos").orderByChild('level').endAt(nextProps.user.level).once('value', function (snapshot) {
          this.setState({
            communityPhotos: snapshot.val()
          })
        }.bind(this));
      }
  },

  renderCommunityPhotos() {
    return (
      <div>
        <h1>Photos</h1>
        <h2>Hi {this.props.user.name}, you've unlocked level {this.props.user.level}!</h2>
        <h3>Now you can see all photos from level {this.props.user.level} and below.</h3>
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
