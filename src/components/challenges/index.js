import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import style from './style.css'

let Challenges = React.createClass({
  propTypes: {
    children: PropTypes.node
  },

  render() {
    return (
      <div>
        <h1>Challenges</h1>
      </div>
    )
  }
});

export default Challenges;
