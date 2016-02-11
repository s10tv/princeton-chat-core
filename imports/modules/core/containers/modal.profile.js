import Profile from '/imports/modules/core/components/modal.profile.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'

export const composer = ({context}, onData) => {
  const { LocalState } = context()

  const isOpen = LocalState.get('PROFILE_USER') !== undefined
  const user = LocalState.get('PROFILE_USER')

  onData(null, { isOpen, user })
}

export const depsMapper = (context, actions) => ({
  handleClose: actions.profile.closeModal,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Profile)
