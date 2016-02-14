import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {reduxForm} from 'redux-form'
import {autoAffiliationValidator} from '/lib/validation'
import {trim} from '/lib/normalization'
import {PageLoader} from '/client/lib/ui.jsx'
import Home from '../components/home.jsx'

export const formConfig = {
  form: 'onboarding/auto-verify',
  fields: ['netid', 'domain'],
  initialValues: {
    domain: 'alumni.princeton.edu'
  },
  validate: autoAffiliationValidator,
  // NOTE: not an officially supported property by redux-form
  // However we concatenate this together ourselves in context.js
  normalize: {
    netid: trim
  }
}

export const composer = ({context}, onData) => {
  const {Meteor, Collections} = context()
  if (Meteor.subscribe('topics').ready() && Meteor.subscribe('userData').ready()) {

    // redirect the user if the user is already logged in.
    if (Meteor.userId()) {
      const user = Meteor.user()
      if (user.status === 'pending') {
        return FlowRouter.go('onboard-signup')
      } else if (user.status === 'active') {
        return FlowRouter.go('all-mine')
      } else {
        // this should never happen because user should only have 2 statuses.
        return FlowRouter.go('login')
      }
    }

    const topics = Collections.Topics.find().fetch()
    onData(null, {topics})
  }
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.onboardHome.verifyAlumni,
  store: context.store,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(Home)
