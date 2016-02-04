import truncate from 'truncate';
import {Loading} from '/imports/modules/core/components/helpers.jsx'
import PostList from '/imports/modules/core/components/post.list.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import DateFormatter from '/imports/libs/DateFormatter';
import _ from 'underscore';

const NUM_MAX_DISPLAY_FOLLOWERS = 3;

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
          displayName: 'My Feed',
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
      post.followerAvatars = post.followers.map(follower => {
        var obj = {};
        const user = Users.findOne(follower.userId)
        if (user) {
          obj = {
            url: Users.findOne(follower.userId).avatar.url,
            userId: follower.userId
          }
        }
        return obj;
      }).filter(obj => !_.isEmpty(obj));

      post.moreFollowersNumber = post.followerAvatars.length > NUM_MAX_DISPLAY_FOLLOWERS ? (post.followerAvatars.length - NUM_MAX_DISPLAY_FOLLOWERS) : 0;
      post.followerAvatars.length = NUM_MAX_DISPLAY_FOLLOWERS;
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

    // populate the cache of post followers.
    if (topic.followers.length > 0) {
      Meteor.call('get/followers', topic.followers, (err, res) => {
        LocalState.set('POST_FOLLOWERS', res);
      });
    } else {
      LocalState.set('POST_FOLLOWERS', []);
    }

    onData(null, {
      topic,
      posts,
      followFn: () => { Meteor.call('topic/follow', topic._id) },
      unfollowFn: () => { Meteor.call('topic/unfollow', topic._id) },
      followersCount: topic.followers.length,
      postListType,
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
  showFollowersFn: actions.topics.showTopicFollowers,
  navigateToTopic: actions.topics.navigateToTopic,
  navigateToTopicListFn: actions.topics.navigateToTopicList,
  showPostFollowers: actions.posts.showPostFollowers,
  showAddNewUsersModal: actions.topics.showAddNewUsersModal,
  followPostFn: actions.posts.follow,
  unfollowPostFn: actions.posts.unfollow,
  context: () => context
});

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(PostList);
