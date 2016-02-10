import { Meteor } from 'meteor/meteor'
import { getParameterByName } from '/imports/libs/urlutil'

export default {
  loginWithPassword ({LocalState, FlowRouter}, email, password) {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        LocalState.set('LOGIN_ERROR', true)
        return LocalState.set(
          'SHOW_GLOBAL_SNACKBAR_WITH_STRING',
          'Email and password not recognized. Have you registered yet?')
      }

      LocalState.set('LOGIN_ERROR', false)

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
        LocalState.set('LOGIN_ERROR', true)
        return LocalState.set(
          'SHOW_GLOBAL_SNACKBAR_WITH_STRING',
          'Email and password not recognized. Have you registered yet?')
      }

      LocalState.set('LOGIN_ERROR', false)

      const redirectUrl = getParameterByName('ol')
      if (redirectUrl && redirectUrl.length > 0) {
        window.location = redirectUrl
        return
      }

      return FlowRouter.go('all-mine')
    })
  }
}
