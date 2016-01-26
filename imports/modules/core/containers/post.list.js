import truncate from 'truncate';

import PostList from '../components/post.list.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import DateFormatter from '/imports/libs/DateFormatter';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export const composer = ({context, topicId, postListType}, onData) => {
  const {Meteor, Collections, FlowRouter} = context();
  if (Meteor.subscribe('posts', topicId).ready()) {
    var topic;
    var options;

    switch (postListType) {
      case 'ALL':
        topic =  {
          _id: undefined, // this will let the renderer know that this is an aggregate channel.
          displayName: 'All Posts',
        };
        options = {};
        break;

      case 'ALL_MINE':
        topic =  {
          _id: undefined, // this will let the renderer know that this is an aggregate channel.
          displayName: 'Everything I follow',
        };
        options = { $or: [
          { _id: { $in: Meteor.user().followingPosts }},
          { topicIds: { $in: Meteor.user().followingTopics }},
        ]};
        break;

      default:
        topic = Collections.Topics.findOne(topicId);
        options = { topicIds: topicId };
        break;
    }

    const posts = Collections.Posts.find(options, { sort: { createdAt: -1 }}).map(post => {
      post.owner = UserService.getUserView(Collections.Users.findOne(post.ownerId));

      if (post.topicIds) {
        post.topics = post.topicIds.map(topicId => {
          return Collections.Topics.findOne(topicId);
        }).filter(topic => {
          return topic != undefined;
        });
      } else {
        post.topics = [];
      }

      post.timestamp = DateFormatter.format(post);
      post.truncatedContent = truncate(post.content, 150);

      return post;
    });

    const onTapPostDetails = function() {
      return FlowRouter.go(`/topics/${topicId}/${this.post._id}`);
    };

    onData(null, {topic, posts, onTapPostDetails});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(PostList);
