import truncate from 'truncate';

import {Loading} from '../components/helpers.jsx'
import PostList from '../components/post.list.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import DateFormatter from '/imports/libs/DateFormatter';

export const composer = ({context, topicId, postListType}, onData) => {
  const {Meteor, Collections, FlowRouter, LocalState} = context();
  if (Meteor.subscribe('posts', topicId).ready()) {
    const currentUser = UserService.currentUser();
    if (currentUser) {
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
            { _id: { $in: currentUser.followingPosts }},
            { topicIds: { $in: currentUser.followingTopics }},
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

        post.numFollowers = post.followers.length;

        post.isFollowingPost = currentUser.followingPosts.indexOf(post._id) >= 0;
        post.onFollow = (event) => {
          event.preventDefault();
          return Meteor.call('post/follow', post._id);
        };

        post.onUnFollow = (event) => {
          event.preventDefault();
          return Meteor.call('post/unfollow', post._id);
        };

        post.showUserProfile = (event) => {
          event.preventDefault();
          LocalState.set('PROFILE_USER_ANCHOR', event.target);
          LocalState.set('PROFILE_USER', post.owner);
        }

        
        var currentTopicId;
        var currentPostId = post._id;

        if (topicId) { // topicid is passed as arg to this whole function. (from URL)
          currentTopicId = topicId; // user clicked on a post detail from a topic
        } else {
          // the user clicked on a post detail from /all or /all-mine
          [ currentTopicId ] = post.topicIds;
        }

        post.url = `/topics/${currentTopicId}/${currentPostId}`
        
        return post
      })

      const navigateToTopic = function() {
        return FlowRouter.go(`/topics/${this.topic._id}`);
      };

      onData(null, {
        topic,
        posts,
        navigateToTopic,
      });
    }
  }
};

const depsMapper = (context, actions) => ({
  followPost: actions.posts.follow,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(PostList);
