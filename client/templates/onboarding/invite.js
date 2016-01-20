Template.invite.rendered = function() {
  Messages.find().observe({
    added: function(message) {
      console.log('message arrived');
      // $("#onboarding-conversation").animate({ scrollTop: $("#onboarding-conversation")[0].scrollHeight}, 1000);
    }
});
}

Template.invite.helpers({
  messages: () => {
    return Messages.find().fetch();
  },
})

Template.invite.events({
  'submit .message-box-form': function(event) {
    event.preventDefault();

    const message = $('#m').val();
    Meteor.call('message/add', message, Session.get('type'), (err) => {
      $('#m').val('');
    });

    Session.set('type', undefined);
  }
})
