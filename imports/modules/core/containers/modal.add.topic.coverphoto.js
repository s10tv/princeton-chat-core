import AddTopicModal from '/imports/modules/core/components/modal.add.topic.coverphoto.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'

const composer = ({context, postId, follow, unfollow}, onData) => {
  const {LocalState} = context()
  onData(null, {
    isOpen: LocalState.get('SHOW_ADD_TOPIC_MODAL_COVER_PHOTO') || false
  })
}

const depsMapper = (context, actions) => ({
  handleClose: actions.topics.hideAddTopicCoverPhotoModal,
  chooseCoverPhoto: actions.topics.chooseCoverPhoto,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AddTopicModal)
