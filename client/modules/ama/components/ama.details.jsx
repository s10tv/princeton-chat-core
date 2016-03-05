import React, {PropTypes} from 'react'
import {imageShape, userShape} from '/client/lib/shapes'

export default React.createClass({
  propTypes: {
    currentUser: userShape.isRequired,
    isLive: PropTypes.bool.isRequired,
    cover: imageShape.isRequired,
    title: PropTypes.string.isRequired,
    introText: PropTypes.string.isRequired,
    speakerTagline: PropTypes.string,
    speaker: userShape.isRequired,
    participants: PropTypes.arrayOf(userShape).isRequired,
    activities: PropTypes.arrayOf(PropTypes.shape({
      isMine: PropTypes.bool.isRequired,
      owner: userShape.isRequired,
      message: PropTypes.shape({
        _id: PropTypes.string.isRequired
      }),
      createdAt: PropTypes.object.isRequired
    }))
  },

  render () {
    return <h1>Hello</h1>
  }
})
