import {SimpleSchema} from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  userId: { type: String },
  unreadCount: { type: Number, defaultValue: 0 }
})
