import guestLogin from './guest-login'
import inviteLogin from './invite-login'
import coreAndOnboarding from './core-and-onboarding'

export default function () {
  coreAndOnboarding()
  guestLogin()
  inviteLogin()
}
