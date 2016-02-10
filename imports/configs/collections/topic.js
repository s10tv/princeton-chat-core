import {Mongo} from 'meteor/mongo'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import FollowerSchema from './common/follower'

const Topics = new Mongo.Collection('topics')

const TopicSchema = new SimpleSchema({
  displayName: { type: String },
  description: { type: String, optional: true },
  followers: { type: [FollowerSchema], defaultValue: [], optional: true },
  numPosts: { type: Number, defaultValue: 0, optional: true },
  parentTopicId: { type: String, optional: true },
  order: { type: Number, decimal: true, optional: true }
})

Topics.attachBehaviour('timestampable')
Topics.attachSchema(TopicSchema)

export default Topics
