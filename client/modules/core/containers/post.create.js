import CreatePost from '/client/modules/core/components/modal.post.create.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'

export const composer = ({context}, onData) => {
  const { Collections, LocalState } = context()

  const isOpen = LocalState.get('ADD_POST_POPUP_SHOWING') || false
  const allTopics = Collections.Topics.find().map((topic) => {
    return { value: topic._id, label: topic.displayName }
  })

  const numFollowersNotified = LocalState.get('POST_FOLLOWERS')
    ? LocalState.get('POST_FOLLOWERS').length
    : 0
  const topicIds = LocalState.get('ADD_POST_TOPICS')

  onData(null, {
    isOpen,
    allTopics,
    topicIds,
    numFollowersNotified
  })
}

export const depsMapper = (context, actions) => ({
  create: actions.posts.create,
  handleClose: actions.posts.closeAddPostPopup,
  showTopicFollowers: actions.topics.showTopicFollowers,
  modifyAddPostTopic: actions.posts.modifyAddPostTopic,
  clearAddPostTopics: actions.posts.clearAddPostTopics,
  updateTopicFollowers: actions.topics.updateTopicFollowers,
  showSnackbarError: actions.posts.showSnackbarError,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(CreatePost)
