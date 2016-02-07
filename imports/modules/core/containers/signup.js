import {useDeps, composeAll, composeWithTracker} from '/imports/libs/mantra';
import {i18n} from '/imports/libs/mantra'

let Signup;
switch (Meteor.settings.public.audience) {
  case 'princeton':
    Signup = require(`/imports/modules/core/components/signup/signup-princeton.jsx`);
    break;
  case 's10':
    Signup = require(`/imports/modules/core/components/signup/signup-s10.jsx`);
    break;

  default:
    Signup = require(`/imports/modules/core/components/signup/signup-princeton.jsx`);
    break;
}

export const composer = ({context, actions}, onData) => {
  const { LocalState } = context();
  onData(null, { isOnboardingSpinnerLoading: (LocalState.get('SIGNING_UP') == true) });
};

const depsMapper = (context, actions) => ({
  signup: actions.signup.signup,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Signup);
