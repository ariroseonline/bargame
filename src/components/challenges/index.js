import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import style from './style.css'
import ReactFireMixin from 'reactfire'
import getUser from '../../util/attachFirebaseAuthListener'

let Challenges = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node,
    user: PropTypes.object
  },

  getInitialState() {
    return {
      challenges: [],
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.user && !this.state.challenges.length) { //just checking to see if this work hasn't already been done. This lifecycle methods is prone to be called multiple times.
      let ref = firebase.database().ref('challenges').orderByChild('level').equalTo(nextProps.user.level + 1);
      this.bindAsObject(ref, 'challenges');
    }
  },

  renderChallenges() {
    return (
      <ul>
        {this.state.challenges.map(function(challenge, i){
          console.log('CHALLENGE',challenge)
          return <li key={i}>
            <h1>{challenge.name}</h1>
            <h2>{challenge.desc}</h2>
            <Link to={`/challenges/${challenge.id}`}>Select</Link>
            </li>
        })}
      </ul>
    )
  },

  render() {
    return (
      <div>
        <h1>Challenges</h1>
        { this.renderChallenges() }
      </div>
    )
  }
});

export default Challenges;
