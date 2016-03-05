export default function ({Meteor, OnboardManager, Collections, currentUser}) {
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
    },

    'ama/upvote' ({ messageId }) {
      const user = currentUser()
      const message = AmaMessages.findOne(messageId)
      if (!message) {
        throw new Meteor.Error(400, 'The message doesn\'t exist!')
      }

      AmaMessages.update(messageId, { $addToSet: {
        upvotedUsers: user._id
      }})
    }
  })
}
