import {createReducer} from 'redux-immutablejs'
import * as Types from '../configs/actionTypes'

export default {
  overideAsideOpen: createReducer(null, {
    [Types.toggleAside]: (state, action) => action.payload
  }, false),
  activityVisibility: createReducer('all', {
    [Types.setActivityFilter]: (state) => 'all' ? 'mine' : 'all'
  }, false),
  openReplies: createReducer({}, {
    [Types.openReply]: (state, action) => state.set(action.payload, true),
    [Types.closeReply]: (state, action) => state.delete(action.payload)
  }),
  scrollToMsgId: createReducer(null, {
    [Types.scrollToMsg]: (state, action) => action.payload,
    [Types.clearScrollToMsg]: () => null
  }, false),
  speakerIsTyping: createReducer(false, {
    [Types.speakerStartTyping]: () => true,
    [Types.speakerStopTyping]: () => false
  }, false)
}
