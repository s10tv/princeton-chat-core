Notification = new Mongo.Collection('notifications');

NotificationSchema = new SimpleSchema({
  title: { type: String, optional: true },
  content: { type: String, optional: true },
});

Notification.attachBehaviour('timestampable');
Notification.attachSchema(NotificationSchema);

export default Notification;
