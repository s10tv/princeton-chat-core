export default {
  create ({Meteor, LocalState, store}, content, postId) {
    const id = Meteor.uuid()

    // There is a method stub for this in the configs/method_stubs
    // That's how we are doing latency compensation
    Meteor.call('messages/insert', id, postId, content, (err) => {
      if (err) {
        return LocalState.set('MESSGE_SEND_ERROR', err.message)
      }

      store.dispatch({ type: 'CLEAR_MENTIONS' })
    })
  },

  delete ({Collections, Meteor}, messageId) {
    Meteor.call('messages/delete', messageId)
  },

  showUserProfile ({LocalState, Meteor}, message) {
    LocalState.set('PROFILE_USER', message.owner)
  },

  messageLinkOnClick ({LocalState, Collections, UserService}, event) {
    const re = /^tc:\/\/users\//
    if (re.test(event.target.href)) {
      event.preventDefault()
      const username = event.target.href.replace('tc://users/', '')
      const user = Collections.Users.findOne({username})
      console.log('im calld')
      console.log(user)
      if (user) {
        LocalState.set('PROFILE_USER', UserService.getUserView(user))
      }
    } else {
      return true
    }
  }
}
