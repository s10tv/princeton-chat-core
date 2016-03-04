import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import ForgotPasswordChange from '../components/forgotpassword.change.jsx'
import {PageLoader} from '/src/client/lib/ui.jsx'
import {reduxForm} from 'redux-form'
import {forgotPasswordChangeValidator} from '/src/lib/validation/onboarding'

const formConfig = {
  form: 'forgot-password-change',
  fields: ['newPassword', 'matchNewPassword'],
  validate: forgotPasswordChangeValidator
}

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.forgotPassword.reset,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(ForgotPasswordChange)
