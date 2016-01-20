Template.settings.helpers({
  currentUser: function() {
    const user = Meteor.user();
    if (user.emails) {
      user.email = user.emails[0];
    } else {
      user.email = {};
    }

    return user;
  },

  expertiseSections: function() {
    const sections = [];

    var currentItem = {};
    Lists.find().fetch().forEach((list) => {
      if (!currentItem.firstExpertise) {
        currentItem.firstExpertise = list;
      } else if (!currentItem.secondExpertise) {
        currentItem.secondExpertise = list;
      } else {
        sections.push(currentItem);
        currentItem = { firstExpertise: list };
      }
    })

    return sections;
  },

  isCurrentPrefChecked: function(pref) {
    return Meteor.user().emailPreference === pref;
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

    if (user.classYear) {
      return user.classYear.replace(/^[0-9]{2}/, prefix);
    }
  },

  // TODO: for future versions
  // isFacebookIntegrated: function() {
  //   Meteor.call('facebook/isActive', function(err, res) {
  //     if (err) {
  //       console.log(err);
  //     }
  //
  //     if (res) {
  //       return 'facebook';
  //     } else {
  //       return '';
  //     }
  //   });
  // },
  //
  // isInstagramIntegrated: function() {
  //   Meteor.call('instagram/isActive', function(err, res) {
  //     if (err) {
  //       console.log(err);
  //     }
  //
  //     if (res) {
  //       console.log('insta exists!!');
  //       return 'instagram';
  //     } else {
  //       return '';
  //     }
  //   });
  // },
  //
  // isTwitterIntegrated: function() {
  //   Meteor.call('twitter/isActive', function(err, res) {
  //     if (err) {
  //       console.log(err);
  //     }
  //
  //     if (res) {
  //       return 'twitter';
  //     } else {
  //       return '';
  //     }
  //   });
  // }
});

Template.settings.events({
  'click #editProfile': function(e) {
    e.preventDefault();
    const user = Meteor.user();
    Session.set('profile', {
      firstName: user.firstName,
      lastName: user.lastName,
      classYear: user.classYear,
      classType: user.classType,
      info: user.info,
    });
    $('#editProfileModal').modal('show');
  },

  'click #logout': function() {
    Meteor.logout();
    Router.go('/signin');
  },

  'click .radio-notifications': function(event) {
    var emailNotificationPref = event.currentTarget.value;
    Meteor.call('emailPreference/update', emailNotificationPref);
  }
})
