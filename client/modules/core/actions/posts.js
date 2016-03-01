import {createOnSubmit} from '/client/lib/helpers'
import TopicActions from './topics.js'
import AmplitudeService from '/client/lib/amplitude.service'

export default {
  create (context, info = {}) {
    const {Meteor} = context

    info._id = Meteor.uuid()
    info.topicIds = info.topicIds.split(',')

    return createOnSubmit('post/insert', ({FlowRouter, LocalState}) => {
      AmplitudeService.track('success/post/create')
      FlowRouter.go(`/topics/${info.topicIds[0]}/${info._id}`)
    })(context, info)
  },

  fetchMentions ({LocalState, Meteor}, username, callback) {
    const cached = LocalState.get(username)
    if (cached) {
      return callback(cached)
    }

    Meteor.call('search/username', username, (err, res) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }

      return callback(res)
    })
  },

  showSnackbarError ({LocalState}, error) {
    LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', error)
  },

  showAddPostPopup (context) {
    let {FlowRouter, LocalState, store} = context
    const currentRouterPath = FlowRouter.current().path

    var currentTopic = ''
    if (/topics\/.+/.test(currentRouterPath)) {
      const splitted = currentRouterPath.split('/')
      currentTopic = splitted[splitted.indexOf('topics') + 1]
    }

    store.dispatch({
      type: 'ADD_POST_TOPICS',
      topics: currentTopic
    })
    TopicActions.updateTopicFollowers(context, [currentTopic])
    LocalState.set('SHOW_SIDE_BAR', false)
    FlowRouter.go('add-post')
    AmplitudeService.track('start/post/create')
  },

  hasInteractedWithCreatePost ({ sweetalert, store }) {
    const form = store.getState().form['post/create']
    return form && ((form.title && form.title.value) || (form.content && form.content.value))
  },

  showUserProfile ({ LocalState }, post) {
    LocalState.set('PROFILE_USER', post.owner)
  },

  follow ({ Meteor }, postId) {
    Meteor.call('post/follow', postId)
  },

  unfollow ({ Meteor }, postId) {
    Meteor.call('post/unfollow', postId)
  },

  deletePost ({ Meteor, FlowRouter, LocalState }, postId) {
    Meteor.call('post/delete', postId, (err, redirectTopicUrl) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }

      FlowRouter.go(redirectTopicUrl)
    })
  }
}
