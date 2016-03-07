import {createOnSubmit} from '/client/lib/helpers'
import FilePickerService from '/client/lib/filepicker.service'

export default {
  logout ({ LocalState, Meteor, history }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false) // first close this
    Meteor.logout(() => {
      history.push('/login')
    })
  },

  changeAvatarToFacebook ({Meteor, LocalState, UserService}) {
    const updateToFbAvatar = () => {
      Meteor.call('profile/avatar/useFacebook', (err) => {
        if (err) {
          return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
        }
      })
    }

    if (UserService.currentUser().services.facebook) {
      updateToFbAvatar()
    } else {
      Meteor.linkWithFacebook({}, (err) => {
        if (err) {
          return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
        }
        updateToFbAvatar()
      })
    }
  },

  changeAvatarFromFilestack ({Meteor, LocalState}) {
    FilePickerService.chooseImage((url) => {
      Meteor.call('profile/avatar/useFilestack', url, (err) => {
        if (err) {
          return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
        }
      })
    })
  },

  changeAvatarToDefault ({Meteor, LocalState}) {
    Meteor.call('profile/avatar/useDefault', (err) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }
    })
  },

  navigateToSettings ({LocalState, history}) {
    // if we were in mobile mode, and showing sidebar, hide sidebar now
    LocalState.set('SHOW_SIDE_BAR', false)
    history.push('/settings')
  },

  showSettingsModal ({ LocalState }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', true)
  },

  closeSettingsModal ({ LocalState }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false)
  },

  editProfile ({ LocalState }, event) {
    LocalState.set('SETTINGS_EDIT_PROFILE_SHOWING', true)
  },

  submitEditProfile: createOnSubmit('profile/update', ({sweetalert}) => {
    sweetalert({title: 'Updated', text: 'Your profile has been updated'})
  })
}
