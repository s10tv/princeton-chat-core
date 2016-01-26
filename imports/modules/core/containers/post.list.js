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
    var options = {};
    options.isDM = { $ne: true };

    switch (postListType) {
      case 'ALL':
        topic =  {
          displayName: 'All Posts',
        };
        break;

      case 'ALL_MINE':
        topic =  {
          displayName: 'Everything I follow',
        };
        options['$or'] = [
          { _id: { $in: Meteor.user().followingPosts }},
          { topicIds: { $in: Meteor.user().followingTopics }},
        ];
        break;

      default:
        topic = Collections.Topics.findOne(topicId);
        options.topicIds = topicId;
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
      var currentTopicId;
      var currentPostId = this.post._id;

      if (topicId) {
        currentTopicId = topicId; // user clicked on a post detail from a topic
      } else {
        // the user clicked on a post detail from /all or /all-mine
        [ currentTopicId ] = this.post.topicIds;
      }

      return FlowRouter.go(`/topics/${currentTopicId}/${currentPostId}`);
    };

    onData(null, {topic, posts, onTapPostDetails});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(PostList);
