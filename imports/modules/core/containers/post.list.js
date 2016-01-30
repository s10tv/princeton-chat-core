import truncate from 'truncate';

import {Loading} from '/imports/modules/core/components/helpers.jsx'
import PostList from '/imports/modules/core/components/post.list.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import DateFormatter from '/imports/libs/DateFormatter';

export const composer = ({context, topicId, postListType}, onData) => {
  const {Meteor, Collections, FlowRouter, LocalState} = context();
  const currentUser = UserService.currentUser();

  if (Meteor.subscribe('posts', topicId).ready()) {
    var topic;
    var options = {};
    options.isDM = { $ne: true };

    switch (postListType) {
      case 'ALL':
        topic =  {
          displayName: 'All Posts',
          followers: [],
        };
        break;

      case 'ALL_MINE':
        topic = {
          displayName: 'Everything I follow',
          followers: [],
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

    onData(null, {
      topic,
      posts,
      followFn: () => { Meteor.call('topic/follow', topic._id) },
      unfollowFn: () => { Meteor.call('topic/unfollow', topic._id) },
      followersCount: topic.followers.length,
      title: topic.displayName,
      isFollowing: currentUser.followingTopics.indexOf(topic._id) >= 0,
      isEmpty: posts.length == 0,
      hideFollowerSection: topic._id == undefined,
      hideFollowActionSection: topic._id == undefined,
    });
  }
};

const depsMapper = (context, actions) => ({
  showAddPostPopupFn: actions.posts.showAddPostPopup,
  showUserProfile: actions.posts.showUserProfile,
  navigateToTopic: actions.topics.navigateToTopic,
  showPostFollowers: actions.posts.showPostFollowers,
  followPostFn: actions.posts.follow,
  unfollowPostFn: actions.posts.unfollow,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(PostList);
