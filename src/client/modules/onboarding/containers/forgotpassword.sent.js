import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import ForgotPasswordSent from '../components/forgotpassword.sent.jsx'
import {PageLoader} from '/src/client/lib/ui.jsx'

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  context: () => context
})

export default composeAll(
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(ForgotPasswordSent)
