export default function ({Meteor, OnboardManager, Collections}) {
  const {AmaMessages} = Collections

  Meteor.methods({
    'ama/askquestion' ({ content, amaPostId }) {
      AmaMessages.insert({
        amaPostId,
        content,
        childrenMessageIds: [],
        numUpvotes: 0
      })
    },

    'ama/reply' ({ content, amaPostId, parentMessageId }) {
      AmaMessages.insert({
        amaPostId,
        content,
        parentMessageId,
        numUpvotes: 0,
        childrenMessageIds: []
      })
    }
  })
}
