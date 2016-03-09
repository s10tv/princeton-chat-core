import {combineReducers} from 'redux'
import {createReducer} from 'redux-act'
import {CALCULATE_RESPONSIVE_STATE, responsiveStateReducer} from 'redux-responsive'
import {createReducerWithOptions} from '/client/lib/helpers'
import actions from '../actions'

export default {
  sidebar: combineReducers({
    open: createReducerWithOptions({
      [CALCULATE_RESPONSIVE_STATE]: (state, action) => {
        const browser = responsiveStateReducer(undefined, action)
        return browser.greaterThan.small
      },
      [actions.sidebar.toggle]: (state) => !state,
      [actions.sidebar.open]: () => true,
      [actions.sidebar.close]: () => false,
      [actions.sidebar.onRequestChange]: (state) => state
    }, false, {payload: false}),
    menuOpen: createReducer({
      [actions.sidebar.toggleMenu]: (state) => !state
    }, false)
  }),
  // Reducer that sets the default topic values of a new topic dropdown.
  newPostTopics (state = '', action) {
    switch (action.type) {
      case 'ADD_POST_TOPICS':
        return action.topics
      default:
        return state
    }
  },

  // mention suggestions
  mentions (state = {}, action) {
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
  },

  currentlyMentionedUsernames (state = [], action) {
    switch (action.type) {
      case 'REPLACE_CURRENLY_MENTIONED':
        return action.currentlyMentioned
      default:
        return state
    }
  },

  followers (state = [], action) {
    switch (action.type) {
      case 'UPDATE_FOLLOWERS':
        return action.followers
      case 'UPDATE_MENTION_FOLLOWERS':
        return state.filter((follower) => (follower.isMention === undefined))
        .concat(action.mentions.map((mentionUser) => Object.assign({
          isMention: true
        }, mentionUser)))
      default:
        return state
    }
  }
}
