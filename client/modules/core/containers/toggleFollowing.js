import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import ToggleFollowing from '/client/modules/core/components/toggleFollowing.jsx'
import {PageLoader} from '/client/lib/ui.jsx'

export const composer = ({context, postId}, onData) => {
  const {Meteor, Collections, history, UserService} = context()
  const {Posts} = Collections
  if (Meteor.subscribe('post.single', postId).ready()) {
    const post = Posts.findOne(postId)

    if (!post) {
      return history.push('/not-found')
    }
    const currentUser = UserService.currentUser()
    const isFollowing = currentUser.followingPosts.indexOf(post._id) !== -1
    onData(null, { post, isFollowing })
  }
}

const depsMapper = (context, actions) => ({
  context: () => context,
  followPost: actions.posts.follow,
  unfollowPost: actions.posts.unfollow
})

export default composeAll(
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(ToggleFollowing)
