import truncate from 'truncate'

const TRUNCATE_LENGTH = 140

export default function ({Meteor, Logger, OnboardManager, Collections, currentUser}) {
  const {Users, AmaPosts, AmaMessages, AmaActivities} = Collections

  Meteor.methods({
    'ama/askquestion' (info) {
      Logger.log({level: 'info', method: 'ama/askquestion', info})
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
      return amaMessageId
    },

    'ama/reply' ({ content, amaPostId, parentMessageId }) {
      Logger.log({level: 'info', method: 'ama/reply', content, amaPostId, parentMessageId})
      const user = currentUser()
      const parentMessage = AmaMessages.findOne(parentMessageId)

      const amaMessageId = AmaMessages.insert({
        amaPostId,
        content,
        parentMessageId: parentMessage.parentMessageId
          ? parentMessage.parentMessageId
          : parentMessageId,
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
        title: `${user.firstName} replied to ${parentMessageName} question.`,
        content: truncate(content, TRUNCATE_LENGTH)
      })
      return amaMessageId
    },

    'ama/upvote' ({ messageId }) {
      Logger.log({level: 'info', method: 'ama/upvote', messageId})
      const user = currentUser()
      const message = AmaMessages.findOne(messageId)
      if (!message) {
        throw new Meteor.Error(400, 'The message doesn\'t exist!')
      }

      if (message.upvotedUsers.indexOf(user._id) === -1) {
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
      } else {
        AmaMessages.update(messageId, { $pull: {
          upvotedUsers: user._id
        }})
      }
    },

    'ama/speaker/typing' ({amaPostId}) {
      Logger.log({level: 'info', method: 'ama/speaker/typing', amaPostId})
      const user = currentUser()
      const post = AmaPosts.findOne(amaPostId)

      if (!post) {
        throw new Meteor.Error(400, `Post with id =${amaPostId} not found.`)
      }

      if (post.speakerId !== user._id) {
        throw new Meteor.Error(400, 'Only speakers are allowed to set isTyping.')
      }

      AmaPosts.update(post._id, {$set: {
        speakerIsTyping: true
      }})
    },

    'ama/speaker/clear' ({amaPostId}) {
      Logger.log({level: 'info', method: 'ama/speaker/clear', amaPostId})
      const user = currentUser()
      const post = AmaPosts.findOne(amaPostId)

      if (!post) {
        throw new Meteor.Error(400, `Post with id =${amaPostId} not found.`)
      }

      if (post.speakerId !== user._id) {
        throw new Meteor.Error(400, 'Only speakers are allowed to clear isTyping.')
      }

      AmaPosts.update(post._id, {$set: {
        speakerIsTyping: false
      }})
    }
  })
}
