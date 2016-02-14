import guestLogin from './guest-login'
import inviteLogin from './invite-login'
import coreAndOnboarding from './core-and-onboarding'

export default function (context) {
  const {Accounts} = context
  
  // Other methods
  coreAndOnboarding()

  // Login related
  guestLogin()
  inviteLogin()
  Accounts.validateNewUser((user) => {
    if (user && user.services && user.services.facebook) {
      throw new Meteor.Error(403, "You haven't registered yet. Register first at https://princeton.chat")
    }

    return true
  })
}