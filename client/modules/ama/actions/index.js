import {createOnSubmit} from '/client/lib/helpers'
import {AMA_ASK_QUESTION_FORM_NAME, AMA_REPLY_FORM_NAME, AMA_OPEN_REPLY,
  AMA_SCROLL_TO_MSG, AMA_CLEAR_SCROLL_TO_MSG} from '/client/configs/constants'
import {reset} from 'redux-form'

export default {
  amaHeader: {
    navigateBack ({history}) {
      console.error(new Error('Not Implemented Yet'))
      history.pop()
    },
    showMenu ({store}) {},
    fbShare ({Meteor}) {},
    twitterShare ({Meteor}) {}
  },
  amaMessages: {
    askQuestion (context, info) {
      return createOnSubmit('ama/askquestion', ({store}, newMsgId) => {
        store.dispatch(reset(AMA_ASK_QUESTION_FORM_NAME))
        store.dispatch({ type: AMA_SCROLL_TO_MSG, scrollToMsgId: newMsgId })
      })(context, info)
    },
    reply (context, info, {parentMessageId}) {
      return createOnSubmit('ama/reply', ({store}, newMsgId) => {
        store.dispatch(reset(AMA_REPLY_FORM_NAME))
        store.dispatch({ type: AMA_SCROLL_TO_MSG, scrollToMsgId: newMsgId })
      })(context, Object.assign({}, info, {
        parentMessageId
      }))
    },
    clearScrollToMsgId ({ store }) {
      store.dispatch({ type: AMA_CLEAR_SCROLL_TO_MSG })
    },
    openReplyBox ({store}, messageId) {
      return store.dispatch({ type: AMA_OPEN_REPLY, messageId })
    },
    fbShare ({Meteor}, post) {

    },
    upVote ({Meteor, sweetalert}, message) {
      return Meteor.call('ama/upvote', { messageId: message._id }, (err) => {
        if (err) {
          console.error(err)
          return sweetalert({
            title: 'Oops',
            reason: `We're having some trouble adding your upvote to '${message.content}'.`
          })
        }
      })
    }
  },
  amaFeed: {
    toggleFilter ({store}) {
      return store.dispatch({
        type: 'activityVisibility'
      })
    }
  }
}
