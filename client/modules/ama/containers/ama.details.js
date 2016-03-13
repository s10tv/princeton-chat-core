import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import {connect} from 'react-redux'
import {processActivities, processAmaPost, processMessages} from '../lib/processCollections'
import AmaDetails from '/client/modules/ama/components/ama.details.jsx'

// closing sidebar on a component level causes
// meteor to lose reasctivity, so we close the sidebar on a container level
var sidebarClosed = false

const composer = ({context, params: {amaPostId}, closeSidebar}, onData) => {
  if (!sidebarClosed) {
    closeSidebar()
    sidebarClosed = true
  }

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
      speakerId: amaPost.speaker._id,
      speakerisTyping: amaPost.speakerisTyping
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
  toggleAside: actions.amaHeader.toggleAside,
  messageLinkOnClick: actions.messages.messageLinkOnClick,
  showUserProfile: actions.profile.showUserProfile,
  closeSidebar: actions.sidebar.close,
  store: context.store,
  context
})

const mapStateToProps = (state) => ({
  scrollToMsgId: state.ama.scrollToMsgId,
  overideAsideOpen: state.ama.overideAsideOpen,
  isMobile: state.browser.lessThan.medium
})

export default composeAll(
  connect(mapStateToProps),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AmaDetails)
