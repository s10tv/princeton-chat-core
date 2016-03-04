import {Mongo} from 'meteor/mongo'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import FollowerSchema from './common/follower'
import ImageSchema from './common/image'

const AMAPost = new Mongo.Collection('amapost')
const AmaMessage = new Mongo.Collection('amamessage')

// A notification is a line item in a user's inbox
const AmaPostSchema = new SimpleSchema({
  // Who is this AMA for? Optional because this user may not be a princeton.chat user yet
  ownerId: { type: String, optional: true },
  ownerIsTyping: { type: Boolean, optional: true, defaultValue: false },

  // Public facing title of what the AMA is about
  title: { type: String },

  // A blurb for the guest speaker to introduce him/herself
  introText: { type: String, optional: true },

  // which users are attending this event?
  attendees: { type: [FollowerSchema], defaultValue: [] },

  // logistics of when this AMA starts
  startTime: { type: Date },
  endTime: { type: Date, optional: true },

  cover: { type: ImageSchema, optional: true, defaultValue: {
    urL: 'https://callawayhenderson.files.wordpress.com/2014/01/img_2536ps.jpg'
  }}
})

const AmaMessageSchema = new SimpleSchema({
  // Who wrote this message?
  ownerId: {type: String},

  // All messages belong to an ama post
  amaPostId: {type: String},

  // The parent message that this message got grouped into
  parentMessageId: {type: String, optional: true},
  parentMessageOwner: {type: String, optional: true},

  // Cache the child messages that are part of this message, for easy grouping
  childrenMessageIds: {type: [String], optional: true, defaultValue: []},

  // How many upvotes does this message have?
  numUpvotes: {type: Number, defaultValue: 0}
})

AMAPost.attachBehaviour('timestampable')
AMAPost.attachSchema(AmaPostSchema)

AmaMessage.attachBehaviour('timestampable')
AmaMessage.attachSchema(AmaMessageSchema)

export {
  AMAPost,
  AmaMessage
}
