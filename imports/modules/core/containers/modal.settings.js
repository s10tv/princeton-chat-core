import SettingsModal from '/imports/modules/core/components/modal.settings.jsx'
import {useDeps, composeWithTracker, composeAll} from '/client/config/mantra'
import UserService from '../../../libs/user.service'

export const composer = ({context, actions}, onData) => {
  const { LocalState } = context()
  const isOpen = LocalState.get('SETTINGS_DIALOG_SHOWING') || false

  const user = UserService.currentUser()
  onData(null, { isOpen, user })
}

const depsMapper = (context, actions) => ({
  onLogout: actions.settings.logout,
  handleClose: actions.settings.closeSettingsModal,
  editProfile: actions.settings.editProfile,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SettingsModal)
