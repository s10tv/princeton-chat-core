import {mount} from 'react-mounter'

import SignupEmail from '/client/emails/signup.jsx'

// Note:
//
// These are only here to help us visualize the emails that we are sending.
// Routes here do not serve any functionality purposes, and should not be routed
// to.
export default function (injectDeps, {FlowRouter}) {
  FlowRouter.route('/email/signup', {
    name: 'email-signup',
    action () {
      mount(SignupEmail, {inviteLink: 'http://localhost/fake-invite-link'})
    }
  })
}
