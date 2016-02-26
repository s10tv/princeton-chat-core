import {combineReducers} from 'redux'
import methodStubs from './configs/method_stubs'
import actions from './actions'
import routes from './routes.jsx'
import {formConfig as settingsFormConfig} from './containers/settings.js'

/**
 * Reducer that sets the default topic values of a new topic dropdown.
 */
function newPostTopics (state = '', action) {
  switch (action.type) {
    case 'ADD_POST_TOPICS':
      return action.topics
    default:
      return state
  }
}

function mentions (state = {}, action) {
  switch (action.type) {
    case 'FETCH_MENTIONS':
      const newEntry = {}
      newEntry[action.field] = action.mentions
      return Object.assign({}, state, newEntry)
    case 'CLEAR_MENTIONS':
      return {}
    default:
      return state
  }
}

export default {
  formConfigs: [settingsFormConfig],
  reducer: combineReducers({
    newPostTopics,
    mentions
  }),
  routes,
  actions,
  load (context) {
    methodStubs(context)
  }
}
