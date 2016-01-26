import PostDetails from '../components/post.details.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import DateFormatter from '/imports/libs/DateFormatter';

export const composer = ({context, topicId, postId}, onData) => {
  const { Collections } = context();
  if (Meteor.subscribe('comments', postId).ready()) {
    const post = Collections.Posts.findOne(postId);
    post.timestamp = DateFormatter.format(post);

    onData(null, {
      post,
      owner: UserService.getUserView(Collections.Users.findOne(post.ownerId)),
      topic: Collections.Topics.findOne(topicId),
    });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(PostDetails);
