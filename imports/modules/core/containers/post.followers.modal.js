import PostFollowersModal from '../components/post.followers.modal.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '../../../libs/UserService';

export const composer = ({context, actions}, onData) => {
  const { Meteor, Collections, FlowRouter, LocalState } = context();

  const isOpen = LocalState.get('POST_FOLLOWERS') != undefined;
  const postId = LocalState.get('POST_FOLLOWERS');

  var followers = [];
  if (postId) {
    const post = Collections.Posts.findOne(postId);

    followers = post.followers.map(follower => {
      return UserService.getUserView(Users.findOne(follower.userId));
    });
  }

  onData(null, {
    isOpen,
    followers
  });
};

const depsMapper = (context, actions) => ({
  closeModal: actions.postfollowers.closeModal
});

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(PostFollowersModal);
