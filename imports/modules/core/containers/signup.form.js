import SignupForm from '/imports/modules/core/components/signup.form.jsx';
import {useDeps, composeAll, composeWithTracker} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';

export const composer = ({context}, onData) => {
  const { LocalState } = context();
  const currentUser = UserService.currentUser();

  const proceededToSetPassword = LocalState.get('GO_TO_SET_PASSWORD') || false;

  onData(null, {
    proceededToSetPassword,
    hasntFollowedAnyTopics: currentUser.followingTopics.length == 0,
  });
};

const depsMapper = (context, actions) => ({
  goToSetPasswordPage: actions.onboarding.goToSetPasswordPage,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SignupForm);
