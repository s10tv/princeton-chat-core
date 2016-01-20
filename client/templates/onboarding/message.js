Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.onboarding_message.helpers({
  user: function() {
    if (this.senderId === 'system') {
      return {
        firstName: 'Tigercub',
        avatar: {
          url: '/img/ic-tiger.png'
        },
      }
    } else {
      return Meteor.user();
    }
  },
  msgTime: function() {
    return moment(this.createdAt).format('HH:mm A');
  }
});
