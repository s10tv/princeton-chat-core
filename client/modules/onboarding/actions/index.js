import {createOnSubmit} from '/client/lib/helpers'
import ErrorHandler from '/client/modules/onboarding/lib/error.handler'
import UserService from '/lib/user.service'

export default {
  requestInvite: {
    verifyAffiliation: createOnSubmit('signup/verifyAffiliation')
  },
  onboardHome: {
    verifyAlumni: createOnSubmit('signup/alumni', ({sweetalert}) => {
      sweetalert({title: 'Invite Sent', text: 'Check your inbox now ;)'})
    })
  },
  onboardSignup: {
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
  },
  onboardChannels: {
    next ({FlowRouter}) {
      // TODO: extract this into context
      const currentUser = UserService.currentUser()

      if (currentUser.followingTopics.length === 0) {
        return ErrorHandler.error('Please follow some topics')
      }

      return FlowRouter.go('invite-friends')
    }
  },
  onboardInvite: {
    invite: createOnSubmit('welcome/invite')
  }
}
