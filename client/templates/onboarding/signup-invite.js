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

    if (firstFriendInfo) {
      Meteor.call('friend/add', firstFriendInfo);
    }

    if (secondFriendInfo) {
      Meteor.call('friend/add', secondFriendInfo);
    }
  },
})
