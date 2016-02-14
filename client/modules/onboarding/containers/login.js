import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {createValidator, minLength, maxLength, required, email} from '/lib/validation'
import Login from '../components/login.jsx'

export const formConfig = {
  form: 'onboarding/login',
  fields: ['email', 'password'],
  validate: createValidator({
    email: [required, email],
    password: [required, minLength(6), maxLength(50)]
  }),
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
  }
}

export const composer = ({context}, onData) => {
  onData(null, {
  })
}

const depsMapper = (context, actions) => ({
  loginWithFacebook: actions.onboardingLogin.loginWithFacebook,
  onSubmit: actions.onboardingLogin.loginWithPassword,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Login)
