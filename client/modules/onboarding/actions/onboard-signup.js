import ErrorHandler from '/client/modules/onboarding/lib/error.handler'

export default {
  createAccount ({Meteor}, info) {
  },

  linkWithFacebook ({Meteor, FlowRouter}) {
    Meteor.call('welcome/linkfacbeook', () => {
      Meteor.loginWithFacebook({}, (err) => {
        if (err) {
          return ErrorHandler.error(err)
        }

        if (Meteor.user().emails.length === 0) {
          // make sure the user enters an email
          return FlowRouter.go('/o')
        }
        return FlowRouter.go('/o')
      })
    })
  }
}
