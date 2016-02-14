import actions from './actions'
import routes from './routes.jsx'
import {formConfig as homeForm} from './containers/home'
import {formConfig as requestInviteForm} from './containers/invite.request'
import {formConfig as inviteFriendsForm} from './containers/invite.friends'
import {formConfig as signupForm} from './containers/signup'

export default {
  formConfigs: [homeForm, requestInviteForm, inviteFriendsForm, signupForm],
  routes,
  actions,
  load (context) {}
}
