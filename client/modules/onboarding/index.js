import actions from './actions'
import routes from './routes.jsx'
import {formConfig as autoVerifyForm} from './containers/home'
import {formConfig as manualVerifyForm} from './containers/invite.request.js'
import {formConfig as signupForm} from './containers/signup'
import {formConfig as inviteFriendsForm} from './containers/invite.friends.js'
import {formConfig as enterNamesForm} from './containers/name.js'

export default {
  formConfigs: [enterNamesForm, autoVerifyForm, manualVerifyForm, signupForm, inviteFriendsForm],
  routes,
  actions,
  load (context) {}
}
