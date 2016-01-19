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
