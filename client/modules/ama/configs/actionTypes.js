import {createAction} from '/client/lib/helpers'

export const scrollToMsg = createAction('AMA_SCROLL_TO_MSG')
export const clearScrollToMsg = createAction('AMA_CLEAR_SCROLL_TO_MSG')
export const AMA_OPEN_REPLY = 'AMA_OPEN_REPLY'
export const AMA_CLOSE_REPLY = 'AMA_CLOSE_REPLY'
export const SPEAKER_START_TYPING = 'SPEAKER_START_TYPING'
export const SPEAKER_STOP_TYPING = 'SPEAKER_STOP_TYPING'

export const AMA_TOGGLE_ASIDE = 'AMA_TOGGLE_ASIDE'
