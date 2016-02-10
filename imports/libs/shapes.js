import React from 'react'

const {string, bool, number, shape, instanceOf} = React.PropTypes

export const postShape = shape({
  _id: string.isRequired,
  title: string.isRequired,
  isFollowing: bool.isRequired,
  numFollowers: number.isRequired,
  content: string.isRequired,
  createdAt: instanceOf(Date).isRequired
})

export const topicShape = shape({
  _id: string.isRequired,
  displayName: string.isRequired,
  description: string.isRequired,
  isFollowing: bool.isRequired,
  numPosts: number.isRequired,
  numFollowers: number.isRequired
})
