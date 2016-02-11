import SignupForm from '/client/modules/core/components/signup.form.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'

export const composer = ({context}, onData) => {
  const { LocalState } = context()
  const proceededToFollowTopics = LocalState.get('ONBOARDING_SHOW_FOLLOW_TOPIC') || false

  onData(null, {
    proceededToFollowTopics
  })
}

const depsMapper = (context, actions) => ({
  closeSnackbar: actions.onboarding.closeSnackbar,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SignupForm)
