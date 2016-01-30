import PostFollowersModal from '../components/post.followers.modal.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '../../../libs/UserService';

export const composer = ({context, actions}, onData) => {
  const { Meteor, Collections, FlowRouter, LocalState } = context();

  const isOpen = LocalState.get('POST_FOLLOWERS') != undefined;
  const postId = LocalState.get('POST_FOLLOWERS');

  const getFollowers = () => {
    if (postId) {
      const post = Collections.Posts.findOne(postId);
      return post.followers.map(follower => {
        return UserService.getUserView(Users.findOne(follower.userId));
      });
    } else {
      return [];
    }
  }

  onData(null, {
    isOpen,
    followers: getFollowers()
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
