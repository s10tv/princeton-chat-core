import EditProfileModal from '../components/modal.editprofile.jsx'
import {useDeps, composeWithTracker, composeAll} from '/client/config/mantra'
import UserService from '../../../libs/user.service'
import AvatarService from '/imports/libs/avatar.service'

export const composer = ({context, actions}, onData) => {
  const { Meteor, LocalState, Accounts } = context()

  const resetSessionEditProfile = () => {
    LocalState.set('SETTINGS_EDIT_PROFILE_FIRST_NAME', null)
    LocalState.set('SETTINGS_EDIT_PROFILE_LAST_NAME', null)
    LocalState.set('SETTINGS_EDIT_PROFILE_USERNAME', null)
    LocalState.set('SETTINGS_EDIT_PROFILE_AVATAR', null)
    LocalState.set('SETTINGS_EDIT_PROFILE_CLASS_YEAR', null)
    LocalState.set('SETTINGS_EDIT_PROFILE_OLD_PASSWORD', null)
    LocalState.set('SETTINGS_EDIT_PROFILE_NEW_PASSWORD', null)
  }

  const handleClose = () => {
    LocalState.set('SETTINGS_EDIT_PROFILE_SHOWING', false)
    resetSessionEditProfile()
  }

  const isOpen = LocalState.get('SETTINGS_EDIT_PROFILE_SHOWING') || false

  const user = UserService.currentUser()

  const firstName = LocalState.get('SETTINGS_EDIT_PROFILE_FIRST_NAME') || user.firstName
  const lastName = LocalState.get('SETTINGS_EDIT_PROFILE_LAST_NAME') || user.lastName
  const username = LocalState.get('SETTINGS_EDIT_PROFILE_USERNAME') || user.username
  const classYear = LocalState.get('SETTINGS_EDIT_PROFILE_CLASS_YEAR') || +user.classYear
  const oldPassword = LocalState.get('SETTINGS_EDIT_PROFILE_OLD_PASSWORD')
  const newPassword = LocalState.get('SETTINGS_EDIT_PROFILE_NEW_PASSWORD')

  const firstNameUpdate = (event) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_FIRST_NAME', event.target.value)
  }

  const lastNameUpdate = (event) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_LAST_NAME', event.target.value)
  }

  const usernameUpdate = (event) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_USERNAME', event.target.value)
  }

  const handleClassYearChange = (event, index, value) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_CLASS_YEAR', value)
  }

  const handleOldPasswordChange = (event) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_OLD_PASSWORD', event.target.value)
  }

  const handleNewPasswordChange = (event) => {
    LocalState.set('SETTINGS_EDIT_PROFILE_NEW_PASSWORD', event.target.value)
  }

  var isDefaultAvatar = LocalState.get('SETTINGS_EDIT_PROFILE_IS_DEFAULT_AVATAR')
  if (isDefaultAvatar === undefined) {
    isDefaultAvatar = user.avatar.isDefaultAvatar
  }
  const currentAvatarColor = LocalState.get('SETTINGS_EDIT_PROFILE_DEFAULT_AVATAR_COLOR') ||
    user.avatar.color
  const currentAvatarUrl = LocalState.get('SETTINGS_EDIT_PROFILE_AVATAR') || user.avatar.url

  const changeAvatarToDefault = () => {
    LocalState.set('SETTINGS_EDIT_PROFILE_DEFAULT_AVATAR_COLOR',
      AvatarService.generateRandomColorForDefaultAvatar())
    LocalState.set('SETTINGS_EDIT_PROFILE_IS_DEFAULT_AVATAR', true)
    LocalState.set('SETTINGS_EDIT_PROFILE_AVATAR',
      AvatarService.generateDefaultAvatarForAudience(process.env.AUDIENCE || 'princeton'))
  }

  const changeAvatarToFacebook = () => {
    if (user.services.facebook) {
      LocalState.set('SETTINGS_EDIT_PROFILE_AVATAR', `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`)
      LocalState.set('SETTINGS_EDIT_PROFILE_IS_DEFAULT_AVATAR', false)
    } else {
      Meteor.linkWithFacebook({}, (err) => {
        if (err) {
          return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
        } else {
          LocalState.set('SETTINGS_EDIT_PROFILE_AVATAR', `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`)
          LocalState.set('SETTINGS_EDIT_PROFILE_IS_DEFAULT_AVATAR', false)
        }
      })
    }
  }

  const handleSubmit = () => {
    LocalState.set('SETTINGS_EDIT_PROFILE_SHOWING', false)

    const profile = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      classYear: classYear,
      avatarUrl: currentAvatarUrl,
      isDefaultAvatar: isDefaultAvatar,
      avatarColor: currentAvatarColor
    }

    Meteor.call('profile/update', profile, (err) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }

      resetSessionEditProfile()
    })
  }

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
    handleClose,
    isOpen,
    handleSubmit,
    firstName,
    lastName,
    username,
    firstNameUpdate,
    lastNameUpdate,
    usernameUpdate,
    handleOldPasswordChange,
    handleNewPasswordChange,
    changePassword,
    isDefaultAvatar,
    classYear,
    currentAvatarColor,
    handleClassYearChange,
    currentAvatarUrl,
    changeAvatarToFacebook,
    changeAvatarToDefault
  })
}

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(EditProfileModal)
