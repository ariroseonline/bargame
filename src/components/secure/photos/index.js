import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import ReactFireMixin from 'reactfire'
import style from './style.css'
import _ from 'underscore'

let Photos = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node,
    user: PropTypes.object,
    resetPhotoNotifications: PropTypes.func
  },

  // getInitialState() {
  //   return {
  //     communityPhotos: []
  //   }
  // },

  // componentDidMount() {
  //   let ref = firebase.database().ref(`photos`).orderByChild('level');
  //   this.bindAsArray(ref, 'communityPhotos');
  // },
  componentDidMount(){
    this.props.resetPhotoNotifications();

  },

  renderPhotos(photos) {
    return (
      <div>
        <h1>Photos</h1>
        <h2>Hi {this.props.user.name}, you've unlocked level {this.props.user.level}!</h2>
        <h3>Now you can see all photos from level {this.props.user.level} and below.</h3>
        <p>Go back to <Link to="/challenges">Challenges</Link> to unlock more photos.</p>
        <ul>
          {photos.map(function (photo, i) {
            return <li key={i}><img src={photo.photoURL} alt=""/></li>
          }) }
        </ul>
      </div>
    )
  },

  render() {
    if (this.props.user) {
      let unlockedPhotos = _.filter(this.props.communityPhotos, (photo)=>{
        return photo.level <= (this.props.user.level - 1); //Only show photos from levels they've ALREADY completed
      });

      return (
        <div>
          { unlockedPhotos.length ?
            this.renderPhotos(unlockedPhotos) :
            <h1>You haven't unlocked any levels yet :( Go take some photos in the <Link to="/challenges">Challenges</Link>
              :)</h1>
          }
        </div>
      )
    } else {
      return (<div>Loading Photos...</div>)
    }

  }
})

export default Photos;
