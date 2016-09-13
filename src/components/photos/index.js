import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import style from './style.css'

class Photos extends Component {
  render() {
    return (
        <div>
          <h1>Photos</h1>
        </div>
    )
  }
}

Photos.propTypes = {
  children: PropTypes.node
}

export default Photos;
