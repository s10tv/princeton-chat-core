import Collections from '../../lib/collections'
import {expect} from 'chai'

const {Topics, Messages, Posts, Users} = Collections

describe('core methods', () => {
  let currentUser, currentUserId

  beforeEach (() => {
    Topics.remove({})
    Posts.remove({})
    Messages.remove({})
    Users.remove({})

    currentUserId = Users.insert({
      _id: 'current-user'
    })
    currentUser = Users.findOne(currentUserId)
    Meteor.user = () => {
      return currentUser
    }
  })

  describe ('post/insert', () => {
    beforeEach(() => {
      Topics.insert({
        _id: 'startup',
        displayName: 'Startups'
      })
    })

    it ('should insert a post into the DB', () => {
      Meteor.call('post/insert', 'post-id', 'post-title', 'post-content',
        ['startup', 'another-topic-that-does-not-exist']
      )
      const post = Posts.findOne('post-id')
      expect(post._id).to.equal('post-id')
      expect(post.ownerId).to.equal(currentUserId)
      expect(post.topicIds).to.deep.equal(['startup'])
      expect(post.followers[0].userId).to.equal(currentUserId)
      expect(post.numMsgs).to.equal(0)
    })
  })

  describe('topics', () => {
    beforeEach(() => {
      Topics.insert({
        _id: 'startup',
        displayName: 'Startups'
      })
    })

    describe ('topic/follow', () => {
      it ('should follow a topic', () => {
        Meteor.call('topic/follow', 'startup')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.followingTopics.length).to.equal(1)

        const [topic] = dbUser.followingTopics
        expect(topic).to.equal('startup')

        const dbTopic = Topics.findOne('startup')
        expect(dbTopic.followers.length).to.equal(1)
        const [follower] = dbTopic.followers

        expect(follower.userId).to.equal(currentUserId)
      })
    })

    describe ('topic/unfollow', () => {
      it ('should unfollow a topic', () => {
        Meteor.call('topic/follow', 'startup')
        Meteor.call('topic/unfollow', 'startup')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.followingTopics.length).to.equal(0)

        const dbTopic = Topics.findOne('startup')
        expect(dbTopic.followers.length).to.equal(0)
      })
    })

    describe ('topic/remove', () => {
      it ('should not allow non-owners to remove the topic', () => {
        try {
          Meteor.call('topic/remove', 'startup')
          fail('should not get pass topic/remove if you are not the owner')
        } catch (err) {
          expect(err).to.exist
        }
      })
      it ('should remove the topic if you are the owner', () => {
        Topics.update('startup', { $set: {
          ownerId: currentUserId
        }})
        Meteor.call('topic/remove', 'startup')
        expect(Topics.find().count()).to.equal(0)
      })
    })

    describe ('topic/create', () => {
      const TOPIC = {
        name: 'freedom',
        description: 'is sweet',
        cover: {
          url: 'http://cover'
        }
      }
      it ('should create a topic', () => {
        Meteor.call('topic/create', TOPIC)

        const topic = Topics.findOne('freedom')
        expect(topic._id).to.equal('freedom')
        expect(topic.displayName).to.equal('Freedom')
        expect(topic.description).to.equal('is sweet')
        expect(topic.numPosts).to.equal(0)
        expect(topic.ownerId).to.equal(currentUserId)
        expect(topic.cover.url).to.equal('http://cover')

        expect(topic.followers.length).to.equal(1)
        expect(topic.followers[0].userId).to.equal(currentUserId)

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.followingTopics.length).to.equal(1)
        expect(dbUser.followingTopics[0]).to.equal('freedom')
      })
    })
  })
})