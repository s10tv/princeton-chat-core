import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import RequestInvite from '../components/request-invite.jsx'
import { manualAffiliationValidator } from '/lib/validation/onboarding'

export const formConfig = {
  form: 'request-invite',
  fields: ['firstName', 'lastName', 'birthDate', 'classYear', 'degree', 'email'],
  initialValues: {
    email: '' // How do we populate this from initial data?
  },
  validate: manualAffiliationValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
  }
}

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.requestInvite.verifyAffiliation,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(RequestInvite)
