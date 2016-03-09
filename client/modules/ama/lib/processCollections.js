import {_} from 'underscore'

export const processActivities = (context, amaPost, activities) => {
  const {Collections, UserService} = context
  const {Users, AmaMessages} = Collections
  return activities.map((activity) => {
    return Object.assign({}, activity, {
      isMine: activity.originatorUserId === amaPost.speakerId,
      owner: UserService.getUserView(Users.findOne(activity.originatorUserId)),
      message: AmaMessages.findOne(activity.amaMessageId)
    })
  })
}

export const processMessages = (context, messages) => {
  const {Collections, UserService} = context
  const {Users} = Collections

  const processedMessages = messages
    .map((message) => {
      return Object.assign({}, message, {
        owner: UserService.getUserView(Users.findOne(message.ownerId))
      })
    })

  const sortedMessages = _.sortBy(processedMessages, (msg) => {
    return msg.upvotedUsers && msg.upvotedUsers.length
  }).reverse()

  const groupedBy = _.groupBy(sortedMessages, 'parentMessageId')

  return sortedMessages.filter((message) => message.parentMessageId === undefined)
    .map((message) => {
      const replies = groupedBy[message._id] || []

      return Object.assign(message, {
        replies: _.sortBy(replies, (reply) => reply.createdAt)
      })
    })
}

export const processAmaPost = (context, post) => {
  if (!post) {
    return {}
  }
  const {Collections, UserService} = context
  const {Users} = Collections
  return Object.assign({}, post, {
    speaker: UserService.getUserView(Users.findOne(post.speakerId))
  })
}
