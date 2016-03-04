import truncate from 'truncate'
import {Loading} from '/src/client/modules/core/components/helpers.jsx'
import PostList from '/src/client/modules/core/components/post.list.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import UserService from '/src/lib/user.service.js'
import DateFormatter from '/src/client/lib/date.formatter.js'
import { GenericCoverPhoto, SearchCoverPhoto } from '/src/client/lib/unsplash.service.js'
import _ from 'underscore'
import {isTopicAdmin, isAdmin} from '/src/lib/admin'
import AmplitudeService from '/src/client/lib/amplitude.service'

const NUM_MAX_DISPLAY_FOLLOWERS = 3

export function processPost ({UserService, Collections}, post, topicId = null, isMobile = false) {
  const currentUser = UserService.currentUser()

  const followerAvatars = post.followers.map((follower) => {
    var obj = {}
    const user = UserService.getUserView(Collections.Users.findOne(follower.userId))
    if (user) {
      obj = {
        avatar: user.avatar,
        avatarInitials: user.avatarInitials,
        userId: follower.userId
      }
    }
    return obj
  }).filter((obj) => !_.isEmpty(obj))

  const topics = !post.topicIds ? [] : post.topicIds
    .map((topicId) => Collections.Topics.findOne(topicId))
    .filter((topic) => topic !== undefined)

  return Object.assign({}, post, {
    owner: UserService.getUserView(Collections.Users.findOne(post.ownerId)),
    topics: topics.length > 1 && isMobile ? topics[0] : topics,
    timestamp: DateFormatter.format(post),
    truncatedContent: truncate(post.content, 300),
    numFollowers: post.followers.length,
    moreFollowersNumber: followerAvatars.length > NUM_MAX_DISPLAY_FOLLOWERS
      ? followerAvatars.length - NUM_MAX_DISPLAY_FOLLOWERS
      : 0,
    isFollowingPost: currentUser.followingPosts.indexOf(post._id) >= 0,
    url: topicId
      ? `/topics/${topicId}/${post._id}`
      : `/topics/${post.topicIds[0]}/${post._id}`,
    followerAvatars: followerAvatars.length > NUM_MAX_DISPLAY_FOLLOWERS
      ? followerAvatars.slice(0, NUM_MAX_DISPLAY_FOLLOWERS)
      : followerAvatars
  })
}

export const composer = ({context, topicId, term, postListType, rightbarOpen, isMobile}, onData) => {
  const {Meteor, Collections} = context()
  const currentUser = UserService.currentUser()

  let subscriptionReady
  switch (postListType) {
    case 'SEARCH':
      subscriptionReady = Meteor.subscribe('posts', {term}).ready()
      break
    default:
      subscriptionReady = Meteor.subscribe('posts', {topicId, isMine: postListType === 'ALL_MINE'}).ready() &&
        Meteor.subscribe('topic', topicId).ready()
  }

  if (subscriptionReady) {
    var topic
    var options = {isDM: {$ne: true}}

    switch (postListType) {
      case 'ALL':
        topic = {
          displayName: 'All Posts',
          cover: GenericCoverPhoto,
          followers: []
        }
        break

      case 'ALL_MINE':
        topic = {
          displayName: 'My Feed',
          cover: GenericCoverPhoto,
          followers: []
        }
        options['$or'] = [
          {_id: { $in: currentUser.followingPosts }},
          {topicIds: { $in: currentUser.followingTopics }}
        ]
        break

      case 'SEARCH':
        topic = {
          displayName: `Search: ${term}`,
          cover: SearchCoverPhoto,
          followers: []
        }
        break

      default:
        topic = Collections.Topics.findOne(topicId)
        options.topicIds = topicId
        break
    }

    topic.followersList = Collections.Users.find({
      _id: { $in: topic.followers.map((follower) => follower.userId) }
    }).map((user) => UserService.getUserView(user))
    const posts = Collections.Posts.find(options, {sort: { createdAt: -1 }}).map((post) => {
      return processPost(context(), post, topicId, isMobile)
    })

    const isMyTopic = isTopicAdmin(currentUser, topic)

    onData(null, {
      topic,
      isMyTopic,
      posts,
      isTopicAdmin: isMyTopic || isAdmin(currentUser),
      followFn: () => {
        AmplitudeService.track('topic/follow', { from: 'post/list' })
        Meteor.call('topic/follow', topic._id)
      },
      unfollowFn: () => {
        AmplitudeService.track('topic/unfollow', { from: 'post/list' })
        Meteor.call('topic/unfollow', topic._id)
      },
      followersCount: topic.followers.length,
      postListType,
      isFollowing: currentUser.followingTopics.indexOf(topic._id) >= 0,
      isEmpty: posts.length === 0,
      disableClickToShowFollowers: topic._id === undefined,
      hideFollowerSection: topic._id === undefined,
      hideFollowActionSection: topic._id === undefined,
      isRightSidebarOpen: topic._id !== undefined && rightbarOpen,
      currentSearchValue: term
    })
  } else {
    return onData(null, null)
  }
}

const depsMapper = (context, actions) => ({
  showAddPostPopupFn: actions.posts.showAddPostPopup,
  showUserProfile: actions.profile.showUserProfile,
  showFollowersFn: actions.topics.showTopicFollowers,
  navigateToTopic: actions.topics.navigateToTopic,
  navigateToTopicListFn: actions.topics.navigateToTopicList,
  navigateToAddFollowers: actions.topics.navigateToAddFollowers,
  showPostFollowers: actions.postfollowers.getFollowersAndShowModal,
  updateAndShowFollowersModal: actions.postfollowers.updateAndShowFollowersModal,
  followPostFn: (args) => {
    AmplitudeService.track('post/follow', { from: 'post/list' })
    return actions.posts.follow(args)
  },
  unfollowPostFn: (args) => {
    AmplitudeService.track('post/unfollow', { from: 'post/list' })
    return actions.posts.unfollow(args)
  },
  removeFollower: actions.topics.removeFollower,
  removeTopic: actions.topics.removeTopic,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(PostList)
