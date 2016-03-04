import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import RequestInvite from '../components/invite.request.jsx'
import { manualVerifyValidator } from '/src/lib/validation/onboarding'
import { normalizeDate } from '/src/lib/normalization'
import {degrees, classYears} from '/src/lib/data'

export const formConfig = {
  form: 'onboarding/manual-verify',
  fields: ['firstName', 'lastName', 'birthDate', 'classYear', 'degree', 'email'],
  validate: manualVerifyValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
    birthDate: normalizeDate
  }
}

export const composer = ({context}, onData) => {
  onData(null, {
    degrees,
    classYears
  })
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
