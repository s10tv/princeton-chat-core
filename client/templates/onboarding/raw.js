Template.raw.helpers({
  isMine: function() {

    if (this.senderId == Meteor.userId()) {
      return true;
    }

    // if (this.senderId == 'system') {
    //   return 'system'
    // }
    return false;
  },
  resumeType: function() {
    if (this.resumeType) {
      Session.set('type', this.resumeType);
    }
    return this.resumeType;
  }
})
