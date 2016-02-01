export default {
  goToSetPasswordPage({ LocalState }) {
    console.log('im going to the password page');
    // LocalState.set('GO_TO_SET_PASSWORD', true);
  },

  clickFacebook({Meteor}) {
    event.preventDefault();
    Meteor.linkWithFacebook({}, (err) => {
      if (err) {
        console.log(err);
      }

      Meteor.call('welcome/setLoginService', 'facebook');
    });
  },

  addPassword({Meteor}, pwd) {
    event.preventDefault();
    if (pwd) {
      Accounts.changePassword(Meteor.user().inviteCode, pwd);
      Meteor.call('welcome/setLoginService', 'password');
    }
  },
}
