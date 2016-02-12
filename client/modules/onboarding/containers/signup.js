import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {createValidator, minLength, maxLength, required, email} from '/lib/validation'
import {trim} from '/lib/normalization'
import Signup from '../components/signup.jsx'

export const formConfig = {
  form: 'signup',
  fields: ['firstName', 'lastName', 'email', 'password'],
  initialValues: {
    email: '' // How do we populate this from initial data?
  },
  validate: createValidator({
    firstName: [required, maxLength(16)],
    lastName: [required, maxLength(16)],
    email: [required, email],
    password: [required, minLength(6), maxLength(50)],
  }),
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
  }
}

export const composer = ({context}, onData) => {
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  store: context.store,
  context: () => context,
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Signup)
