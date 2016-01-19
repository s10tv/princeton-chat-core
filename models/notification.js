this.Notification = new Mongo.Collection('notifications');

NotificationSchema = new SimpleSchema({
  title: { type: String, optional: true },
  content: { type: String, optional: true },
});

this.Notification.attachBehaviour('timestampable');
this.Notification.attachSchema(NotificationSchema);
