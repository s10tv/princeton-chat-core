import Onboarding from '../components/Onboard/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context}, onData) => {
  if (Meteor.userId() && Meteor.subscribe('onboardingMessages').ready()) {
    const {Collections, LocalState} = context();
    const messages = Collections.Messages.find().fetch();
    onData(null, {
      LocalState,
      messages,
      user: Meteor.user(),
    });
  }
};

export const depsMapper = (context, actions) => ({
  clickStartOnboarding: actions.onboarding.clickStartOnboarding,
  clickAbandonOnboarding: actions.onboarding.clickAbandonOnboarding,
  submitTextField: actions.onboarding.submitTextField,
  clickFacebook: actions.onboarding.clickFacebook,
  clickInstagram: actions.onboarding.clickInstagram,
  clickSkip: actions.onboarding.clickSkip,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Onboarding);
