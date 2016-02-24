import SettingsModal from '/client/modules/core/components/settings.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import UserService from '../../../../lib/user.service.js'
import {updateProfileValidator} from '/lib/validation/core'
import {normalizeFullName} from '/lib/normalization'
import {reduxForm} from 'redux-form'

export const formConfig = {
  form: 'core/editprofile',
  fields: ['firstName', 'lastName', 'displayName', 'username', 'classYear'],
  validate: updateProfileValidator,
  normalize: {
    displayName: normalizeFullName
  }
}

export const composer = ({context}, onData) => {
  const { Meteor, LocalState, Accounts } = context()
  if (Meteor.subscribe('userData').ready()) {
    const user = UserService.currentUser()
    const oldPassword = LocalState.get('SETTINGS_EDIT_PROFILE_OLD_PASSWORD')
    const newPassword = LocalState.get('SETTINGS_EDIT_PROFILE_NEW_PASSWORD')
    const handleOldPasswordChange = (event) => {
      LocalState.set('SETTINGS_EDIT_PROFILE_OLD_PASSWORD', event.target.value)
    }
    const handleNewPasswordChange = (event) => {
      LocalState.set('SETTINGS_EDIT_PROFILE_NEW_PASSWORD', event.target.value)
    }

    var isDefaultAvatar = user.avatar.isDefaultAvatar
    const currentAvatarColor = user.avatar.color
    const currentAvatarUrl = user.avatar.url

    const changePassword = () => {
      Accounts.changePassword(oldPassword, newPassword, (err) => {
        if (err) {
          return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
        }

        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', 'Your password has been changed.')
      })
    }

    onData(null, {
      user,
      initialValues: {
        firstName: user.firstName,
        lastName: user.lastName,
        classYear: user.classYear,
        username: user.username,
        displayName: user.displayName
      },

      handleOldPasswordChange,
      handleNewPasswordChange,
      changePassword,

      isDefaultAvatar,
      currentAvatarColor,
      currentAvatarUrl
    })
  }
}

const depsMapper = (context, actions) => ({
  store: context.store,
  onSubmit: actions.settings.submitEditProfile,
  onLogout: actions.settings.logout,
  handleClose: actions.settings.closeSettingsModal,
  changeAvatarToDefault: actions.settings.changeAvatarToDefault,
  changeAvatarToFacebook: actions.settings.changeAvatarToFacebook,
  editProfile: actions.settings.editProfile,
  context: () => context
})

export default composeAll(
  reduxForm(formConfig),
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SettingsModal)
