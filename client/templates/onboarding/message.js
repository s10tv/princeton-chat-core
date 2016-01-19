Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.message.helpers({
  user: function() {
    if (this.senderId === 'system') {
      return {
        firstName: 'Tigercub',
        avatar: {
          url: '/images/ic-tiger.png'
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
