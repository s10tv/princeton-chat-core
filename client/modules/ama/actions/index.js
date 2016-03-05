import {createOnSubmit} from '/client/lib/helpers'

export default {
  navigateBack ({FlowRouter}) {},
  showMenu ({store}) {},
  fbShare ({Meteor}) {},
  twitterShare ({Meteor}) {},

  messages: {
    askQuestion (context, info) {
      const {FlowRouter} = context
      return createOnSubmit('ama/askquestion')(context, Object.assign({}, info, {
        postId: FlowRouter.current().params.amaPostId
      }))
    },
    reply (context, info) {
      const {FlowRouter, store} = context
      return createOnSubmit('ama/reply')(context, Object.assign({}, info, {
        postId: FlowRouter.current().params.amaPostId,
        parentMessageId: store.getState().ama.replyingToPostId
      }))
    },
    fbShare ({Meteor}, post) {

    },
    upVote ({Meteor}, post) {

    }
  },
  feed: {
    toggleFilter ({store}, newFilter) {

    }
  }
}
