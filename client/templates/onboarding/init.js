Template.init.rendered = () => {
  Session.set('type', undefined);
}

Template.init.helpers({
  buttonText: () => {
    // we have answered this question already
    if (Messages.find({ ownerId: Meteor.userId(), qnum: 'welcome/yes' }).count() > 0) {
      return
    }

    if (Messages.find({ ownerId: Meteor.userId(), qnum: 'welcome/no' }).count() > 0) {
      return 'Changed your mind?'
    }

    return 'Sure'
  },

  noButtonDisplay: () => {
    if (Messages.find().count() == 1) {
      return null;
    }

    return 'display: none';
  }
})

Template.init.events({
  'click #yes': () => {
    Meteor.call('welcome/yes')
  },

  'click #no': () => {
    Meteor.call('welcome/no')
  },
})
