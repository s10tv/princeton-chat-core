import React from 'react'

const {string, bool, number, array, shape, instanceOf, any, func} = React.PropTypes

export const imageShape = shape({
  url: string.isRequired
})

export const userShape = shape({
  followingTopics: array.isRequired,
  followingPosts: array.isRequired,
  status: string.isRequired,
  avatar: imageShape.isRequired,
  displayUsername: string.isRequired,
  avatarInitials: string.isRequired,
  displayName: string.isRequired,
  displayEmail: string.isRequired
})

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

export const fieldShape = shape({
  name: string.isRequired,
  touched: bool.isRequired,
  dirty: bool.isRequired,
  valid: bool.isRequired,
  active: bool.isRequired,
  visited: bool.isRequired,
  onBlur: func.isRequired,
  onChange: func.isRequired,
  onDragStart: func.isRequired,
  onDrag: func,
  onFocus: func.isRequired,
  error: string,
  value: any
})

export const arrayFieldShape = shape({
  addField: func.isRequired,
  removeField: func.isRequired,
  swapField: func.isRequired
})
