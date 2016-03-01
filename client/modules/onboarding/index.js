import {combineReducers} from 'redux'
import actions from './actions'
import routes from './routes.jsx'
import {homeSelector} from './containers/home.js'
import {formConfig as manualVerifyForm} from './containers/invite.request'
import {formConfig as signupForm} from './containers/signup'
import {formConfig as inviteFriendsForm} from './containers/invite.friends'
import {studentFormConfig as studentForm} from './containers/home.form.student.js'
import {facultyFormConfig as facultyForm} from './containers/home.form.faculty.js'

export default {
  formConfigs: [studentForm, facultyForm, manualVerifyForm, signupForm, inviteFriendsForm],
  routes,
  actions,
  reducer: combineReducers({homeSelector}),
  load (context) {}
}
