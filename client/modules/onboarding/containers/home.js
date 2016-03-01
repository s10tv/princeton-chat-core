import {useDeps, composeWithTracker, composeAll, compose} from 'mantra-core'
import {affiliationTypes} from '/lib/data'
import {PageLoader} from '/client/lib/ui.jsx'
import Home from '../components/home.jsx'

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
  onData(null, {affiliationTypes})
}

const depsMapper = (context, actions) => ({
  onSubmit: actions.onboardingAutoVerify.submit,
  changeSelector: actions.onboardingAutoVerify.changeHomeSelector,
  store: context.store,
  context: () => context
})

const onPropsChange = ({context}, onData) => {
  const {store} = context()
  onData(null, {homeSelector: store.getState().onboarding.homeSelector})
  return store.subscribe(() => {
    const {homeSelector} = store.getState().onboarding
    onData(null, {homeSelector})
  })
}

export default composeAll(
  compose(onPropsChange),
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(Home)
