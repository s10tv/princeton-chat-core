import CreatePost from '/client/modules/core/components/modal.post.create.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {newPostValidator} from '/lib/validation/core'

export const formConfig = {
  form: 'post/create',
  fields: ['title', 'content', 'topicIds'],
  validate: newPostValidator,
  normalize: {}
}

export const composer = ({context}, onData) => {
  const { Collections, LocalState } = context()

  const isOpen = LocalState.get('ADD_POST_POPUP_SHOWING') || false
  const allTopics = Collections.Topics.find().map((topic) => {
    return { value: topic._id, label: topic.displayName }
  })

  const numFollowersNotified = LocalState.get('POST_FOLLOWERS')
    ? LocalState.get('POST_FOLLOWERS').length
    : 0

  onData(null, {
    isOpen,
    allTopics,
    numFollowersNotified
  })
}

export const depsMapper = (context, actions) => ({
  onSubmit: actions.posts.create,
  handleClose: actions.posts.closeAddPostPopup,
  showTopicFollowers: actions.topics.showTopicFollowers,
  updateTopicFollowers: actions.topics.updateTopicFollowers,
  showSnackbarError: actions.posts.showSnackbarError,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig, (state) => ({ // mapStateToProps
    initialValues: {
      topicIds: state.core.newPostTopics
    }
  })),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(CreatePost)
