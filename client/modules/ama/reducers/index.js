function activityVisibility (state = 'all', action) {
  switch (action.type) {
    case 'TOGGLE':
      return state === 'all' ? 'mine' : 'all'
    default:
      return state
  }
}

function replyingToPostId (state = '', action) {
  switch (action.type) {
    case 'AMA_REPLY':
      return action.replyingToPostId
    case 'AMA_REPLIED':
      return ''
    default:
      return state
  }
}

export default {
  activityVisibility,
  replyingToPostId
}
