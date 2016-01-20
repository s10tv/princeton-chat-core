var ERRORS_KEY = 'joinErrors';

Template.signupClaimUsername.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.signupClaimUsername.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  },
  username: function() {
    if (Meteor.user()) {
      return Meteor.user().username;
    }
  },
});

Template.signupClaimUsername.events({
  'submit': function(event, template) {
    event.preventDefault();
    var username = template.$('[name=username]').val();
    var password = template.$('[name=password]').val();
    var confirm = template.$('[name=confirm]').val();

    var errors = {};

    if (!username) {
      errors.username = 'Please enter a username.';
    }

    if (!password) {
      errors.password = 'Password required';
    }

    if (confirm !== password) {
      errors.confirm = "Passwords don't match";
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    Accounts.changePassword(Meteor.user().inviteCode, password);
    Meteor.call('signup/setPassAndClaimUsername', username, (err, res) => {
      if (err) {
        errors.serverError = err.reason;
        Session.set(ERRORS_KEY, errors);
        return;
      }

      if (!res || res == false) {
        errors.usernameClaim = `${username} is already taken. Please try again.`;
        Session.set(ERRORS_KEY, errors);
        return;
      }

      Router.go('home');
    });
  }
});
