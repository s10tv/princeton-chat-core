Template.class_year.helpers({
  firstName: () => {
    return Meteor.user().firstName
  }
})

Template.class_year.rendered = () => {
  Session.set('type', 'classyear');
}
