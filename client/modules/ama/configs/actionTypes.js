import {createAction} from '/client/lib/helpers'

export const scrollToMsg = createAction('AMA_SCROLL_TO_MSG')
export const clearScrollToMsg = createAction('AMA_CLEAR_SCROLL_TO_MSG')
export const openReply = createAction('AMA_OPEN_REPLY')
export const closeReply = createAction('AMA_CLOSE_REPLY')
export const speakerStartTyping = createAction('AMA_SPEAKER_START_TYPING')
export const speakerStopTyping = createAction('AMA_SPEAKER_STOP_TYPING')
export const toggleAside = createAction('AMA_TOGGLE_ASIDE')
export const toggleActivityFilter = createAction('AMA_TOGGLE_ACTIVITY_FILTER')
