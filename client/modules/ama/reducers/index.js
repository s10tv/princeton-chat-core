import {AMA_OPEN_REPLY, AMA_CLOSE_REPLY,
  AMA_SCROLL_TO_MSG, AMA_CLEAR_SCROLL_TO_MSG} from '/client/configs/constants'

function activityVisibility (state = 'all', action) {
  switch (action.type) {
    case 'TOGGLE':
      return state === 'all' ? 'mine' : 'all'
    default:
      return state
  }
}

function openReplies (state = {}, action) {
  switch (action.type) {
    case AMA_OPEN_REPLY:
      return Object.assign({}, state, {
        [action.messageId]: true
      })
    case AMA_CLOSE_REPLY:
      return Object.assign({}, state, {
        [action.messageId]: undefined
      })
    default:
      return state
  }
}

function scrollToMsgId (state = {}, action) {
  switch (action.type) {
    case AMA_SCROLL_TO_MSG:
      return Object.assign({}, state, {
        scrollToMsgId: action.scrollToMsgId
      })
    case AMA_CLEAR_SCROLL_TO_MSG:
      return Object.assign({}, state, {
        scrollToMsgId: null
      })
    default:
      return state
  }
}

export default {
  activityVisibility,
  openReplies,
  scrollToMsgId
}
