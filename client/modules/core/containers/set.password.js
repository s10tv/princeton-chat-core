import SetPassword from '/client/modules/core/components/onboarding/setPassword.jsx'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import UserService from '/lib/user.service.js'

export const composer = ({context}, onData) => {
  const currentUser = UserService.currentUser()
  onData(null, {
    shouldShowPasswordFields: currentUser.status !== 'active'
  })
}

export const depsMapper = (context, actions) => ({
  clickFacebook: actions.onboarding.clickFacebook,
  addPassword: actions.onboarding.addPassword,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SetPassword)
