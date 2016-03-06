import invariant from 'invariant'

export default {
  // TODO: Is this way of using window legit?
  sidebar (state = window.innerWidth > 768, action) {
    switch (action.type) {
      case 'SIDEBAR_TOGGLE':
        return !state
      case 'SIDEBAR_UPDATE':
        invariant(action.open != null, 'SIDEBAR_UPDATE must contain open')
        return action.open
      default:
        return state
    }
  },
  sidebarMenu (state = false, action) {
    switch (action.type) {
      case 'SIDEBAR_MENU_TOGGLE':
        return !state
      default:
        return state
    }
  },
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
