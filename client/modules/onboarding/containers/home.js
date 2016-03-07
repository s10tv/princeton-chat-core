import {useDeps, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {autoVerifyValidator} from '/lib/validation/onboarding'
import {trimSpaces} from '/lib/normalization'
import {domains} from '/lib/data'
import Home from '../components/home.jsx'

export const formConfig = {
  form: 'onboarding/auto-verify',
  fields: ['netid', 'domain'],
  initialValues: {
    // domain: domains[0]
  },
  validate: autoVerifyValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
    netid: trimSpaces
  }
}

const mapStateToProps = () => ({
  domains
})

const depsMapper = (context, actions) => ({
  onSubmit: actions.onboardingAutoVerify.submit,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig, mapStateToProps),
  useDeps(depsMapper)
)(Home)
