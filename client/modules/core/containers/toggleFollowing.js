import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import ToggleFollowing from '/client/modules/core/components/toggleFollowing.jsx'
import {PageLoader} from '/client/lib/ui.jsx'

export const composer = ({context, postId}, onData) => {
  const {Meteor, Collections, FlowRouter} = context()
  const {Posts} = Collections
  if (Meteor.subscribe('posts.single', postId).ready()) {
    const post = Posts.findOne(postId)
    if (!post) {
      return FlowRouter.go('/error')
    }
    let isFollowing = false

    if (action === 'follow') {
      Meteor.call('post/follow', postId, (err) => {

      })
      isFollowing = true
    } else if (action === 'unfollow') {
      Meteor.call('post/unfollow', postId)
      isFollowing = false
    } else {
      return FlowRouter.go('/error')
    }
  }
  onData(null, {})
}

const depsMapper = (context, actions) => ({
  context: () => context
})

export default composeAll(
  composeWithTracker(composer, PageLoader),
  useDeps(depsMapper)
)(ToggleFollowing)
