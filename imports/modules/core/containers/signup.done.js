import SignupDone from '/imports/modules/core/components/signup/signup.done.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'

export const composer = ({context, actions}, onData) => {
  const { LocalState } = context()
  const email = LocalState.get('EMAIL_SIGNING_UP')
  onData(null, {
    emailAddress: email,
    fromApprovedDomain: /.*@alumni.princeton.edu$/.test(email)
  })
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(SignupDone)
