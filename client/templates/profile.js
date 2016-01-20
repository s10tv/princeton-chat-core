Template.profile.helpers({
  profileUser: function() {
    const user = Users.findOne(this._id);
    if (user.emails) {
      user.email = user.emails[0];
    } else {
      user.email = {};
    }

    return user;
  },
  parsedClassYear: function() {
    const user = Meteor.user();
    var prefix;
    switch (user.classType) {
      case 'grad':
        prefix = "*";
        break;
      case 'undergrad':
        prefix = "'";
        break;
    }
    return user.classYear.replace(/^[0-9]{2}/, prefix);
  }
});
