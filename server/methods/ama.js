export default function ({Meteor, OnboardManager, Collections, currentUser}) {
  const {AmaMessages} = Collections

  Meteor.methods({
    'ama/askquestion' (info) {
      console.log(info)
      const user = currentUser()
      const { content, amaPostId } = info
      AmaMessages.insert({
        amaPostId,
        content,
        ownerId: user._id,
        childrenMessageIds: [],
        numUpvotes: 0
      })
    },

    'ama/reply' ({ content, amaPostId, parentMessageId }) {
      const user = currentUser()
      AmaMessages.insert({
        amaPostId,
        content,
        parentMessageId,
        ownerId: user._id,
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
