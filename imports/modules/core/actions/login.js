import { Meteor } from 'meteor/meteor'
import { getParameterByName } from '/imports/libs/urlutil'

export default {
  loginWithPassword ({LocalState, FlowRouter}, email, password) {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        return LocalState.set(
          'SHOW_GLOBAL_SNACKBAR_WITH_STRING',
          'Email and password not recognized. Have you registered yet?')
      }

      const redirectUrl = getParameterByName('ol')
      if (redirectUrl && redirectUrl.length > 0) {
        window.location = redirectUrl
        return
      }

      return FlowRouter.go('all-mine')
    })
  },

  loginWithFacebook ({LocalState, FlowRouter}) {
    Meteor.loginWithFacebook((err) => {
      if (err) {
        return LocalState.set(
          'SHOW_GLOBAL_SNACKBAR_WITH_STRING',
          'Email and password not recognized. Have you registered yet?')
      }

      const redirectUrl = getParameterByName('ol')
      if (redirectUrl && redirectUrl.length > 0) {
        window.location = redirectUrl
        return
      }

      return FlowRouter.go('all-mine')
    })
  }
}
