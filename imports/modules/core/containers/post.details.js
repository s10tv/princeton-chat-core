import PostDetails from '../components/post.details.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import DateFormatter from '/imports/libs/DateFormatter';
import {Loading} from '../components-refactor/helpers.jsx'
import truncate from 'truncate'

export const composer = ({context, topicId, postId}, onData) => {
  const { Collections } = context();
  const currentUser = UserService.currentUser();

  if (Meteor.subscribe('messages', postId).ready()) {
    const post = Collections.Posts.findOne(postId);
    post.timestamp = DateFormatter.format(post);
    post.owner = UserService.getUserView(Collections.Users.findOne(post.ownerId));

    const messages = Messages.find({ postId: postId }, { sort: { createdAt: 1 }}).map(message => {
      message.owner = UserService.getUserView(Collections.Users.findOne(message.ownerId));
      message.timestamp = DateFormatter.format(message);
      return message;
    });

    onData(null, {
      post,
      messages,
      followFn: () => { Meteor.call('post/follow', post._id) },
      unfollowFn: () => { Meteor.call('post/unfollow', post._id) },
      followersCount: post.followers.length,
      title: truncate(post.title, 50),
      isFollowing: currentUser.followingPosts.indexOf(post._id) >= 0,
    });
  }
};

const depsMapper = (context, actions) => ({
  showAddPostPopupFn: actions.posts.showAddPostPopup,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(PostDetails);
