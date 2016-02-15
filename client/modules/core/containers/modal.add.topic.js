import AddTopicModal from '/client/modules/core/components/modal.add.topic.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import NewTopicService from '/lib/newtopic.service.js'

const composer = ({context, shouldRedirectToNewTopic}, onData) => {
  const {LocalState} = context()

  const currentCoverPhoto = LocalState.get('ADD_TOPIC_MODAL_CURRENT_COVER_PHOTO') || {
    url: 'https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&w=1080&fit=max&s=666820400c862a9d48c03ecb1cd2a661'
  }

  if (shouldRedirectToNewTopic === undefined) {
    shouldRedirectToNewTopic = true
  }

  onData(null, {
    isOpen: LocalState.get('SHOW_ADD_TOPIC_MODAL') || false,
    currentCoverPhoto,
    shouldRedirectToNewTopic
  })
}

const depsMapper = (context, actions) => ({
  handleClose: actions.topics.hideAddTopicModal,
  showAddTopicCoverPhotoModal: actions.topics.showAddTopicCoverPhotoModal,
  validateTopicName: NewTopicService.validateTopicName,
  validateTopicDescription: NewTopicService.validateTopicDescription,
  showSnackbarWithString: actions.topics.showSnackbarWithString,
  createTopic: actions.topics.createTopic,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(AddTopicModal)
