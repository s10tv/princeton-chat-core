import {mount} from 'react-mounter'

import Home from './containers/home'
import RequestInvite from './containers/request-invite'
import Signup from './containers/signup'
import SubscribeChannels from './containers/subscribe-channels'
import InviteFriends from './containers/invite-friends'

export default function (injectDeps, {FlowRouter}) {
  FlowRouter.route('/o/', {
    name: 'onboarding-home',
    action () {
      mount(injectDeps(Home))
    }
  })
  FlowRouter.route('/o/signup', {
    name: 'onboarding-signup',
    action () {
      mount(injectDeps(Signup))
    }
  })
  FlowRouter.route('/o/request-invite', {
    name: 'request-invite',
    action () {
      mount(injectDeps(RequestInvite))
    }
  })
  FlowRouter.route('/o/subscribe-channels', {
    name: 'subscribe-channels',
    action () {
      mount(injectDeps(SubscribeChannels))
    }
  })
  FlowRouter.route('/o/invite-friends', {
    name: 'invite-friends',
    action () {
      mount(injectDeps(InviteFriends))
    }
  })
  FlowRouter.route('/invite/:inviteId', {
    name: 'invite',
    action ({ inviteId }) {
      mount(injectDeps(Signup))
    }
  })
}
