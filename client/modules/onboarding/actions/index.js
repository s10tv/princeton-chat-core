/*eslint no-undef: 2*/

import {createOnSubmit} from '/client/lib/helpers'
import UserService from '/lib/user.service'
import { i18n } from '/client/configs/env'
import AmplitudeService from '/client/lib/amplitude.service'

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
    loginWithFacebook ({Meteor, history, sweetalert}) {
      Meteor.loginWithFacebook({}, (err) => {
        if (err) {
          return sweetalert({
            title: 'Facebook Login',
            text: err.reason || err.message, // TODO: Be consistent
            type: 'error'
          })
        }
        AmplitudeService.track('home/login', { type: 'facebook' })
        history.push('/')
      })
    },
    loginWithPassword ({Meteor, history}, info) {
      return new Promise((resolve, reject) => {
        Meteor.loginWithPassword(info.email, info.password, (err) => {
          if (err) {
            const msg = 'Invalid login. Please check your email and password and try again'
            reject({_error: err.error === 403 ? msg : err.reason})
          } else {
            resolve()
            AmplitudeService.track('home/login', { type: 'password' })
            history.push('/')
          }
        })
      })
    }
  },
  onboardingSignup: {
    createAccount: createOnSubmit('welcome/signup', ({ history }) => {
      AmplitudeService.track('onboarding/createAccount', { type: 'password' })
      history.push('/welcome/enter-names')
    }),
    linkWithFacebook ({Meteor, history, sweetalert}) {
      Meteor.linkWithFacebook({}, (err) => {
        if (err) {
          return sweetalert({ title: 'Problem linking Facebook', text: err.message })
        }

        Meteor.call('welcome/linkfacebook', (err) => {
          if (err) {
            return sweetalert({ title: 'Problem linking Facebook', text: err.reason })
          }
          AmplitudeService.track('onboarding/createAccount', { type: 'facebook' })
          history.push('/welcome/enter-names')
        })
      })
    }
  },
  onboardingEnterNames: {
    submit: createOnSubmit('welcome/enternames', ({history}) => {
      AmplitudeService.track('onboarding/enternames')
      history.push('/welcome/subscribe-channels')
    })
  },
  onboardingSubscribeChannels: {
    next ({history, sweetalert, Meteor, LocalState}) {
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
        return history.push('/welcome/invite-friends')
      })
    }
  },
  onboardingInviteFriends: {
    submit: createOnSubmit('welcome/invite', ({history}, invitees) => {
      AmplitudeService.track('onboarding/inviteFriends', { numInvites: invitees.length })
      history.push('/')
    }),
    skipForNow ({history}) {
      AmplitudeService.track('onboarding/inviteFriends', { numInvites: 0 })
      history.push('/')
    }
  },
  forgotPassword: {
    recover: createOnSubmit('welcome/forgotPassword', ({history}) => {
      history.push('/forgot-password/email-sent')
    }),
    reset: (context, data) => {
      const {history, Accounts} = context
      const {token, newPassword, matchNewPassword} = data
      return new Promise((resolve, reject) => {
        if (newPassword !== matchNewPassword) {
          reject({ _error: 'Passwords do not match!' })
        } else {
          Accounts.resetPassword(token, newPassword, (err) => {
            if (err) {
              reject({
                ...(typeof err.details === 'object' ? err.details : {}),
                _error: err.reason || 'Sorry, we couldn\'t reset your password'
              })
              console.error('Failure calling method welcome/resetPassword', err)
            } else {
              resolve()
              history.push('/forgot-password/success')
            }
          })
        }
      })
    }
  }
}
