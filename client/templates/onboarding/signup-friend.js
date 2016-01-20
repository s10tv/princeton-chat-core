var ERRORS_KEY = 'friendErrors';

Template.signupFriend.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.signupFriend.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.signupFriend.events({
  'submit': function(event, template) {
    event.preventDefault();
    const friendField1 = template.$('[name=friendName1]').val();
    const friendField2 = template.$('[name=friendName2]').val();

    var errors = {};

    var omitErrStr = "You omitted a field, don't you want to see your friends here?";
    if (!friendField1) {
      errors.friendName1 = omitErrStr;
    }

    if (!friendField2) {
      errors.friendName2 = omitErrStr;
    }

    var wrongFullNameStr = "Full names should only contain letters";
    var wrongEmail = "Make sure you entered the email correctly";

    if (!friendField1.match(/^[^@][a-zA-Z]*$/)) { // no @, but has other symbols
      errors.friendName1 = wrongFullNameStr;
    }

    if (!friendField2.match(/^[^@][a-zA-Z]*$/)) {
      errors.friendName2 = wrongFullNameStr;
    }

    // if there are more than one @, and there is no .
    if (friendField1.split('@').length > 2 || friendField1.split('.').length == 1) {
      errors.friendName1 = wrongEmail;
    }

    if (friendField2.split('@').length > 2 || friendField2.split('.').length == 1) {
      errors.friendName2 = wrongEmail;
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }

    var isEmail = function(field) {
      if (field.split('@').length == 2 && field.split('.').length > 1) {
        return true;
      }
    }

    Meteor.call('friend/add', [
      {
        field: friendField1,
        isEmail: isEmail(friendField1)
      },
      {
        field: friendField2,
        isEmail: isEmail(friendField2)
      }
    ], function(err) {
      if (error) {
        return Session.set(ERRORS_KEY, {'none': error.reason});
      }

      Router.go('signupClaimUsername');
    });
  }
});
