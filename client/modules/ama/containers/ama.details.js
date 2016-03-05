import AmaDetails from '/client/modules/ama/components/ama.details.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import {_} from 'underscore'

const processActivities = (context, amaPost, activities) => {
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

const processMessages = (context, messages) => {
  const {Collections, UserService} = context
  const {Users} = Collections

  const processedMessages = messages
  .map((message) => {
    return Object.assign({}, message, {
      owner: UserService.getUserView(Users.findOne(message.ownerId))
    })
  })

  const groupedBy = _.groupBy(messages, 'parentMessageId')

  return processedMessages.filter((message) => message.parentMessageId === undefined)
  .map((message) => {
    return Object.assign(message, {
      replies: groupedBy[message._id] || []
    })
  })
}

const processAmaPost = (context, post) => {
  if (!post) {
    return {}
  }
  const {Collections, UserService} = context
  const {Users} = Collections
  return Object.assign({}, post, {
    speaker: UserService.getUserView(Users.findOne(post.speakerId))
  })
}

const composer = ({context, amaPostId}, onData) => {
  const {Meteor, UserService, Collections, store} = context
  const {AmaPosts, AmaMessages, AmaActivities} = Collections

  const currentUser = UserService.currentUser()
  const {activityVisibility} = store.getState().ama

  if (Meteor.subscribe('ama', amaPostId).ready()) {
    const amaPost = processAmaPost(context, AmaPosts.findOne(amaPostId))

    const actiityOptions = activityVisibility === 'mine'
      ? { originatorUserId: amaPost.speakerId }
      : {}
    const activities = processActivities(context, amaPost,
      AmaActivities.find(actiityOptions, {sort: {createdAt: -1}}).fetch())

    const messages = processMessages(context, AmaMessages.find().fetch())
    const participants = amaPost.participants.map((participant) => (
      UserService.getUserView(participant)
    ))

    onData(null, Object.assign({}, amaPost, {
      isLive: new Date() > amaPost.endTime || amaPost.type === 'past',
      participants,
      currentUser,
      activities,
      messages,
      speakerisTyping: amaPost.speakerisTyping
    }))
  }
}

const depsMapper = (context, actions) => {
  return {
    context
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AmaDetails)
