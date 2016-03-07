import {createOnSubmit} from '/client/lib/helpers'
import AmplitudeService from '/client/lib/amplitude.service'

export default {
  create (context, info = {}) {
    const {Meteor} = context

    info._id = Meteor.uuid()
    info.topicIds = info.topicIds.split(',')

    return createOnSubmit('post/insert', ({history}) => {
      AmplitudeService.track('success/post/create')
      history.push(`/channels/${info.topicIds[0]}/${info._id}`)
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

  deletePost ({ Meteor, history, LocalState }, postId) {
    Meteor.call('post/delete', postId, (err, redirectTopicUrl) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }

      history.push(redirectTopicUrl)
    })
  }
}
