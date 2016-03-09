import {createReducer} from '/client/lib/helpers'
import * as Types from '../configs/actionTypes'

export default {
  overideAsideOpen: createReducer(null, {
    [Types.toggleAside]: (state, action) => action.payload
  }),
  activityVisibility: createReducer('all', {
    [Types.setActivityFilter]: (state) => 'all' ? 'mine' : 'all'
  }),
  openReplies: createReducer({}, {
    [Types.openReply]: (state, action) => state.set(action.payload, true),
    [Types.closeReply]: (state, action) => state.delete(action.payload)
  }),
  scrollToMsgId: createReducer(null, {
    [Types.scrollToMsg]: (state, action) => action.payload,
    [Types.clearScrollToMsg]: () => null
  }),
  speakerIsTyping: createReducer(false, {
    [Types.speakerStartTyping]: () => true,
    [Types.speakerStopTyping]: () => false
  })
}
