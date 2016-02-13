import {Meteor} from 'meteor/meteor'
import {mount} from 'react-mounter'

import Home from './containers/home'
import RequestInvite from './containers/request-invite'
import Signup from './containers/signup'
import SubscribeChannels from './containers/subscribe-channels'
import InviteFriends from './containers/invite-friends'

export default function (injectDeps, {FlowRouter}) {
  FlowRouter.route('/invite/:inviteId', {
    name: 'invite',
    action ({ inviteId }) {
      mount(injectDeps(Signup))
    }
  })
  FlowRouter.route('/welcome/subscribe-channels', {
    name: 'subscribe-channels',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(injectDeps(SubscribeChannels))
    }
  })

  FlowRouter.route('/welcome/invite-friends', {
    name: 'invite-friends',
    action () {
      mount(injectDeps(InviteFriends))
    }
  })

  // begin private paths

  FlowRouter.route('/o/', {
    name: 'o-onboarding-home',
    action () {
      mount(injectDeps(Home))
    }
  })
  FlowRouter.route('/o/signup', {
    name: 'o-onboarding-signup',
    action () {
      mount(injectDeps(Signup))
    }
  })
  FlowRouter.route('/o/request-invite', {
    name: 'o-request-invite',
    action () {
      mount(injectDeps(RequestInvite))
    }
  })
  FlowRouter.route('/o/subscribe-channels', {
    name: 'o-subscribe-channels',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(injectDeps(SubscribeChannels))
    }
  })
  FlowRouter.route('/o/invite-friends', {
    name: 'o-invite-friends',
    action () {
      mount(injectDeps(InviteFriends))
    }
  })
}
