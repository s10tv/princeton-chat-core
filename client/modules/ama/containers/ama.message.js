import {Message} from '/client/modules/ama/components/ama.message.jsx'
import {composeAll, useDeps, composeWithTracker} from 'mantra-core'
import {composeWithRedux} from '/client/lib/helpers'

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
  store: context.store,
  upVote: actions.amaMessages.upVote,
  context: context
})

function onReduxPropsChange ({store, message}) {
  return {
    isReplyBoxOpen: store.getState().ama.openReplies[message._id] === true
  }
}

export default composeAll(
  composeWithTracker(composer),
  composeWithRedux(onReduxPropsChange),
  useDeps(depsMapper)
)(Message)
