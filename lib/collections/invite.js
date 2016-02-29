import {Mongo} from 'meteor/mongo'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'

const Invites = new Mongo.Collection('invites')

const InviteSchema = new SimpleSchema({
  email: { type: String },
  inviteCode: { type: String },

  // required for non-alumni validation
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  birthDate: { type: String, optional: true },
  classYear: { type: String, optional: true },
  degree: { type: String, optional: true },
  desc: { type: String, optional: true },

  // internal
  status: { type: String, allowedValues: [
    'nongrad-pending', // this invite is from a non-princeton grad
    'pending-onboard', // this user is invited by someone else during onboarding
    'pending', // this user is under review
    'sent', // this invite has been approved
    'redeemed' // this invite was redeemed
  ], defaultValue: 'pending' },
  referredBy: { type: String, optional: true },
  redeemedBy: { type: String, optional: true }
})

Invites.attachBehaviour('timestampable')
Invites.attachSchema(InviteSchema)

export default Invites
