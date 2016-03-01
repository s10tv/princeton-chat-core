function getPostFollowers ({Meteor, LocalState, store}, followers, excludeMyself = false) {
  return Meteor.call('get/followers', {followers, excludeMyself}, (err, res) => {
    if (err) {
      return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
    }

    store.dispatch({
      type: 'UPDATE_FOLLOWERS',
      followers: res
    })
  })
}

function updateMentionFollowers ({Meteor, LocalState, store}, mentionedUsernames) {
  return Meteor.call('get/followers', {mentionedUsernames, excludeMyself: true}, (err, res) => {
    if (err) {
      return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
    }

    store.dispatch({
      type: 'UPDATE_MENTION_FOLLOWERS',
      mentions: res
    })
  })
}

export default {
  getPostFollowers,
  updateMentionFollowers,
  getFollowersAndShowModal (context, followers) {
    const {LocalState} = context
    LocalState.set('FOLLOWERS_MODAL_OPEN', true)
    return getPostFollowers(context, followers)
  },

  updateAndShowFollowersModal ({ LocalState, store }, followerList) {
    LocalState.set('FOLLOWERS_MODAL_OPEN', true)
    store.dispatch({
      type: 'UPDATE_FOLLOWERS',
      followers: followerList
    })
  },

  closeModal ({ LocalState }) {
    LocalState.set('FOLLOWERS_MODAL_OPEN', false)
  }
}
