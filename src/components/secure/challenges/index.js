import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import style from './style.scss'
import ReactFireMixin from 'reactfire'
import _ from 'underscore'

let Challenges = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node,
    user: PropTypes.object,
    challenges: PropTypes.array
  },

  getInitialState() {
    return {
      challenges: [],
      currentLevel: null //this doesn't do anything...may want to use it later for cleaner code
    }
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
        newPhoto.level = challenge.val().level;
        let newPhotoKey = firebase.database().ref().child('photos').push().key;

        //save in 2 places per the firebase guidelines for easy-access, efficient, flat data storage
        let updates = {};
        updates['/photos/' + newPhotoKey] = newPhoto;
        updates[`/users/${uid}/challenges/${challengeKey}/photoURL`] = photoURL;
        updates[`/users/${uid}/challenges/${challengeKey}/completed`] = true;


        firebase.database().ref().update(updates).then(()=> {
          //check to see if user has surpassed threshold to get to next level
          this.props.updateUserLevel();
        });
      });


    });
  },

  handleChallengeInput(challengeKey, challengeName) {
    var fileUpload = document.getElementById(`challenge-upload-${challengeKey}`);
    this.savePhoto(fileUpload, challengeKey, challengeName);
  },

  renderChallenges() {
    //find level challenges
    let levelChallenges = _.filter(this.props.challenges, (challenge)=> {
      return challenge.level == this.props.user.level; //Only show challenges from current level
    });

    return (
      <ul className="row">
        {levelChallenges.map((challenge, i)=> {
          if (challenge.level <= this.props.user.level) {
            let styleClass = challenge.completed ? style.completed : "";
            styleClass = styleClass + " col-sm-4";

            return (
              <li className={styleClass} key={i}>
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">{challenge.name}</h3>
                  </div>
                  <div className="panel-body">
                    {challenge.desc}

                    <input type="file" accept="image/*" capture="camera" id={`challenge-upload-${challenge['.key']}`}
                           onChange={()=> {
                             this.handleChallengeInput(challenge['.key'], challenge.name)
                           }}/>
                  </div>
                </div>
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
        <div className="page-header">
          <h1>Challenges <small>Level {this.props.user.level}</small></h1>
          { this.renderChallenges() }
        </div>
      )
    } else {
      return (<div>Loading User...</div>)
    }

  }
});

export default Challenges;
