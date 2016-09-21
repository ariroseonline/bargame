import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import style from './style.css'
import ReactFireMixin from 'reactfire'
import _ from 'underscore'
import settings from '../../../settings'

let Challenges = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node,
    user: PropTypes.object
  },

  getInitialState() {
    return {
      challenges: [],
      currentLevel: null
    }
  },

  componentDidMount() {
    let uid = firebase.auth().currentUser.uid;
    let ref = firebase.database().ref(`users/${uid}/challenges`).orderByChild('level');
    this.bindAsArray(ref, 'challenges');
  },

  checkUserLevel() {
    let levelChallenges = _.filter(this.state.challenges, (challenge)=> {
      return challenge.level === this.props.user.level;
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
      level: this.props.user.level + 1
    })
  },

  savePhoto(fileUpload, challengeKey, challengeName) {
    var file = fileUpload.files[0]; // get the first file uploaded

    // Create the file metadata
    var metadata = {
      contentType: file.type
    };

    //prepare reference file name in Firebase Storage
    let uid = firebase.auth().currentUser.uid;
    let formattedChallengeName = challengeName.replace(/\W+/g, '-').toLowerCase();
    let storageRef = firebase.storage().ref(`challenge-photos/${uid}/${formattedChallengeName}`); //may have to put filetype suffix on this

    //Save
    let uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', function progress(snapshot) {
      console.log('PROGRESS ', (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '%'); // progress of upload
    });

    uploadTask.then((snapshot)=> {
      this.savePhotoToDB(storageRef, challengeKey);
    });
  },

  savePhotoToDB(storageRef, challengeKey) {
    let uid = firebase.auth().currentUser.uid;

    storageRef.getDownloadURL().then((photoURL)=> {
      //TODO: May just want to embed user and challenge in the photo object...
      let newPhoto = {
        photoURL: photoURL,
        uid: uid
      };

      firebase.database().ref(`/users/${uid}/challenges/${challengeKey}`).once('value', (challenge)=> {
        newPhoto.challengeId = challenge.val().id;
        let newPhotoKey = firebase.database().ref().child('photos').push().key;

        //save in 2 places per the firebase guidelines for easy-access, efficient, flat data storage
        let updates = {};
        updates['/photos/' + newPhotoKey] = newPhoto;
        updates[`/users/${uid}/challenges/${challengeKey}/photoURL`] = photoURL;
        updates[`/users/${uid}/challenges/${challengeKey}/completed`] = true;


        firebase.database().ref().update(updates).then(()=>{
          //check to see if user has surpassed threshold to get to next level
          this.checkUserLevel();
        });
      });


    });
  },

  handleChallengeInput(challengeKey, challengeName) {
    var fileUpload = document.getElementById(`challenge-upload-${challengeKey}`);
    this.savePhoto(fileUpload, challengeKey, challengeName);
  },

  renderChallenges() {
    return (
      <ul>
        {this.state.challenges.map((challenge, i)=> {
          if (challenge.level <= this.props.user.level) {
            {/*console.log('CHALLENGE', challenge);*/
            }
            return (
              <li className={challenge.completed ? style.completed : null} key={i}>
                <h1>{challenge.name}</h1>
                <h2>{challenge.desc}</h2>
                <input type="file" accept="image/*" capture="camera" id={`challenge-upload-${challenge['.key']}`}
                       onChange={()=> {
                         this.handleChallengeInput(challenge['.key'], challenge.name)
                       }}/>
              </li>
            )
          }
        })}
      </ul>
    )


  },

  render() {
    if (this.props.user) {
      return (
        <div>
          <h1>Challenges</h1>
          { this.renderChallenges() }
        </div>
      )
    } else {
      return (<div>Loading User...</div>)
    }

  }
});

export default Challenges;
