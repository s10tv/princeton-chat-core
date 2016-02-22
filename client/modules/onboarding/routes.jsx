import {mount} from 'react-mounter'
import Home from './containers/home'
import RequestInvite from './containers/invite.request'
import Signup from './containers/signup'
import Login from './containers/login'
import SubscribeChannels from './containers/subscribe.channels'
import InviteFriends from './containers/invite.friends'
import AmplitudeService from '/client/lib/amplitude.service'
import Profile from './components/profile.jsx'
import ForgotPasswordSent from './containers/forgotpassword.sent'
import ForgotPasswordChange from './containers/forgotpassword.change'
import ForgotPassword from './containers/forgotpassword'
import ForgotPasswordSuccess from './containers/forgotpassword.success'
import React from 'react'

function requireUserInSession (context) {
  if (!this.Meteor.userId()) {
    return this.FlowRouter.go('onboarding-auto-verify')
  }
}

export default function (injectDeps, {Meteor, FlowRouter, Accounts, sweetalert}) {
  // need Meteor and FlowRouter to be used in before triggers to redirect non-authenticated users
  const requireUserInSessionFn = requireUserInSession.bind({ Meteor, FlowRouter })

  FlowRouter.route('/', {
    name: 'onboarding-auto-verify',
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
    name: 'onboarding-login',
    action () {
      mount(injectDeps(Login))
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
              text: 'Seems like your invite code is invalid or has already expired.\n' +
                'If retrying the invite link still doesn\'t work, please reply to the invite\n' +
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

  FlowRouter.route('/tonyx', {
    name: 'tonyx',
    action () {
      mount(injectDeps(Home), { mainContent: <Profile displayName="Tony Xiao '12" firstName='Tony'
        avatarUrl='https://s10tv.blob.core.windows.net/s10tv-prod/tonyxiao.jpg' />
      })
    }
  })

  FlowRouter.route('/poshak', {
    name: 'poshak',
    action () {
      mount(injectDeps(Home), { mainContent: <Profile displayName="Poshak Agrawal '13" firstName='Poshak'
        avatarUrl='http://graph.facebook.com/560625167/picture?type=large' />
      })
    }
  })
}
