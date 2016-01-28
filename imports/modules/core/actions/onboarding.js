export default {
  clickStartOnboarding({Meteor}) {
    Meteor.call('welcome/triggerSelectTopicPrompt');
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

  addPassword({Meteor}, pwd) {
    event.preventDefault();
    if (pwd) {
      Accounts.changePassword(Meteor.user().inviteCode, pwd);
      Meteor.call('welcome/setLoginService', 'password');
    }
  },

  clickSkip({Meteor}) {
    Meteor.call('share/skip');
  }
}
