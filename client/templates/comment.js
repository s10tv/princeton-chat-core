Template.comment.helpers({
  owner: function() {
    return Users.findOne({ _id: this.ownerId });
  },
  displayTime: function() {
    return TimeDifferenceCalculator.calculate(new Date(), this.createdAt, true);
  },

  // user in context
  displayName: function() {
    return `${ this.firstName } ${this.lastName}`;
  },

  avatarUrl: function() {
    return this.avatar.url;
  }
})
