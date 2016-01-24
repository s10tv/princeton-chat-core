import Onboarding from '../components/Onboard/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context}, onData) => {
  if (Meteor.userId() && Meteor.subscribe('onboardingMessages').ready()) {
    const {Collections} = context();
    const messages = Collections.Messages.find().fetch();
    onData(null, {
      messages,
      user: Meteor.user()
    });
  }
};

export const depsMapper = (context) => ({
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Onboarding);
