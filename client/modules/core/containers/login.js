import Login from '/client/modules/core/components/login.jsx'
import {composeAll, useDeps} from 'mantra-core'

const depsMapper = (context, actions) => ({
  loginWithPassword: actions.login.loginWithPassword,
  loginWithFacebook: actions.login.loginWithFacebook,
  context: () => context
})

export default composeAll(
  useDeps(depsMapper)
)(Login)
