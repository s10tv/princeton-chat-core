import truncate from 'truncate'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import UserService from '/lib/user.service.js'
import DateFormatter from '/client/lib/date.formatter'
import PostDetails from '/imports/modules/core/components/post.details.jsx'
import {Loading} from '/imports/modules/core/components/helpers.jsx'

export const composer = ({context, topicId, postId}, onData) => {
  const { Meteor, Collections, LocalState } = context()
  const currentUser = UserService.currentUser()

  if (Meteor.subscribe('messages', postId).ready()) {
    const post = Collections.Posts.findOne(postId)
    post.timestamp = DateFormatter.format(post)
    post.owner = UserService.getUserView(Collections.Users.findOne(post.ownerId))

    // populate the cache of post followers.
    if (post.followers.length > 0) {
      Meteor.call('get/followers', post.followers, (err, res) => {
        if (err) {
          return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
        }

        LocalState.set('POST_FOLLOWERS', res)
      })
    } else {
      LocalState.set('POST_FOLLOWERS', [])
    }

    const messages = Collections.Messages
      .find({postId: postId}, {sort: { createdAt: 1 }})
      .map((message) => {
        message.owner = UserService.getUserView(Collections.Users.findOne(message.ownerId))
        message.timestamp = DateFormatter.format(message)
        message.canDelete = currentUser._id === message.ownerId
        return message
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
      title: truncate(post.title, 50),
      isFollowing: currentUser.followingPosts.indexOf(post._id) >= 0
    })
  }
}

const depsMapper = (context, actions) => ({
  showUserProfilePost: actions.posts.showUserProfile,
  showUserProfileMessage: actions.messages.showUserProfile,
  showFollowersFn: actions.topics.showTopicFollowers,
  navigateToTopic: actions.topics.navigateToTopic,
  deleteMessage: actions.messages.delete,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer, Loading),
  useDeps(depsMapper)
)(PostDetails)
