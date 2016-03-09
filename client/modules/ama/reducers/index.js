import * as Types from '../configs/actionTypes'

function activityVisibility (state = 'all', action) {
  switch (action.type) {
    case 'TOGGLE':
      return state === 'all' ? 'mine' : 'all'
    default:
      return state
  }
}

function overideAsideOpen (state = null, action) {
  switch (action.type) {
    case Types.AMA_TOGGLE_ASIDE:
      return action.payload
    default:
      return state
  }
}

function openReplies (state = {}, action) {
  switch (action.type) {
    case Types.AMA_OPEN_REPLY:
      return Object.assign({}, state, {
        [action.messageId]: true
      })
    case Types.AMA_CLOSE_REPLY:
      return Object.assign({}, state, {
        [action.messageId]: undefined
      })
    default:
      return state
  }
}

function scrollToMsgId (state = {}, action) {
  switch (action.type) {
    case Types.AMA_SCROLL_TO_MSG:
      return Object.assign({}, state, {
        scrollToMsgId: action.scrollToMsgId
      })
    case Types.AMA_CLEAR_SCROLL_TO_MSG:
      return Object.assign({}, state, {
        scrollToMsgId: null
      })
    default:
      return state
  }
}

function speakerIsTyping (state = false, action) {
  switch (action.type) {
    case Types.SPEAKER_START_TYPING:
      return true
    case Types.SPEAKER_STOP_TYPING:
      return false
    default:
      return state
  }
}

export default {
  overideAsideOpen,
  activityVisibility,
  openReplies,
  scrollToMsgId,
  speakerIsTyping
}
