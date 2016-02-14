import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {createValidator, minLength, maxLength, required, email} from '/lib/validation'
import Signup from '../components/signup.jsx'

export const formConfig = {
  form: 'onboarding/signup',
  fields: ['firstName', 'lastName', 'email', 'password'],
  validate: createValidator({
    firstName: [required, maxLength(16)],
    lastName: [required, maxLength(16)],
    email: [required, email],
    password: [required, minLength(6), maxLength(50)]
  }),
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
  }
}

export const composer = ({context}, onData) => {
  const { UserService } = context()

  const user = UserService.currentUser()

  onData(null, {
    facebookInfo: user.services.facebook,
    verifiedEmail: user.displayEmail,
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.displayEmail
    }
  })
}

const depsMapper = (context, actions) => ({
  linkFacebook: actions.onboardingSignup.linkWithFacebook,
  onSubmit: actions.onboardingSignup.createAccount,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Signup)
