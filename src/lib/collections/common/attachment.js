import {SimpleSchema} from 'meteor/aldeed:simple-schema'

export default new SimpleSchema({
  url: { type: String },
  contentType: { type: String },
  name: { type: String }
})
