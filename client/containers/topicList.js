import TopicList from '../components/TopicList/index.jsx';
import {useDeps} from 'react-simple-di';
import {composeWithTracker, composeAll} from 'react-komposer';

export const composer = ({context, topicId, trigger}, onData) => {
  const {Meteor, Collections, Tracker, FlowRouter } = context();

  if (Meteor.subscribe('posts', topicId).ready()) {

    const currentUser = Meteor.user();
    currentUser.followingPosts = currentUser.followingPosts || [];
    currentUser.followingTopics = currentUser.followingTopics || [];
    currentUser.avatar = currentUser.avatar || { url: '/images/nph.jpg' };

    var topic;
    var options;

    switch (trigger) {
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

    const posts = Collections.Posts.find(options, { sort: { createdAt: -1 }}).map((post) => {
      post.owner = Collections.Users.findOne(post.ownerId);

      if (post.topicIds) {
        post.topics = post.topicIds.map(topicId => {
          return Collections.Topics.findOne(topicId);
        }).filter(topic => {
          return topic != undefined;
        });
      } else {
        post.topics = [];
      }

      return post;
    })

    onData(null, {topic, posts, currentUser, FlowRouter});
  }
};

export default composeAll(
  composeWithTracker(composer),
  useDeps(),
)(TopicList);
