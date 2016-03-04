import PostFollowersModal from '../components/modal.post.followers.jsx'
import {useDeps, composeWithTracker, compose, composeAll} from 'mantra-core'

export const composer = ({context}, onData) => {
  const { LocalState } = context()
  const isOpen = LocalState.get('FOLLOWERS_MODAL_OPEN') || false
  onData(null, {
    isOpen
  })
}

const depsMapper = (context, actions) => ({
  closeModal: actions.postfollowers.closeModal,
  showUserProfile: actions.profile.showUserProfile,
  store: context.store,
  context: () => context
})

export const onPropsChange = ({context}, onData) => {
  const {UserService, store} = context()

  const processedFollowers = (followers) => (
    followers ? followers.map((follower) => UserService.getUserView(follower)) : []
  )

  onData(null, {followers: processedFollowers(store.getState().core.followers)})
  return store.subscribe(() => {
    const {followers} = store.getState().core
    onData(null, {followers: processedFollowers(followers)})
  })
}

export default composeAll(
  compose(onPropsChange),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(PostFollowersModal)
