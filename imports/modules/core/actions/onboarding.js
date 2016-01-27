export default {
  clickStartOnboarding({Meteor}) {
    Meteor.call('welcome/yes');
  },

  clickAbandonOnboarding({Meteor}) {
    Meteor.call('welcome/no');
  },

  submitTextField({Meteor, LocalState}, event, textField) {
    event.preventDefault();
    const message = textField.getValue();
    Meteor.call('message/add', message, LocalState.get('type'), (err) => {
      textField.setValue('');

      LocalState.set('type', undefined);
    });
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

  addPassword({Meteor}, event) {
    event.preventDefault();
    const pwd = event.target.value;
    if (pwd) {
      Accounts.changePassword(Meteor.user().inviteCode, pwd);
      Meteor.call('welcome/setLoginService', 'password');
      
      event.target.value = "";
    }
  },

  clickSkip({Meteor}) {
    Meteor.call('share/skip');
  }
}
