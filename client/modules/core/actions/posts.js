import NewPostService from '/client/lib/newpost.service.js'
import TopicActions from './topics.js'

export default {
  create ({Collections, Meteor, LocalState, FlowRouter}, title, content, topics, cb) {
    var errors = NewPostService.validateNewPost({title, content, topics})

    if (errors.length === 0) {
      const id = Meteor.uuid()
      const topicIds = topics.split(',')

      // There is a method stub for this in the configs/method_stubs
      // That's how we are doing latency compensation
      Meteor.call('post/insert', id, title, content, topicIds, (err) => {
        if (err) {
          return cb([{ type: 'server', reason: 'We couldn\'t add your post for some peculiar reason. Probably the tiger ate it.' }])
        }

        LocalState.set('ADD_POST_POPUP_SHOWING', false)
        FlowRouter.go(`/topics/${topicIds[0]}/${id}`)
        return cb()
      })
    } else {
      cb(errors)
    }
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
    let {FlowRouter, LocalState} = context
    const currentRouterPath = FlowRouter.current().path

    var currentTopic = ''
    if (/topics\/.+/.test(currentRouterPath)) {
      const splitted = currentRouterPath.split('/')
      currentTopic = splitted[splitted.indexOf('topics') + 1]
    }

    LocalState.set('ADD_POST_POPUP_SHOWING', true)
    LocalState.set('ADD_POST_TOPICS', currentTopic)
    TopicActions.updateTopicFollowers(context, [currentTopic])
  },

  modifyAddPostTopic ({LocalState}, newTopics) {
    LocalState.set('ADD_POST_TOPICS', newTopics)
  },

  clearAddPostTopics ({LocalState}) {
    LocalState.set('ADD_POST_TOPICS', '')
  },

  closeAddPostPopup ({ LocalState }) {
    LocalState.set('ADD_POST_POPUP_SHOWING', false)
  },

  showUserProfile ({ LocalState }, post) {
    LocalState.set('PROFILE_USER', post.owner)
  },

  showPostFollowers ({ Meteor, LocalState }, followers) {
    LocalState.set('FOLLOWERS_MODAL_OPEN', true)

    Meteor.call('get/followers', followers, (err, res) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }
      LocalState.set('POST_FOLLOWERS', res)
    })
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
