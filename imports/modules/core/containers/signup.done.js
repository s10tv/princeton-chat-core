import SignupDone from '/imports/modules/core/components/signup/signup.done.jsx';
import {useDeps, composeAll, composeWithTracker} from '/imports/libs/mantra';

export const composer = ({context, actions}, onData) => {
  const { LocalState } = context();
  onData(null, { emailAddress: LocalState.get('EMAIL_SIGNING_UP') });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(SignupDone);
