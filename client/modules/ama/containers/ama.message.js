import {composeAll, useDeps, composeWithTracker} from 'mantra-core'
import {connect} from 'react-redux'
import {Message} from '/client/modules/ama/components/ama.message.jsx'

const mapStateToProps = (state, ownProps) => ({
  isReplyBoxOpen: state.ama.openReplies.includes(ownProps.message._id)
})

const composer = ({context, amaPostId, message}, onData) => {
  const { Meteor } = context
  onData(null, {
    isUpvoted: message.upvotedUsers.indexOf(Meteor.userId()) !== -1
  })
}

const depsMapper = (context, actions) => ({
  reply: actions.amaMessages.reply,
  openReplyBox: actions.amaMessages.openReplyBox,
  onSpeakerType: actions.amaMessages.onSpeakerType,
  upVote: actions.amaMessages.upVote,
  store: context.store,
  context: context
})

export default composeAll(
  connect(mapStateToProps),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Message)
