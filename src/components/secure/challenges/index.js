import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import style from './style.css'
import ReactFireMixin from 'reactfire'

let Challenges = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node
  },

  getInitialState() {
    return {
      challenges: [],
    }
  },

  componentDidMount: function() {
      let ref = firebase.database().ref('challenges').orderByChild('level').equalTo(1);
      // this.bindAsObject(ref, 'challenges');

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
