import Profile from '/imports/modules/core/components/profile.jsx'
import {useDeps, composeWithTracker, composeAll} from '/imports/libs/mantra'

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
