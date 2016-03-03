import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import UserService from '/lib/user.service.js'
import DateFormatter from '/client/lib/date.formatter.js'
import PostDetails from '/client/modules/core/components/post.details.jsx'
import {Loading} from '/client/modules/core/components/helpers.jsx'
import truncate from 'truncate'

export function processMessage ({UserService, Collections}, message) {
  const currentUser = UserService.currentUser()

  return Object.assign({}, message, {
    owner: UserService.getUserView(Collections.Users.findOne(message.ownerId)),
    timestamp: DateFormatter.format(message),
    truncatedContent: truncate(message.content, 300),
    canDelete: currentUser._id === message.ownerId
  })
}

export const composer = ({context, getPostFollowers, postId}, onData) => {
  const {Meteor, Collections} = context()
  const currentUser = UserService.currentUser()

  if (Meteor.subscribe('messages', postId).ready()) {
    const post = Collections.Posts.findOne(postId)
    post.timestamp = DateFormatter.format(post)
    post.owner = UserService.getUserView(Collections.Users.findOne(post.ownerId))

    // populate the cache of post followers.
    if (post.followers.length > 0) {
      getPostFollowers(context, post.followers)
    }

    const messages = Collections.Messages
      .find({postId: postId}, {sort: { createdAt: 1 }})
      .map((message) => {
        return processMessage(context(), message)
      })

    // WARNING: Assume topics are already published
    const topics = post.topicIds
      .map((topicId) => Collections.Topics.findOne(topicId))
      .filter((topic) => topic !== undefined)

    onData(null, {
      post,
      messages,
      topics,
      isDirectMessage: post.isDM,
      followFn: () => { Meteor.call('post/follow', post._id) },
      unfollowFn: () => { Meteor.call('post/unfollow', post._id) },
      followersCount: post.followers.length,
      title: post.title,
      isPostDeletable: currentUser._id === post.ownerId,
      isFollowing: currentUser.followingPosts.indexOf(post._id) >= 0
    })
  }
}

const depsMapper = (context, actions) => ({
  getPostFollowers: actions.postfollowers.getPostFollowers,
  showUserProfilePost: actions.posts.showUserProfile,
  showUserProfileMessage: actions.messages.showUserProfile,
  showFollowersFn: actions.topics.showTopicFollowers,
  navigateToTopic: actions.topics.navigateToTopic,
  deletePost: actions.posts.deletePost,
  deleteMessage: actions.messages.delete,
  messageLinkOnClick: actions.messages.messageLinkOnClick,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(PostDetails)
