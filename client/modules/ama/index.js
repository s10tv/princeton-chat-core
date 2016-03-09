import actions from './actions'
import methodStubs from './configs/method_stubs'
import routes from './routes.jsx'
import {combineReducers} from 'redux'
import reducers from './reducers'
import {inputBoxFormConfig} from './containers/ama.avatarinputbox.js'

export default {
  formConfigs: [inputBoxFormConfig],
  routes,
  actions,
  reducer: combineReducers(reducers),
  load (context) {
    methodStubs(context)
  }
}
