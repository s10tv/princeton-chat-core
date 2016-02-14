import {mount} from 'react-mounter'

import Home from './containers/home'
import RequestInvite from './containers/invite.request'
import Signup from './containers/signup'
import Login from './containers/login'
import SubscribeChannels from './containers/subscribe.channels'
import InviteFriends from './containers/invite.friends'

function requireUserInSession (context) {
  if (!this.Meteor.userId()) {
    return this.FlowRouter.go('signup')
  }
}


export default function (injectDeps, {Meteor, FlowRouter, Accounts, sweetalert}) {
  // need Meteor and FlowRouter to be used in before triggers to redirect non-authenticated users
  const requireUserInSessionFn = requireUserInSession.bind({ Meteor, FlowRouter })

  FlowRouter.route('/', {
    name: 'home',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(injectDeps(Home))
    }
  })
  FlowRouter.route('/request-invite', {
    name: 'manual-invite',
    action () {
      mount(injectDeps(RequestInvite))
    }
  })
  FlowRouter.route('/login', {
    name: 'login',
    action () {
      mount(injectDeps(Login))
    }
  })
  FlowRouter.route('/invite/:inviteId', {
    name: 'invite',
    action ({ inviteId }) {
      Accounts.callLoginMethod({
        methodArguments: [{ invite: inviteId }],
        userCallback: (err) => {
          if (err) {
            sweetalert({
              title: 'Invalid Invite',
              text: `Seems like your invite code is invlid or has already expired. \
                If retrying the invite link still doesn't work, please reply to the invite \
                email and we will investigate it.`
            })
            return FlowRouter.go('login')
          }

          FlowRouter.go('onboard-signup')
        }
      })
    }
  })
  FlowRouter.route('/welcome/signup', {
    name: 'onboard-signup',
    triggersEnter: [requireUserInSessionFn],
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(injectDeps(Signup))
    }
  })
  FlowRouter.route('/welcome/subscribe-channels', {
    name: 'onboard-subscribe-channels',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action () {
      mount(injectDeps(SubscribeChannels))
    }
  })

  FlowRouter.route('/welcome/invite-friends', {
    name: 'invite-friends',
    triggersEnter: [requireUserInSessionFn],
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(injectDeps(InviteFriends))
    }
  })
}
