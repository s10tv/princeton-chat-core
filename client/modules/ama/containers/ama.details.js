import AmaDetails from '/client/modules/ama/components/ama.details.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import {_} from 'underscore'
import {connect} from 'react-redux'

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

const composer = ({context, params: {amaPostId}, onSpeakerType}, onData) => {
  const {Meteor, UserService, Collections, store} = context
  const {AmaPosts, AmaMessages, AmaActivities, Users} = Collections

  const currentUser = UserService.currentUser()
  const {activityVisibility} = store.getState().ama

  if (Meteor.subscribe('ama', amaPostId).ready()) {
    const amaPost = processAmaPost(context, AmaPosts.findOne(amaPostId))
    const activityOptions = activityVisibility === 'mine'
      ? { originatorUserId: amaPost.speakerId }
      : {}
    const activities = processActivities(context, amaPost,
      AmaActivities.find(activityOptions, {sort: {createdAt: -1}}).fetch())

    const messages = processMessages(context, AmaMessages.find().fetch())

    const participantCount = amaPost.participants.length
    const participants = amaPost.participants.slice(0, 6).map((participant) => {
      return UserService.getUserView(Users.findOne(participant.userId))
    })

    onData(null, Object.assign({}, amaPost, {
      isLive: new Date() > amaPost.startTime && amaPost.type !== 'past',
      participants,
      participantCount,
      currentUser,
      activities,
      messages,
      isSpeaker: currentUser._id === amaPost.speaker._id,
      speakerisTyping: amaPost.speakerisTyping,
      store: context.store
    }))
  }
}

const depsMapper = (context, actions) => ({
  askQuestion: actions.amaMessages.askQuestion,
  showMenu: actions.amaHeader.fbShare,
  twitterShare: actions.amaHeader.twitterShare,
  fbShare: actions.amaHeader.fbShare,
  reply: actions.amaMessages.reply,
  toggleFeedFilter: actions.amaFeed.toggleFilter,
  setReplyToPost: actions.amaMessages.setReplyToPost,
  clearScrollToMsgId: actions.amaMessages.clearScrollToMsgId,
  store: context.store,
  context
})

const mapStateToProps = (state) => ({
  scrollToMsgId: state.ama.scrollToMsgId.scrollToMsgId
})

export default composeAll(
  connect(mapStateToProps),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AmaDetails)
