import { Meteor } from 'meteor/meteor'
import { Users } from '/lib/collections'

ServiceConfiguration.configurations.remove({
  service: 'facebook'
})

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: process.env.FB_APP_ID || '1687343324838305',
  secret: process.env.FB_APP_SECRET || '8bc99973abd08ad512642ea8c84d1bdb'
})

Accounts.validateNewUser((user) => {
  if (user && user.services && user.services.facebook) {
    throw new Meteor.Error(403, "You haven't registered yet. Register first at https://princeton.chat")
  }

  return true
})

export const audience = process.env.AUDIENCE || 'princeton'