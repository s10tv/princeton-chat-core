export default {
  archive ({Meteor}, notificationId) {
    Meteor.call('inbox/archive', notificationId)
  }
}
