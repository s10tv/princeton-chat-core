import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import RequestInvite from '../components/invite.request.jsx'
import { manualVerifyValidator } from '/lib/validation/onboarding'

export const formConfig = {
  form: 'onboarding/manual-verify',
  fields: ['firstName', 'lastName', 'birthDate', 'classYear', 'degree', 'email'],
  initialValues: {
    email: '', // How do we populate this from initial data?
    classYear: '',
    degrees: '',
    birthDate: ''
  },
  validate: manualVerifyValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
  }
}

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.onboardingManualVerify.submit,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(RequestInvite)
