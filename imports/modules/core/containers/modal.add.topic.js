import AddTopicModal from '/imports/modules/core/components/modal.add.topic.jsx'
import {useDeps, composeAll, composeWithTracker} from '/client/config/mantra'

const composer = ({context, postId, follow, unfollow}, onData) => {
  const {LocalState} = context()
  onData(null, {
    isOpen: LocalState.get('SHOW_ADD_TOPIC_MODAL') || false
  })
}

const depsMapper = (context, actions) => ({
  handleClose: actions.topics.hideAddTopicModal,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AddTopicModal)
