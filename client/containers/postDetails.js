import PostDetails from '../components/PostDetails.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context, postId, topicId}, onData) => {
  if (Meteor.subscribe('comments', postId).ready()) {
    const {Collections} = context();
    const post = Collections.Posts.findOne(postId);
    onData(null, {
      post,
      owner: Collections.Users.findOne(post.ownerId),
      topic: Collections.Topics.findOne(topicId),
    });
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(),
)(PostDetails);
