import {createOnSubmit} from '/client/lib/helpers'
import {AMA_ASK_QUESTION_FORM_NAME} from '/client/configs/constants'
import {reset} from 'redux-form'

export default {
  amaHeader: {
    navigateBack ({FlowRouter}) {
      console.error(new Error('Not Implemented Yet'))
    },
    showMenu ({store}) {},
    fbShare ({Meteor}) {},
    twitterShare ({Meteor}) {}
  },
  amaMessages: {
    askQuestion (context, info) {
      console.log('calling askQuestion', info)
      const {FlowRouter} = context
      return createOnSubmit('ama/askquestion', ({store}) => {
        return store.dispatch(reset(AMA_ASK_QUESTION_FORM_NAME))
      })(context, Object.assign({}, info, {
        amaPostId: FlowRouter.current().params.amaPostId
      }))
    },
    reply (context, event, info) {
      const {FlowRouter, store} = context
      return createOnSubmit('ama/reply')(context, Object.assign({}, info, {
        amaPostId: FlowRouter.current().params.amaPostId,
        parentMessageId: store.getState().ama.replyingToPostId
      }))
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
