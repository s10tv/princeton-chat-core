import {Mongo} from 'meteor/mongo'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'

const Notifications = new Mongo.Collection('notifications')

// A notification is a line item in a user's inbox
const NotificationSchema = new SimpleSchema({
  // A user id describing who this notification is for.
  ownerId: {type: String},

  // captures state of this notification - whether it's viewed or not.
  status: { type: String, allowedValues: [
    'active', 'read'
  ]},

  // why did we get mentioned?
  reason: { type: String, allowedValues: [
    'newpost', 'reply', 'mention', 'newchannel'
  ]},

  // for now, only posts can generate notifications. References the post that
  // generated this notification.
  postId: {type: String, optional: true},
  lastActionTimestamp: { type: Date, optional: true }

  // cache more ama info to help speed up rendering if needed.

  // When we have ephemeral posts
  // yakId: { type: String, optional: true }
})

Notifications.attachBehaviour('timestampable')
Notifications.attachSchema(NotificationSchema)

export default Notifications
