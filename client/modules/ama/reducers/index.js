import {AMA_OPEN_REPLY, AMA_CLOSE_REPLY} from '/client/configs/constants'

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

export default {
  activityVisibility,
  openReplies
}
