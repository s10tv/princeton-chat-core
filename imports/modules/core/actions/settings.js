export default {
  logout({ LocalState, Meteor, FlowRouter }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false); // first close this
    Meteor.logout();
    FlowRouter.go('home');
  },

  closeSettingsModal({ LocalState }) {
    LocalState.set('SETTINGS_DIALOG_SHOWING', false);
  }
}