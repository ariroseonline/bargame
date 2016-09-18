import React from 'react';
import _ from 'underscore';
import settings from '../../settings';

var Register = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      error: false
    }
  },

  handleSubmit: function (e) {
    e.preventDefault();
    var email = this.refs.email.value;
    var pw = this.refs.pw.value;

    // Add signup event
    // TODO: Fazer validação de formulário
    firebase.auth().createUserWithEmailAndPassword(email, pw)
      .then((user)=> {
        //load up user challenges
        this.initUserInDB(user)
      })
      .catch(()=> {
        this.setState({error: e.message})
      });
  },

  initUserInDB(user) {
    // 1) first, initialize user challenges from the stockpile of challenges

    //get all challenges
    firebase.database().ref('/challenges').once('value').then((snapshot)=> {

      let challenges = snapshot.val();

     //convert stupid firebase to managemable collections with ids
      var arr = [];
      for(var challengeId in challenges) {
        arr.push(challenges[challengeId]);
      }

      //pick X number from each level
      //group by level
      let challengesByLevel = _.groupBy(challenges, function (challenge) {
        return challenge.level;
      })


      //then randomly grab X number
      let userChallengesByLevel = _.mapObject(challengesByLevel, function (level) {
        return _.sample(level, settings.challengesPerLevel);
      })

      //flatten out levels so it's just challenges
      let userChallenges = _.flatten(_.values(userChallengesByLevel))


      //save user with user challenges to db
      firebase.database().ref(`users/${user.uid}`).set({
        provider: user.providerData[0].providerId,
        name: user.providerData[0].displayName,
        email: user.providerData[0].email,
        level: 2
      });

      var userChallengesObj = {};

      userChallenges.forEach(function(challenge) {
        var challengeKey = firebase.database().ref(`users/${user.uid}/challenges`).push().key;
        userChallengesObj[challengeKey] = challenge;
      });

      firebase.database().ref(`users/${user.uid}/challenges`).set(userChallengesObj).then(()=>{
        //finally transition to challenges
        this.context.router.replace('/challenges')

      })



    });

  },

  render: function () {
    var errors = this.state.error ? <p> {this.state.error} </p> : '';
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1> Register </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label> Email </label>
            <input className="form-control" ref="email" placeholder="Email"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input ref="pw" type="password" className="form-control" placeholder="Password"/>
          </div>
          {errors}
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
    )
  }
});

export default Register;
