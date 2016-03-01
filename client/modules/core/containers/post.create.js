import CreatePost from '/client/modules/core/components/post.create.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {newPostValidator} from '/lib/validation/core'
import {CreateNewPostPhoto} from '/client/lib/unsplash.service.js'

export const formConfig = {
  form: 'post/create',
  fields: ['title', 'content', 'topicIds'],
  validate: newPostValidator,
  normalize: {}
}

export const composer = ({context}, onData) => {
  const {Collections} = context()

  const allTopics = Collections.Topics.find().map((topic) => {
    return { value: topic._id, label: topic.displayName }
  })

  // as this screen uses the menu from post list, it needs a to be a 'topic' to pass in to the menu
  const createPostTopicWrapper = {
    displayName: 'Create New Post',
    cover: CreateNewPostPhoto,
    followers: []
  }

  onData(null, {
    allTopics,
    createPostTopicWrapper
  })
}

export const depsMapper = (context, actions) => ({
  onSubmit: actions.posts.create,
  showTopicFollowers: actions.topics.showTopicFollowers,
  updateTopicFollowers: actions.topics.updateTopicFollowers,
  showSnackbarError: actions.posts.showSnackbarError,
  parseAndFetchMentions: actions.search.parseAndFetchMentions,
  clearMentions: actions.search.clearMentions,
  replaceWithMention: actions.search.replaceWithMention,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig, (state) => ({ // mapStateToProps
    numFollowersNotified: state.core.followers.length,
    mentions: state.core.mentions,
    initialValues: {
      topicIds: state.core.newPostTopics
    }
  })),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(CreatePost)
