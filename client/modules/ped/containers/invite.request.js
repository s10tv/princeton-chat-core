import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import RequestInvite from '../components/invite.request.jsx'
import { pedManualVerifyValidator } from '/lib/validation/onboarding'
import { normalizeDate } from '/lib/normalization'

export const formConfig = {
  form: 'onboarding/manual-verify',
  fields: ['firstName', 'lastName', 'email', 'desc'],
  initialValues: {
    email: '', // How do we populate this from initial data?
  },
  validate: pedManualVerifyValidator
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