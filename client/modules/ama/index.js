import actions from './actions'
import routes from './routes.jsx'
import {combineReducers} from 'redux'
import reducers from './reducers'
import {askQuestionFormConfig} from './containers/ama.details.js'

export default {
  formConfigs: [askQuestionFormConfig],
  routes,
  actions,
  reducer: combineReducers(reducers),
  load (context) {}
}
