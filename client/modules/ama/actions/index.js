import {createOnSubmit} from '/client/lib/helpers'
import {AMA_ASK_QUESTION_FORM_NAME, AMA_REPLY_FORM_NAME, AMA_OPEN_REPLY,
  AMA_SCROLL_TO_MSG, AMA_CLEAR_SCROLL_TO_MSG, SPEAKER_START_TYPING,
  SPEAKER_STOP_TYPING} from '/client/configs/constants'
import {reset} from 'redux-form'

var intervalId = null

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
    onSpeakerType ({Meteor}, {post}) {
      return (dispatch, getState) => {
        if (post.speakerId === Meteor.userId()) {
          const startTypingPromise = getState().ama.speakerIsTyping
            ? Promise.resolve(true)
            : new Promise((resolve, reject) => {
              dispatch({ type: SPEAKER_START_TYPING })
              Meteor.call('ama/speaker/typing', {amaPostId: post._id}, (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
              })
            })

          return startTypingPromise.then(() => {
            clearInterval(intervalId)
            intervalId = setInterval(() => {
              // if this lasts 10 sec without being cleared, that means the user stopped
              // typing for 10s.
              Meteor.call('ama/speaker/clear', {amaPostId: post._id}, (err, res) => {
                if (err) { console.log(err) }
                return dispatch({ type: SPEAKER_STOP_TYPING })
              })
            }, 3000)
          })
        }
      }
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
