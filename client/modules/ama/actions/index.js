/**
 * global window
 */
import {createOnSubmit, bindContext} from '/client/lib/helpers'
import * as Types from '../configs/actionTypes'
import {AMA_ASK_QUESTION_FORM_NAME, AMA_REPLY_FORM_NAME} from '../configs/formNames'
import {reset} from 'redux-form'

var intervalId = null

export default {
  amaHeader: {
    toggleAside ({store}) {
      const overideAsideOpen = store.getState().ama.overideAsideOpen
      const isMobile = store.getState().browser.lessThan.xl
      const asideOpen = overideAsideOpen !== null ? overideAsideOpen : !isMobile
      store.dispatch(Types.toggleAside(!asideOpen))
    },
    navigateBack ({history}) {
      console.error(new Error('Not Implemented Yet'))
      history.pop()
    },
    showMenu ({store}) {},
    fbShare ({Meteor}, event) {
      event.preventDefault()
      window.open('http://www.facebook.com/sharer.php?src=sp&u=https%3A%2F%2Fprinceton.chat/',
        'newwindow', 'width=600, height=480')
    },
    twitterShare ({Meteor}, event, title) {
      event.preventDefault()
      window.open(`http://twitter.com/intent/tweet?text=Tuning+in+to+@princetonchat+Ask+Me+Anything:+${title}`,
        'newwindow', 'width=600, height=480')
    }
  },
  amaMessages: {
    askQuestion (context, info) {
      return createOnSubmit('ama/askquestion', ({store}, newMsgId) => {
        store.dispatch(reset(AMA_ASK_QUESTION_FORM_NAME))
        store.dispatch(Types.scrollToMsg(newMsgId))
      })(context, info)
    },
    reply (context, info, {parentMessageId}) {
      return createOnSubmit('ama/reply', ({store}, newMsgId) => {
        store.dispatch(reset(AMA_REPLY_FORM_NAME))
        store.dispatch(Types.scrollToMsg(newMsgId))
        store.dispatch(Types.closeReply(parentMessageId))
      })(context, Object.assign({}, info, {
        parentMessageId
      }))
    },
    clearScrollToMsgId: bindContext(Types.clearScrollToMsg),
    openReplyBox ({store}, message) {
      if (store.getState().ama.openReplies.get(message._id) === true) {
        return store.dispatch(Types.closeReply(message._id))
      } else {
        return store.dispatch(Types.openReply(message._id))
      }
    },
    onSpeakerType ({Meteor}, {amaPostId, speaker}) {
      return (dispatch, getState) => {
        if (speaker._id === Meteor.userId()) {
          const startTypingPromise = getState().ama.speakerIsTyping
            ? Promise.resolve(true)
            : new Promise((resolve, reject) => {
              dispatch(Types.speakerStartTyping())
              Meteor.call('ama/speaker/typing', {amaPostId}, (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
              })
            })

          return startTypingPromise.then(() => {
            clearInterval(intervalId)
            intervalId = setInterval(() => {
              // if this lasts 10 sec without being cleared, that means the user stopped
              // typing for 10s.
              Meteor.call('ama/speaker/clear', {amaPostId}, (err, res) => {
                if (err) { console.log(err) }
                return dispatch(Types.speakerStopTyping())
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
    toggleFilter: bindContext(Types.toggleActivityFilter)
  }
}
