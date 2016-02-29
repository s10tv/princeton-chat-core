import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import RequestNongradInvite from '../components/invite.request.nongrad.jsx'
import { nongradVerifyValidator } from '/lib/validation/onboarding'
import { normalizeDate } from '/lib/normalization'
import {degrees, classYears} from '/lib/data'

export const formConfig = {
  form: 'onboarding/nongrad-verify',
  fields: ['firstName', 'lastName', 'email', 'desc'],
  validate: nongradVerifyValidator,
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
  onSubmit: actions.onboardingNongradVerify.submit,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(RequestNongradInvite)
