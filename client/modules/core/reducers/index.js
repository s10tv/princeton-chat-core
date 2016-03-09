import {createReducer} from 'redux-immutablejs'
import {CALCULATE_RESPONSIVE_STATE, responsiveStateReducer} from 'redux-responsive'
import {LOCATION_CHANGE} from 'react-router-redux'
import actions from '../actions'

export default {
  sidebar: createReducer({docked: false, open: false}, {
    // Adjust sidebar open state based on browser size
    [CALCULATE_RESPONSIVE_STATE]: (state, action) => {
      const browser = responsiveStateReducer(undefined, action)
      const isDesktop = browser.greaterThan.small
      return state.merge({docked: isDesktop, open: isDesktop})
    },
    // Close the sidebar on navigation unless we are docked
    [LOCATION_CHANGE]: (state) => (
      state.get('docked') ? state : state.set('open', false)
    ),
    [actions.sidebar.onRequestChange]: (state, action) => state.set('open', action.payload),
    [actions.sidebar.toggle]: (state) => state.update('open', (v) => !v),
    [actions.sidebar.open.toString()]: (state) => state.set('open', true),
    [actions.sidebar.close.toString()]: (state) => state.set('open', false)
  }),
  sidebarMenuOpen: createReducer(false, {
    [actions.sidebar.toggleMenu]: (state) => !state
  }, false),
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
