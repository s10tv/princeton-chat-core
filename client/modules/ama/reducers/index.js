import Immutable from 'immutable'
import {createReducer} from '/client/lib/helpers'
import * as Types from '../configs/actionTypes'

export default {
  overideAsideOpen: createReducer(null, {
    [Types.toggleAside]: (state, action) => action.payload
  }),
  activityVisibility: createReducer('all', {
    [Types.toggleActivityFilter]: (state) => 'all' ? 'mine' : 'all'
  }),
  openReplies: createReducer(Immutable.Set(), {
    [Types.openReply]: (state, action) => state.add(action.payload),
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
