var ERRORS_KEY = 'inviteErrors';

Template.signupInvite.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.signupInvite.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.signupInvite.events({
  'click #skip': function() {
    Router.go('signupClaimUsername')
  },

  'submit .ts-form': function(event) {
    event.preventDefault();
    const firstFriendInfo = $(event.target).find('[name=firstFriend]').val();
    const secondFriendInfo = $(event.target).find('[name=secondFriend]').val();

    var errors = {};

    var omitErrStr = "You omitted a field, don't you want to see your friends here?";
    if (!firstFriendInfo) {
      errors.friendName1 = omitErrStr;
    }

    if (!secondFriendInfo) {
      errors.friendName2 = omitErrStr;
    }

    var wrongFullNameStr = "Full names should only contain letters";
    var wrongEmail = "Make sure you entered the email correctly";

    if (firstFriendInfo && firstFriendInfo.split('@').length == 1 && !firstFriendInfo.match(/^[a-zA-Z ]*$/)) { // no @, but has other symbols
      errors.friendName1 = wrongFullNameStr;
    }

    if (secondFriendInfo && secondFriendInfo.split('@').length == 1 && !secondFriendInfo.match(/^[a-zA-Z ]*$/)) {
      errors.friendName2 = wrongFullNameStr;
    }

    // if there are more than one @
    if (firstFriendInfo && firstFriendInfo.split('@').length > 2) {
      errors.friendName1 = wrongEmail;
    }

    if (secondFriendInfo && secondFriendInfo.split('@').length > 2) {
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

    Meteor.call('friends/add', [
      {
        field: firstFriendInfo,
        isEmail: isEmail(firstFriendInfo)
      },
      {
        field: secondFriendInfo,
        isEmail: isEmail(secondFriendInfo)
      }
    ], function(err) {
      if (err) {
        return Session.set(ERRORS_KEY, {'none': err.reason});
      }

      Router.go('signupClaimUsername');
    });
  },
})
