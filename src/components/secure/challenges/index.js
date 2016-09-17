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
      level: 0
    }
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.user) {
      this.setState({
        level: nextProps.user.level
      });
    }


  },

  componentDidMount: function() {
    let ref = firebase.database().ref('challenges').orderByChild('level');
      this.bindAsObject(ref, 'challenges');

  },

  renderChallenges() {
    return (
      <ul>
        {this.state.challenges.map((challenge, i)=>{
          if(challenge.level <= this.state.level) {
            return (<li key={i}>
              <h1>{challenge.name}</h1>
              <h2>{challenge.desc}</h2>
              <Link to={`/challenges/${challenge.id}`}>Select</Link>
            </li>)
          }

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
