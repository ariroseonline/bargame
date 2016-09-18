import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import style from './style.css'
import ReactFireMixin from 'reactfire'
import _ from 'underscore'

let Challenges = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node,
    user: PropTypes.object
  },

  getInitialState() {
    return {
      challenges: []
    }
  },

  componentDidMount() {
    let uid = firebase.auth().currentUser.uid;
    let ref = firebase.database().ref(`users/${uid}/challenges`).orderByChild('level');
    this.bindAsArray(ref, 'challenges');
  },

  handleChallengeInput(challengeKey, challengeName) {
    var fileUpload = document.getElementById(`challenge-upload-${challengeKey}`);
    var file = fileUpload.files[0]; // get the first file uploaded

    // Create the file metadata
    var metadata = {
      contentType: file.type
    };

    //prepare reference file name in Firebase Storage
    var userName = firebase.auth().currentUser.name;
    var formattedChallengeName = challengeName.replace(/\W+/g, '-').toLowerCase();
    var storageRef = firebase.storage().ref(`images/${userName}/${formattedChallengeName}`); //may have to put filetype suffix on this


    //Save
    var uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', function progress(snapshot) {
      console.log('PROGRESS ', (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '%'); // progress of upload
    });

    uploadTask.then((snapshot)=> {
      let uid = firebase.auth().currentUser.uid;
      firebase.database().ref(`users/${uid}/challenges/${challengeKey}`).update({ completed: true })
    });


  },

  renderChallenges() {
      return (
        <ul>
          {this.state.challenges.map((challenge, i)=> {
            console.log('USER', this.props.user, this.props.user.level)
            if (challenge.level <= this.props.user.level) {
              {/*console.log('CHALLENGE', challenge);*/}
              return (
                <li className={challenge.completed ? style.completed :  null} key={i}>
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
