import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { Users, Invites } from '/lib/collections'
import OnboardManager from '/server/lib/OnboardManager'

export default function () {
  class AdminUserService {
     static get () {
       const user = Meteor.user()
       if (!user) {
         throw new Meteor.Error(401, 'Unauthorized - User not logged in')
       }
       if (!user.topicAdmins || user.topicAdmins.indexOf('global') < 0) {
         throw new Meteor.Error(401, 'Unauthorized - Must be admin')
       }

       return user
     }
  }

  Meteor.methods({
    'admin/user/invite': (inviteId) => {
      check(inviteId, String)

      // verify admin identity
      AdminUserService.get()

      const invite = Invites.findOne(inviteId)
      if (!invite) {
        throw new Meteor.Error(400, 'Invite not found');
      }

      new OnboardManager().handleManualVerify(invite)
    }
  })
}