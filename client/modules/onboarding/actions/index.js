/*eslint no-undef: 2*/

import {createOnSubmit} from '/client/lib/helpers'
import UserService from '/lib/user.service'
import { i18n } from '/client/configs/env'
import AmplitudeService from '/client/lib/amplitude.service'

export function redirectIfUrlFound (FlowRouter) {
  if (FlowRouter.current().queryParams.ol) {
    return FlowRouter.go(decodeURIComponent(FlowRouter.current().queryParams.ol))
  }

  return FlowRouter.go('all-mine')
}

export default {
  onboardingManualVerify: {
    submit: createOnSubmit('signup/verifyAffiliation', ({sweetalert}) => {
      AmplitudeService.track('signup/verify', { type: 'manual' })
      sweetalert({
        title: 'All Set',
        text: 'You will receive an email once your affiliation is verified.',
        type: 'success'
      })
    })
  },
  onboardingAutoVerify: {
    submit: createOnSubmit('signup/alumni', ({sweetalert}) => {
      AmplitudeService.track('signup/verify', { type: 'auto' })
      sweetalert({title: 'Invite Sent', text: 'Check your inbox now ;)', type: 'success'})
    })
  },
  onboardingLogin: {
    loginWithFacebook ({Meteor, FlowRouter, sweetalert}) {
      Meteor.loginWithFacebook({}, (err) => {
        if (err) {
          return sweetalert({
            title: 'Facebook Login',
            text: err.reason || err.message, // TODO: Be consistent
            type: 'error'
          })
        }
        AmplitudeService.track('home/login', { type: 'facebook' })
        return redirectIfUrlFound(FlowRouter)
      })
    },
    loginWithPassword ({Meteor, FlowRouter}, info) {
      return new Promise((resolve, reject) => {
        Meteor.loginWithPassword(info.email, info.password, (err) => {
          if (err) {
            const msg = 'Invalid login. Please check your email and password and try again'
            reject({_error: err.error === 403 ? msg : err.reason})
          } else {
            resolve()
            AmplitudeService.track('home/login', { type: 'password' })
            return redirectIfUrlFound(FlowRouter)
          }
        })
      })
    }
  },
  onboardingSignup: {
    createAccount: createOnSubmit('welcome/signup', ({ FlowRouter }) => {
      AmplitudeService.track('onboarding/createAccount', { type: 'password' })
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
          AmplitudeService.track('onboarding/createAccount', { type: 'facebook' })
          return FlowRouter.go('onboarding-subscribe-channels')
        })
      })
    }
  },
  onboardingSubscribeChannels: {
    next ({FlowRouter, sweetalert, Meteor, LocalState}) {
      // TODO: extract this into context
      const currentUser = UserService.currentUser()

      if (currentUser.followingTopics.length < 3) {
        return sweetalert({
          title: 'Subscribe',
          text: `${i18n('title')} will be a lot more interesting the more channels you subscribe. \
            Please subscribe at least 3 before continuing.`
        })
      }

      Meteor.call('user/setStatusActive', (err) => {
        if (err) {
          return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
        }
        AmplitudeService.track('onboarding/subscribeToChannels',
          { numChannels: currentUser.followingTopics.length })
        return FlowRouter.go('onboarding-invite-friends')
      })
    }
  },
  onboardingInviteFriends: {
    submit: createOnSubmit('welcome/invite', ({FlowRouter}, invitees) => {
      AmplitudeService.track('onboarding/inviteFriends', { numInvites: invitees.length })
      FlowRouter.go('all-mine')
    }),
    skipForNow ({FlowRouter}) {
      AmplitudeService.track('onboarding/inviteFriends', { numInvites: 0 })
      FlowRouter.go('all-mine')
    }
  },
  forgotPassword: {
    recover: createOnSubmit('welcome/forgotPassword', ({FlowRouter}) => {
      FlowRouter.go('/forgot-password/email-sent')
    }),
    reset: (context, data) => {
      const {FlowRouter, Accounts} = context
      const token = FlowRouter.current().params.token
      const newPass = data.newPassword
      const matchNewPass = data.matchNewPassword
      return new Promise((resolve, reject) => {
        if (newPass !== matchNewPass) {
          reject({ _error: 'Passwords do not match!' })
        } else {
          Accounts.resetPassword(token, matchNewPass, (err) => {
            if (err) {
              reject({
                ...(typeof err.details === 'object' ? err.details : {}),
                _error: err.reason || 'Sorry, we couldn\'t reset your password'
              })
              console.error('Failure calling method welcome/resetPassword', err)
            } else {
              resolve()
              FlowRouter.go('/forgot-password/success')
            }
          })
        }
      })
    }
  }
}
