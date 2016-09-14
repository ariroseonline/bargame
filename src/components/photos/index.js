import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import style from './style.css'

class Photos extends Component {
  componentDidMount() {

  }
  render() {
    return (
        <div>
          <h1>Photos</h1>
          <h2>You've unlocked level _</h2>
          <h3>Here are all photos from level _ and below</h3>
          <ul>
            <li></li>
          </ul>
        </div>
    )
  }
}

Photos.propTypes = {
  children: PropTypes.node
}

export default Photos;
