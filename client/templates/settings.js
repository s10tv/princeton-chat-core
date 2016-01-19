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
  }
})

Template.settings.events({
  'click #logout': function() {
    Meteor.logout();
    Router.go('/signin');
  }
})
