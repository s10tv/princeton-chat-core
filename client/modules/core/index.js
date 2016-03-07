import {combineReducers} from 'redux'
import methodStubs from './configs/method_stubs'
import actions from './actions'
import routes from './routes.jsx'
import {formConfig as settingsFormConfig} from './containers/settings.js'
import reducers from './reducers'

export default {
  formConfigs: [settingsFormConfig],
  reducer: combineReducers(reducers),
  routes,
  actions,
  load (context) {
    methodStubs(context)
  }
}
