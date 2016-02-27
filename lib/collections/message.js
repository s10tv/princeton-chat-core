import {Mongo} from 'meteor/mongo'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import {AttachmentSchema} from './common/attachment.js'

const Messages = new Mongo.Collection('messages')

const MessageSchema = new SimpleSchema({
  ownerId: { type: String },
  postId: { type: String }, // post id or direct message thread id.
  content: { type: String, optional: true },
  source: { type: String, optional: true, defaultValue: 'web', allowedValues: [
    'web', 'email', 'mobile'
  ]},
  attachments: { type: [AttachmentSchema], optional: true },
  // for use during onboarding
  senderId: { type: String, optional: true },
  type: { type: String, optional: true, allowedValues: [
    'raw',
    'welcome',
    'firstname',
    'lastname',
    'classyear',
    'classtype',
    'topics',
    'share',
    'thanks',
    'linkservice']
  },
  qnum: { type: String, optional: true },
  resumeType: { type: String, optional: true }
})

Messages.attachBehaviour('timestampable')
Messages.attachSchema(MessageSchema)

Messages.allow({
  insert: function (userId, doc, fields, modifier) {
    return doc.ownerId === userId
  }
})

export default Messages
