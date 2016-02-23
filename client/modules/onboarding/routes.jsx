import {mount} from 'react-mounter'

import Home from './containers/home'
import RequestInvite from './containers/invite.request'
import Signup from './containers/signup'
import SubscribeChannels from './containers/subscribe.channels'
import InviteFriends from './containers/invite.friends'
import AmplitudeService from '/client/lib/amplitude.service'
import ForgotPasswordSent from './containers/forgotpassword.sent'
import ForgotPasswordChange from './containers/forgotpassword.change'
import ForgotPassword from './containers/forgotpassword'
import ForgotPasswordSuccess from './containers/forgotpassword.success'

function requireUserInSession (context) {
  if (!this.Meteor.userId()) {
    return this.FlowRouter.go('onboarding-login')
  }
}

export default function (injectDeps, {Meteor, FlowRouter, Accounts, sweetalert}) {
  // need Meteor and FlowRouter to be used in before triggers to redirect non-authenticated users
  const requireUserInSessionFn = requireUserInSession.bind({ Meteor, FlowRouter })

  FlowRouter.route('/', {
    name: 'onboarding-login',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      AmplitudeService.track('view/home')
      mount(injectDeps(Home))
    }
  })
  FlowRouter.route('/request-invite', {
    name: 'onboarding-manual-verify',
    action () {
      mount(injectDeps(RequestInvite))
    }
  })
  FlowRouter.route('/login', {
    name: 'login',
    action () {
      FlowRouter.go('onboarding-login')
    }
  })
  FlowRouter.route('/invite/:inviteId', {
    name: 'onboarding-redeem-invite',
    action ({ inviteId }) {
      Accounts.callLoginMethod({
        methodArguments: [{ invite: inviteId }],
        userCallback: (err) => {
          if (err) {
            sweetalert({
              title: 'Invalid Invite',
              text: 'Seems like your invite code is invalid or has already expired. ' +
                'If retrying the invite link still doesn\'t work, please reply to the invite ' +
                'email and we will investigate it.'
            }, () => {
              FlowRouter.go('onboarding-login')
            })
          } else {
            AmplitudeService.setUpAfterSignup({Meteor})
            FlowRouter.go('onboarding-signup')
          }
        }
      })
    }
  })
  FlowRouter.route('/welcome/signup', {
    name: 'onboarding-signup',
    triggersEnter: [requireUserInSessionFn],
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(injectDeps(Signup))
    }
  })
  FlowRouter.route('/welcome/subscribe-channels', {
    name: 'onboarding-subscribe-channels',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action () {
      mount(injectDeps(SubscribeChannels))
    }
  })

  FlowRouter.route('/welcome/invite-friends', {
    name: 'onboarding-invite-friends',
    triggersEnter: [requireUserInSessionFn],
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(injectDeps(InviteFriends))
    }
  })

  FlowRouter.route('/forgot-password', {
    name: 'forgot-password',
    action () {
      mount(injectDeps(ForgotPassword))
    }
  })

  FlowRouter.route('/forgot-password/email-sent', {
    name: 'forgot-password/email-sent',
    action () {
      mount(injectDeps(ForgotPasswordSent))
    }
  })

  FlowRouter.route('/forgot-password/success', {
    name: 'forgot-password-success',
    action () {
      mount(injectDeps(ForgotPasswordSuccess))
    }
  })

  FlowRouter.route('/forgot-password/:token', {
    name: 'forgot-password-change',
    action ({ token }) {
      mount(injectDeps(ForgotPasswordChange))
    }
  })
}
