import {useDeps, composeAll, composeWithTracker} from '/imports/libs/mantra';
import {i18n} from '/imports/libs/mantra'

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
)(i18n('signupComponent'));
