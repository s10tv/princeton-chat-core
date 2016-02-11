import CreatePost from '/imports/modules/core/components/modal.post.create.jsx'
import {useDeps, composeWithTracker, composeAll} from '/client/config/mantra'

export const composer = ({context}, onData) => {
  const { Collections, LocalState } = context()

  const isOpen = LocalState.get('ADD_POST_POPUP_SHOWING') || false
  const allTopics = Collections.Topics.find().map((topic) => {
    return { value: topic._id, label: topic.displayName }
  })

  const numFollowersNotified = LocalState.get('POST_FOLLOWERS') ? LocalState.get('POST_FOLLOWERS').length : 0

  onData(null, { isOpen, allTopics, numFollowersNotified })
}

export const depsMapper = (context, actions) => ({
  create: actions.posts.create,
  handleClose: actions.posts.closeAddPostPopup,
  showTopicFollowers: actions.topics.showTopicFollowers,
  updateTopicFollowers: actions.topics.updateTopicFollowers,
  showSnackbarError: actions.posts.showSnackbarError,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(CreatePost)
