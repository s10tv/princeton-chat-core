import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {autoVerifyValidator} from '/lib/validation/onboarding'
import {trimSpaces} from '/lib/normalization'
import {domains} from '/lib/data'
import {PageLoader} from '/client/lib/ui.jsx'
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

export const composer = ({context}, onData) => {
  const {Meteor, FlowRouter} = context()
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
  onData(null, {domains})
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.onboardingAutoVerify.submit,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(Home)
