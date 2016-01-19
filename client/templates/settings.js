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
  }
})

Template.settings.events({
  'click #logout': function() {
    Meteor.logout();
    Router.go('/signin');
  },

  'click .radio-notifications': function(event) {
    var emailNotificationPref = event.currentTarget.value;
    Meteor.call('emailPreference/update', emailNotificationPref);
  }
})
