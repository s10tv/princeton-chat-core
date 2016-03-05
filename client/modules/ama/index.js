import actions from './actions'
import routes from './routes.jsx'
import {combineReducers} from 'redux'
import reducers from './reducers'

export default {
  routes,
  actions,
  reducer: combineReducers(reducers),
  load (context) {}
}
