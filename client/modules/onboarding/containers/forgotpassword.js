import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import ForgotPassword from '../components/forgotpassword.jsx'
import {PageLoader} from '/client/lib/ui.jsx'
import {reduxForm} from 'redux-form'
import {forgotPasswordEmailValidator} from '/lib/validation/onboarding'

const formConfig = {
  form: 'forgot-password',
  fields: ['email'],
  validate: forgotPasswordEmailValidator
}

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.forgotPassword.recover,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(ForgotPassword)
