/*global
  describe, beforeEach, Meteor, it
*/
import Collections from '../../../lib/collections'
import chai, {expect} from 'chai'
import chaiTime from 'chai-datetime'

chai.use(chaiTime)

const {Users, AmaMessages, AmaActivities, Notifications} = Collections

describe('ama methods', () => {
  let currentUser, currentUserId

  beforeEach(() => {
    AmaMessages.remove({})
    AmaActivities.remove({})
    Users.remove({})
    Notifications.remove({})

    currentUserId = Users.insert({
      _id: 'current-user',
      firstName: 'Starbucks'
    })
    currentUser = Users.findOne(currentUserId)
    Meteor.user = () => {
      return currentUser
    }
  })

  describe('ama/askquestion', () => {
    it('should insert a message and activity', () => {
      Meteor.call('ama/askquestion', {content: 'heya', amaPostId: 'post-id'})
      expect(AmaMessages.find().count()).to.equal(1)

      const [message] = AmaMessages.find().fetch()
      expect(message.amaPostId).to.equal('post-id')
      expect(message.content).to.equal('heya')
      expect(message.ownerId).to.equal(currentUserId)
      expect(message.childrenMessageIds).to.deep.equal([])
      expect(message.upvotedUsers).to.deep.equal([])

      expect(AmaActivities.find().count()).to.equal(1)
      const [activity] = AmaActivities.find().fetch()
      expect(activity.amaPostId).to.equal('post-id')
      expect(activity.amaMessageId).to.equal(message._id)
      expect(activity.originatorUserId).to.equal(currentUserId)
      expect(activity.title).to.equal('Starbucks asked a question.')
      expect(activity.content).to.equal('heya')
    })
  })

  describe('ama/reply', () => {
    let messageId
    beforeEach(() => {
      messageId = AmaMessages.insert({
        amaPostId: 'post-id',
        content: 'parent-message-content',
        ownerId: currentUserId,
        childrenMessageIds: [],
        upvotedUsers: []
      })
    })

    it('should insert a reply and activity', () => {
      Meteor.call('ama/reply', {
        content: 'message',
        amaPostId: 'post-id',
        parentMessageId: messageId
      })

      expect(AmaMessages.find().count()).to.equal(2)

      const message = AmaMessages.findOne({ parentMessageId: messageId })
      expect(message.amaPostId).to.equal('post-id')
      expect(message.content).to.equal('message')
      expect(message.ownerId).to.equal(currentUserId)
      expect(message.childrenMessageIds).to.deep.equal([])
      expect(message.upvotedUsers).to.deep.equal([])

      expect(AmaActivities.find().count()).to.equal(1)
      const [activity] = AmaActivities.find().fetch()
      expect(activity.amaPostId).to.equal('post-id')
      expect(activity.amaMessageId).to.equal(message._id)
      expect(activity.originatorUserId).to.equal(currentUserId)
      expect(activity.title).to.equal('Starbucks replied to their own question.')
      expect(activity.content).to.equal('message')
    })
  })

  describe('ama/upvote', () => {
    let messageId
    beforeEach(() => {
      messageId = AmaMessages.insert({
        amaPostId: 'post-id',
        content: 'content',
        ownerId: currentUserId,
        childrenMessageIds: [],
        upvotedUsers: []
      })
    })

    it('should upvote a message and insert an activity', () => {
      Meteor.call('ama/upvote', { messageId })
      const message = AmaMessages.findOne(messageId)
      expect(message.upvotedUsers).to.deep.equal([currentUserId])

      expect(AmaActivities.find().count()).to.equal(1)
      const [activity] = AmaActivities.find().fetch()
      expect(activity.amaPostId).to.equal('post-id')
      expect(activity.amaMessageId).to.equal(message._id)
      expect(activity.originatorUserId).to.equal(currentUserId)
      expect(activity.title).to.equal('Starbucks upvoted a question.')
      expect(activity.content).to.equal('content')
    })
  })
})
