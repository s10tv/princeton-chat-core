import PostFollowersModal from '../components/modal.post.followers.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import UserService from '../../../libs/user.service'

export const composer = ({context, actions}, onData) => {
  const { LocalState } = context()

  const isOpen = LocalState.get('FOLLOWERS_MODAL_OPEN') || false
  const followersFromState = LocalState.get('POST_FOLLOWERS') || []
  const followers = followersFromState.map((follower) => {
    return UserService.getUserView(follower)
  })

  onData(null, {
    isOpen,
    followers
  })
}

const depsMapper = (context, actions) => ({
  closeModal: actions.postfollowers.closeModal,
  showUserProfile: actions.profile.showUserProfile,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(PostFollowersModal)
