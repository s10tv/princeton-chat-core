import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {loginValidator} from '/lib/validation/onboarding'
import Login from '../components/home.jsx'

export const formConfig = {
  form: 'onboarding/login',
  fields: ['email', 'password'],
  validate: loginValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
  }
}

export const composer = ({context}, onData) => {
  const {Meteor} = context()
  if (Meteor.subscribe('userData').ready()) {

    // redirect the user if the user is already logged in.
    if (Meteor.userId()) {
      const user = Meteor.user()
      // TODO: Do we need more states to represent stages of onboarding?
      if (user.status === 'pending') {
        return FlowRouter.go('onboarding-signup')
      } else if (user.status === 'active') {
        return FlowRouter.go('all-mine')
      }
    }
  }

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