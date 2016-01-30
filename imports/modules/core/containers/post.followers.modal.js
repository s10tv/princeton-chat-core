import PostFollowersModal from '../components/post.followers.modal.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '../../../libs/UserService';

export const composer = ({context, actions}, onData) => {
  const { Meteor, Collections, FlowRouter, LocalState } = context();

  const isOpen = LocalState.get('FOLLOWERS_MODAL_OPEN') || false;
  const followersFromState = LocalState.get('POST_FOLLOWERS') || [];
  const followers = followersFromState.map(follower => {
    return UserService.getUserView(follower);
  });

  onData(null, {
    isOpen,
    followers
  });
};

const depsMapper = (context, actions) => ({
  closeModal: actions.postfollowers.closeModal,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(PostFollowersModal);
