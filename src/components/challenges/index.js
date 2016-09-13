import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import style from './style.css'

class Challenges extends Component {
  render() {
    return (
        <div>
          <h1>Challenges</h1>
        </div>
    )
  }
}

Challenges.propTypes = {
  children: PropTypes.node
}

export default Challenges;
