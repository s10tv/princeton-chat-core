import guestLogin from './guest-login'
import inviteLogin from './invite-login'
import core from './core'
import onboarding from './onboarding'
import admin from './admin'

export default function (context) {
  const {Accounts} = context

  // for administering (invites, etc)
  admin(context)

  core(context)

  onboarding(context)

  // Login related
  guestLogin(context)
  inviteLogin(context)

  Accounts.validateNewUser((user) => {
    if (user && user.services && user.services.facebook) {
      throw new Meteor.Error(403, "You haven't registered yet. Register first at https://princeton.chat")
    }

    return true
  })
}
