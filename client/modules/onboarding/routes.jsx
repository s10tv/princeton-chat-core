import {mount} from 'react-mounter'
import Home from './containers/home'
import AmplitudeService from '/client/lib/amplitude.service'

// function requireUserInSession (context) {
//   if (!this.Meteor.userId()) {
//     return this.FlowRouter.go('onboarding-auto-verify')
//   }
// }

export default function (injectDeps, {Meteor, FlowRouter, Accounts, sweetalert}) {
  // need Meteor and FlowRouter to be used in before triggers to redirect non-authenticated users
  // const requireUserInSessionFn = requireUserInSession.bind({ Meteor, FlowRouter })

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
}
