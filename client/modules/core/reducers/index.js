export default {
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
