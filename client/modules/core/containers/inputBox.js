import InputBox from '/client/modules/core/components/inputBox.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import AmplitudeService from '/client/lib/amplitude.service'

const composer = ({context, postId, follow, unfollow}, onData) => {
  const {Meteor, Collections, UserService} = context()
  const post = Collections.Posts.findOne(postId)

  const followers = post.followers
    .map((follower) => UserService.getUserView(Collections.Users.findOne(follower.userId)))
    .filter((user) => user !== undefined) // TODO: investigate correct use of equal sign

  onData(null, {
    user: UserService.currentUser(),
    post,
    followers,
    isFollowing: post.followers.some((f) => f.userId === Meteor.userId()),
    follow: () => follow(postId),
    unfollow: () => unfollow(postId)
  })
}

const depsMapper = (context, actions) => {
  return {
    create: actions.messages.create,
    follow: (args) => {
      AmplitudeService.track('post/follow', { from: 'post/details' })
      return actions.posts.follow(args)
    },
    unfollow: (args) => {
      AmplitudeService.track('post/unfollow', { from: 'post/details' })
      return actions.posts.unfollow(args)
    },
    showPostFollowers: actions.posts.showPostFollowers,
    showSnackbarError: actions.posts.showSnackbarError,
    fetchMentions: actions.search.fetchMentions,
    context: () => context
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(InputBox)
