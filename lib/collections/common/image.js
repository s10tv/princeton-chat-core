import {SimpleSchema} from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  url: { type: String, optional: true },
  isDefaultAvatar: { type: Boolean, optional: true, defaultValue: true },
  color: { type: String, optional: true },
  width: { type: Number, optional: true },
  height: { type: Number, optional: true }
})
