import {createOnSubmit} from '/client/lib/helpers'
import UserService from '/lib/user.service'
import { i18n } from '/client/configs/env'

export default {
  onboardingManualVerify: {
    submit: createOnSubmit('signup/verifyAffiliation', ({sweetalert}) => {
      sweetalert({title: 'All Set', text: 'We will email you to get in touch once we verify your affiliation', type: 'success'})
    })
  },
  onboardingAutoVerify: {
    submit: createOnSubmit('signup/alumni', ({sweetalert}) => {
      sweetalert({title: 'Invite Sent', text: 'Check your inbox now ;)', type: 'success'})
    })
  },
  onboardingLogin: {
    loginWithFacebook ({ Meteor, FlowRouter, sweetalert }) {
      Meteor.loginWithFacebook({}, (err) => {
        if (err) {
          return sweetalert({
            title: 'Facebook Login',
            text: err.reason || err.message, // TODO: Be consistent
            type: 'error',
          })
        }
        return FlowRouter.go('all-mine')
      })
    },
    loginWithPassword ({Meteor}, info) {
      return new Promise((resolve, reject) => {
        Meteor.loginWithPassword(info.email, info.password, (err) => {
          if (err) {
            const msg = 'Invalid login. Please check your email and password and try again'
            reject({_error: err.error === 403 ? msg : err.reason})
          } else {
            resolve()
            FlowRouter.go('all-mine')
          }
        })
      })
    }
  },
  onboardingSignup: {
    createAccount: createOnSubmit('welcome/signup', ({ FlowRouter }) => {
      FlowRouter.go('onboarding-subscribe-channels')
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
          return FlowRouter.go('onboarding-subscribe-channels')
        })
      })
    }
  },
  onboardingSubscribeChannels: {
    next ({FlowRouter, sweetalert}) {
      // TODO: extract this into context
      const currentUser = UserService.currentUser()

      if (currentUser.followingTopics.length < 3) {
        return sweetalert({
          title: 'Subscribe',
          text: `${i18n('title')} will be a lot more interesting the more channels you subscribe. \
            Please subscribe at least 3 before continuing.`
        })
      }

      return FlowRouter.go('onboarding-invite-friends')
    }
  },
  onboardingInviteFriends: {
    submit: createOnSubmit('welcome/invite', ({FlowRouter}) => {
       FlowRouter.go('all-mine')
    })
  }
}
