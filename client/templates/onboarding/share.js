Template.share.events({
  'click #skip': () => {
    Meteor.call('share/skip')
  },
})
