import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import style from './style.css'
import ReactFireMixin from 'reactfire'

let Challenge = React.createClass({
  mixins: [ReactFireMixin],

  propTypes: {
    children: PropTypes.node,
    route: PropTypes.object //really looking for a way to validate route.user
  },

  getInitialState() {
    return {
      challenge: {}
    }
  },

  componentDidMount() {
    let ref = firebase.database().ref('challenges/' + this.props.params.challenge_id);
    this.bindAsObject(ref, 'challenge');


  },


  render() {
    setTimeout(function() {
      console.log(this.state.challenge)
    }.bind(this), 2000)
    return (
      <div>
        <h1>{this.state.challenge.name}</h1>
        <h2>{this.state.challenge.desc}</h2>
        <input type="file" accept="image/*" capture="camera" id="file-upload" />
      </div>
    )
  }
});

export default Challenge;
