import invariant from 'invariant'
import {combineReducers} from 'redux'
import {createReducer} from 'redux-act'
import actions from '../actions'

export default {
  sidebar: combineReducers({
    open: createReducer({
      [actions.sidebar.toggle]: (state) => !state,
      [actions.sidebar.update]: (state, payload) => {
        invariant(typeof payload === 'boolean', 'SIDEBAR_UPDATE must contain boolean payload')
        return payload
      }
    }, window.innerWidth > 768), // TODO: Is this way of using window legit?
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
