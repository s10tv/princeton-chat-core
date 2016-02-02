import SignupForm from '/imports/modules/core/components/signup.form.jsx';
import {useDeps, composeAll, composeWithTracker} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';

export const composer = ({context}, onData) => {
  const { LocalState } = context();
  const currentUser = UserService.currentUser();

  onData(null, {
    proceededToFollowTopics: currentUser.status == 'active',
    hasntFollowedAnyTopics: currentUser.followingTopics.length == 0,
  });
};

const depsMapper = (context, actions) => ({
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SignupForm);
