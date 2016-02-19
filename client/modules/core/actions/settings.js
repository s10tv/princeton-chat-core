import {createOnSubmit} from '/client/lib/helpers'

export default {
  logout ({ LocalState, Meteor, FlowRouter }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false) // first close this
    Meteor.logout(() => {
      FlowRouter.go('onboarding-login')
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

    if (UserService.currentuser().services.facebook) {
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

  changeAvatarToDefault ({Meteor, LocalState}) {
    Meteor.call('profile/avatar/useDefault', (err) => {
      if (err) {
        return LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason)
      }
    })
  },

  navigateToSettings ({LocalState, FlowRouter}) {
    // if we were in mobile mode, and showing sidebar, hide sidebar now
    LocalState.set('SHOW_SIDE_BAR', false)

    return FlowRouter.go('settings')
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

