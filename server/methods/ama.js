import truncate from 'truncate'

const TRUNCATE_LENGTH = 140

export default function ({Meteor, Logger, OnboardManager, Collections, currentUser}) {
  const {Users, AmaMessages, AmaActivities} = Collections

  Meteor.methods({
    'ama/askquestion' (info) {
      const user = currentUser()
      const { content, amaPostId } = info
      const amaMessageId = AmaMessages.insert({
        amaPostId,
        content,
        ownerId: user._id,
        childrenMessageIds: [],
        upvotedUsers: []
      })

      AmaActivities.insert({
        amaPostId,
        amaMessageId,
        originatorUserId: user._id,
        title: `${user.firstName} asked a question.`,
        content: truncate(content, TRUNCATE_LENGTH)
      })
    },

    'ama/reply' ({ content, amaPostId, parentMessageId }) {
      const user = currentUser()
      const parentMessage = AmaMessages.findOne(parentMessageId)

      const amaMessageId = AmaMessages.insert({
        amaPostId,
        content,
        parentMessageId,
        ownerId: user._id,
        childrenMessageIds: [],
        upvotedUsers: []
      })

      if (!parentMessage) {
        Logger.log({level: 'info', method: 'ama/reply', message: 'No parentMessageId was found'})
        return
      }

      const parentMessageUser = Users.findOne(parentMessage.ownerId)
      if (!parentMessageUser) {
        Logger.log({level: 'info', method: 'ama/reply',
          message: `Parent message ${parentMessageId} has no owner`})
        return
      }

      const parentMessageName = parentMessageUser._id === user._id ? 'their own'
        : `${parentMessageUser.firstName}'s'`

      AmaActivities.insert({
        amaPostId,
        amaMessageId,
        originatorUserId: user._id,
        title: `${user.firstName} replied to ${parentMessageName} post.`,
        content: truncate(content, TRUNCATE_LENGTH)
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

      const messageType = message.parentMessageId === undefined ? 'question' : 'reply'

      AmaActivities.insert({
        amaPostId: message.amaPostId,
        amaMessageId: message._id,
        originatorUserId: user._id,
        title: `${user.firstName} upvoted a ${messageType}.`,
        content: truncate(message.content, TRUNCATE_LENGTH)
      })
    }
  })
}
