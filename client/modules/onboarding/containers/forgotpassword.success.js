import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import ForgotPasswordSuccess from '../components/forgotpassword.success.jsx'
import {PageLoader} from 'client/lib/ui.jsx'

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  context: () => context
})

export default composeAll(
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(ForgotPasswordSuccess)
