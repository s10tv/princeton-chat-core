export default {
  clickFacebook ({Meteor, LocalState}) {
    Meteor.linkWithFacebook({}, (err) => {
      if (err) {
        LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.message)
        return
      }

      Meteor.call('welcome/setLoginService', 'facebook', (err) => {
        if (err) {
          LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
          return
        }

        LocalState.set('ONBOARDING_SHOW_FOLLOW_TOPIC', true)
      })
    })
  },

  addPassword ({Meteor, Accounts, LocalState}, pwd) {
    if (pwd) {
      Meteor.call('welcome/setLoginService', 'password', (err) => {
        if (err) {
          LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
          return
        }

        Accounts.changePassword(Meteor.user().inviteCode, pwd, (err) => {
          if (err) {
            LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
            return
          }

          LocalState.set('ONBOARDING_SHOW_FOLLOW_TOPIC', true)
        })
      })
    }
  },

  closeSnackbar ({LocalState}) {
    LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', null)
  }
}
