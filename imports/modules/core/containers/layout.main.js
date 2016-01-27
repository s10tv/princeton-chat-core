import truncate from 'truncate';
import LayoutMain from '../components/layout.main.jsx';
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra';
import UserService from '/imports/libs/UserService';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const TOTAL_TITLE_CHARACTERS = 40;

function getRoutes(Collections, currentRoute) {
  let topic, post;
  switch (currentRoute.route.name) {
    case 'all-mine':
      return [{ name: 'Posts for me', url: currentRoute.path }];

    case 'all':
      return [{ name: 'All posts', url: currentRoute.path }];

    case 'postList':
      topic = Collections.Topics.findOne(currentRoute.params.topicId);
      if (topic) {
        return [{ name: `# ${topic.displayName}`, url: currentRoute.path }];
      }
      return [];

    case 'postDetails':
      topic = Collections.Topics.findOne(currentRoute.params.topicId);
      post = Collections.Posts.findOne(currentRoute.params.postId);

      if (topic && post) {
        return [
          { name: `# ${topic.displayName}`, url: `/topics/${topic._id}` },
          { name: `${truncate(post.title, Math.max(0, TOTAL_TITLE_CHARACTERS-topic.displayName.length))}`,
            url: currentRoute.path },
        ];
      }
      return [];

    default:
      return [];
  }
}

function onToggleFollowFn(currentRoute, currentUser, Meteor) {
  const noOp = { followFn: () => {}, unfollowFn: () => {} };

  switch(currentRoute.route.name) {
    case 'postList':
      const topicId = currentRoute.params.topicId;
      if (topicId) {
        return {
          showFollow: true,
          followFn: () => {
            Meteor.call('topic/follow', topicId);
          },
          unfollowFn: () => {
            Meteor.call('topic/unfollow', topicId);
          },
        };
      };

      return noOp;
    case 'postDetails':
      const postId = currentRoute.params.postId;
      if (postId) {
        return {
          showFollow: true,
          followFn: () => {
            Meteor.call('post/follow', postId);
          },

          unfollowFn: () => {
            Meteor.call('post/unfollow', postId);
          }
        };
      }

      return noOp;
    default:
      return noOp;
  }
}

function getIsFollowing(currentRoute, currentUser) {
  switch(currentRoute.route.name) {
    case 'postList':
      return currentUser.followingTopics.indexOf(currentRoute.params.topicId) >= 0;
    case 'postDetails':
      return currentUser.followingPosts.indexOf(currentRoute.params.postId) >= 0;
    default:
      return false;
  }
}

export const composer = ({context}, onData) => {
  const { Meteor, Collections, FlowRouter, LocalState } = context();

  const currentUser = UserService.currentUser();
  if (currentUser) {
    var showFollowSection = false;

    const currentRoute = FlowRouter.current();
    const breadcrumbs = getRoutes(Collections, currentRoute);
    const { followFn, unfollowFn, showFollow } = onToggleFollowFn(currentRoute, currentUser, Meteor);
    const isFollowing = getIsFollowing(currentRoute, currentUser);
    const showAddPostPopup = () => {
      LocalState.set('ADD_POST_POPUP_SHOWING', true);
    }

    showFollowSection = showFollowSection || showFollow;

    onData(null, {
      breadcrumbs,
      followFn,
      unfollowFn,
      isFollowing,
      showAddPostPopup,
      showFollowSection,
    });
  }
}

export const depsMapper = (context, actions) => ({
  context: () => context
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(LayoutMain);
