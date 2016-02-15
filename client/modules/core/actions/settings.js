export default {
  logout ({ LocalState, Meteor, FlowRouter }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false) // first close this
    Meteor.logout()
    FlowRouter.go('/')
  },

  showSettingsModal ({ LocalState }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', true)
  },

  closeSettingsModal ({ LocalState }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false)
  },

  editProfile ({ LocalState }, event) {
    LocalState.set('SETTINGS_EDIT_PROFILE_SHOWING', true)
  }
}
