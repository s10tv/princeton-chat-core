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
    createAccount: createOnSubmit('welcome/signup', ({ FlowRouter }) => {
      FlowRouter.go('onboard-subscribe-channels')
    }),
    linkWithFacebook ({Meteor, FlowRouter, sweetalert}) {
      Meteor.linkWithFacebook({}, (err) => {
        if (err) {
          return sweetalert({ title: 'Problem linking Facebook', text: err.message })
        }

        Meteor.call('welcome/linkfacebook', (err) => {
          if (err) {
            return sweetalert({ title: 'Problem linking Facebook', text: err.reason })
          }
          return FlowRouter.go('onboard-subscribe-channels')
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
