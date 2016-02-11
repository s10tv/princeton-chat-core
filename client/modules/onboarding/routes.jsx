import React from 'react'
import {mount} from 'react-mounter'

import Home from './containers/home'
import RequestInvite from './components/request-invite.jsx'

export default function (injectDeps, {FlowRouter}) {
  FlowRouter.route('/o/', {
    name: 'onboarding-home',
    action () {
      mount(injectDeps(Home))
    }
  })
  FlowRouter.route('/o/request-invite', {
    name: 'request-invite',
    action () {
      mount(injectDeps(RequestInvite))
    }
  })
}
