import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import ReactFireMixin from 'reactfire'
import style from './style.scss'
import _ from 'underscore'
var Masonry = require('react-masonry-component');


var masonryOptions = {
  transitionDuration: 0,
  columnWidth: '.' + style['grid-sizer'],
  itemSelector: '.' + style['grid-item'],
  gutter: '.' + style['gutter-sizer'],
  percentPosition: true,
};

let Photos = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node,
    user: PropTypes.object,
    resetPhotoNotifications: PropTypes.func
  },

  handleImagesLoaded: function(imagesLoadedInstance) {
    //handy
    console.log('images loaded')
  },

  componentDidMount(){
    this.props.resetPhotoNotifications();
  },

  renderPhotos(photos) {
    let childElements = photos.map(function (photo, i) {
      var cloudinary_url = cl.url(photo.photoURL, {type: "fetch",  width: 150,  height: 200, crop: 'thumb', gravity: "auto"});
      // Do something with the URL...
      console.log(cloudinary_url);
      return <li className={style['grid-item']} key={i}><a href={photo.photoURL}><img src={cloudinary_url} /></a></li>
    });

    return (
      <div>
        <div className="page-header">
        <h1>Hey Champ, you've unlocked level {this.props.user.level}!</h1>
        <h3>Now you can see all photos from level {this.props.user.level} and below.</h3>
        <p>Go back to <Link to="/challenges">Challenges</Link> to unlock more photos.</p>
        </div>
          <Masonry
            className={'photos-grid'} // default ''
            elementType={'ul'} // default 'div'
            options={masonryOptions} // default {}
            updateOnEachImageLoad={true} // default false and works only if disableImagesLoaded is false
          >
            <div className={style['grid-sizer']}></div>
            <div className={style['gutter-sizer']}></div>
            {childElements}
          </Masonry>
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
