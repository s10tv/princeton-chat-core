import actions from './actions'
import routes from './routes.jsx'
import {combineReducers} from 'redux'
import reducers from './reducers'
import {askQuestionFormConfig} from './containers/ama.details.js'
import {replyFormConfig} from './containers/ama.message.js'

export default {
  formConfigs: [askQuestionFormConfig, replyFormConfig],
  routes,
  actions,
  reducer: combineReducers(reducers),
  load (context) {}
}
