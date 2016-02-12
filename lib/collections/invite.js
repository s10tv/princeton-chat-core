import {Mongo} from 'meteor/mongo'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'

const Invites = new Mongo.Collection('invites')

const InviteSchema = new SimpleSchema({
  firstName: { type: String },
  lastName: { type: String },
  birthDate: { type: String },
  classYear: { type: String },
  degree: { type: String },
  email: { type: String },

  // internal
  status: { type: String, allowedValues: [
    'pending', // this user is under review
    'sent', // this invite was sent
    'redeemed' // this invite was redeemed
  ], defaultValue: 'pending' },
  redeemedBy: { type: String, optional: true }
})

Invites.attachBehaviour('timestampable')
Invites.attachSchema(InviteSchema)

export default Invites
