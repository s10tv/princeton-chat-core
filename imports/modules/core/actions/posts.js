import NewPostService from '/imports/libs/newpost.service'

export default {
  create ({Collections, Meteor, LocalState, FlowRouter}, title, content, topics, cb) {
    var errors = NewPostService.validateNewPost({title, content, topics})

    if (errors.length === 0) {
      const id = Meteor.uuid()
      const topicIds = topics.split(',')

      // There is a method stub for this in the config/method_stubs
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

  showSnackbarError ({LocalState}, error) {
    LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', error)
  },

  showAddPostPopup ({ LocalState }) {
    LocalState.set('ADD_POST_POPUP_SHOWING', true)
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
  }
}
