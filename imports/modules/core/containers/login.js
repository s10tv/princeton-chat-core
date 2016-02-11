import Login from '/imports/modules/core/components/login.jsx'
import {composeAll, useDeps} from '/client/config/mantra'

const depsMapper = (context, actions) => ({
  loginWithPassword: actions.login.loginWithPassword,
  loginWithFacebook: actions.login.loginWithFacebook,
  context: () => context
})

export default composeAll(
  useDeps(depsMapper)
)(Login)
