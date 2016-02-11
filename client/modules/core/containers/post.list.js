import truncate from 'truncate'
import {Loading} from '/client/modules/core/components/helpers.jsx'
import PostList from '/client/modules/core/components/post.list.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import UserService from '/lib/user.service.js'
import DateFormatter from '/client/lib/date.formatter.js'
import { GenericCoverPhoto } from '/client/lib/unsplash.service.js'
import _ from 'underscore'

const NUM_MAX_DISPLAY_FOLLOWERS = 3

export const composer = ({context, topicId, postListType}, onData) => {
  const {Meteor, Collections} = context()
  const currentUser = UserService.currentUser()

  if (Meteor.subscribe('posts', topicId, postListType === 'ALL_MINE').ready() &&
    Meteor.subscribe('topic', topicId).ready()) {
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

      default:
        topic = Collections.Topics.findOne(topicId)
        options.topicIds = topicId
        break
    }

    topic.followersList = Collections.Users.find({
      _id: { $in: topic.followers.map((follower) => follower.userId) }
    }).map((user) => UserService.getUserView(user))

    const posts = Collections.Posts.find(options, {sort: { createdAt: -1 }}).map((post) => {
      post.owner = UserService.getUserView(Collections.Users.findOne(post.ownerId))

      if (post.topicIds) {
        post.topics = post.topicIds.map((topicId) => {
          return Collections.Topics.findOne(topicId)
        }).filter((topic) => {
          return topic !== undefined
        })
      } else {
        post.topics = []
      }

      post.timestamp = DateFormatter.format(post)
      post.truncatedContent = truncate(post.content, 300)

      post.numFollowers = post.followers.length
      post.followerAvatars = post.followers.map((follower) => {
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

      post.moreFollowersNumber = post.followerAvatars.length > NUM_MAX_DISPLAY_FOLLOWERS
        ? (post.followerAvatars.length - NUM_MAX_DISPLAY_FOLLOWERS)
        : 0
      post.followerAvatars.length = NUM_MAX_DISPLAY_FOLLOWERS
      post.isFollowingPost = currentUser.followingPosts.indexOf(post._id) >= 0

      var currentTopicId
      var currentPostId = post._id

      if (topicId) { // topicid is passed as arg to this whole function. (from URL)
        currentTopicId = topicId // user clicked on a post detail from a topic
      } else {
        // the user clicked on a post detail from /all or /all-mine
        [ currentTopicId ] = post.topicIds
      }

      post.url = `/topics/${currentTopicId}/${currentPostId}`

      return post
    })

    onData(null, {
      topic,
      isMyTopic: topic.ownerId === currentUser._id,
      posts,
      followFn: () => { Meteor.call('topic/follow', topic._id) },
      unfollowFn: () => { Meteor.call('topic/unfollow', topic._id) },
      followersCount: topic.followers.length,
      postListType,
      title: topic.displayName,
      isFollowing: currentUser.followingTopics.indexOf(topic._id) >= 0,
      isEmpty: posts.length === 0,
      disableClickToShowFollowers: topic._id === undefined,
      hideFollowerSection: topic._id === undefined,
      hideFollowActionSection: topic._id === undefined
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
  showPostFollowers: actions.posts.showPostFollowers,
  showTopicFollowersFromFollowersListFn: actions.topics.showTopicFollowersFromFollowersList,
  followPostFn: actions.posts.follow,
  unfollowPostFn: actions.posts.unfollow,
  removeFollower: actions.topics.removeFollower,
  removeTopic: actions.topics.removeTopic,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(PostList)
