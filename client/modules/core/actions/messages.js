import { Meteor } from 'meteor/meteor'
import UserService from '/lib/user.service'

export default {
  create ({Collections, LocalState, handleClose}, content, postId) {
    const id = Meteor.uuid()

    // There is a method stub for this in the configs/method_stubs
    // That's how we are doing latency compensation
    Meteor.call('messages/insert', id, postId, content, (err) => {
      if (err) {
        return LocalState.set('MESSGE_SEND_ERROR', err.message)
      }
    })
  },

  delete ({Collections, Meteor}, messageId) {
    Meteor.call('messages/delete', messageId)
  },

  showUserProfile ({LocalState, Meteor}, message) {
    LocalState.set('PROFILE_USER', message.owner)
  },

  messageLinkOnClick ({LocalState, Collections}, event) {
    const re = /^tc:\/\/users\//
    if (re.test(event.target.href)) {
      event.preventDefault()
      const username = event.target.href.replace('tc://users/', '')
      const user = Collections.Users.findOne({username})
      if (user) {
        LocalState.set('PROFILE_USER', UserService.getUserView(user))
      }
    } else {
      return true
    }
  }
}
