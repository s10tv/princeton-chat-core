import InputBox from '/imports/modules/core/components/inputBox.jsx'
import {useDeps, composeAll, composeWithTracker} from '/imports/libs/mantra'

const NUM_MAX_DISPLAY_FOLLOWERS = 3

const composer = ({context, postId, follow, unfollow}, onData) => {
  const {Meteor, Collections} = context()
  const post = Collections.Posts.findOne(postId)
  
  const followers = post.followers
    .map(follower => Users.findOne(follower.userId))
    .filter(user => user != undefined) // TODO: investigate correct use of equal sign  

  onData(null, {
    followers,
    isFollowing: post.followers.some((f) => f.userId === Meteor.userId()),
    follow: () => follow(postId),
    unfollow: () => unfollow(postId),
  })
}

const depsMapper = (context, actions) => ({
  create: actions.messages.create,
  follow: actions.posts.follow,
  unfollow: actions.posts.unfollow,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(InputBox)
