export default {
  clickFacebook({Meteor, LocalState}) {
    event.preventDefault();
    Meteor.linkWithFacebook({}, (err) => {
      if (err) {
        LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.message);
        return;
      }

      Meteor.call('welcome/setLoginService', 'facebook');
    });
  },

  addPassword({Meteor, LocalState}, pwd) {
    event.preventDefault();
    if (pwd) {
      Accounts.changePassword(Meteor.user().inviteCode, pwd, (err) => {
        if (err) {
          LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason);
          return;
        }

        Meteor.call('welcome/setLoginService', 'password', (err) => {
          if (err) {
            LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason);
          }
        });
      });
    }
  },

  closeSnackbar({LocalState}) {
    LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', null);
  }
}
