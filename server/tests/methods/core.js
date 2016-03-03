/*global
  describe, beforeEach, Meteor, it, fail
*/
import Collections from '../../../lib/collections'
import {expect} from 'chai'

const {Topics, Messages, Posts, Users, Notifications} = Collections

describe('core methods', () => {
  let currentUser, currentUserId

  beforeEach(() => {
    Topics.remove({})
    Posts.remove({})
    Messages.remove({})
    Users.remove({})
    Notifications.remove({})

    currentUserId = Users.insert({
      _id: 'current-user'
    })
    currentUser = Users.findOne(currentUserId)
    Meteor.user = () => {
      return currentUser
    }
  })

  describe('posts', () => {
    beforeEach(() => {
      Topics.insert({
        _id: 'startup',
        displayName: 'Startups'
      })
      Posts.insert({
        _id: 'uber',
        title: 'Uber is a taxi service',
        content: 'Post content',
        topicIds: ['startup']
      })
    })

    describe('post/insert', () => {
      it('should insert a post into the DB', () => {
        Meteor.call('post/insert', {
          _id: 'post-id',
          title: 'post-title',
          content: 'post-content',
          topicIds: ['startup', 'another-topic-that-does-not-exist']
        })
        const post = Posts.findOne('post-id')
        expect(post._id).to.equal('post-id')
        expect(post.ownerId).to.equal(currentUserId)
        expect(post.topicIds).to.deep.equal(['startup'])
        expect(post.followers[0].userId).to.equal(currentUserId)
        expect(post.numMsgs).to.equal(0)
      })

      describe('posts with mentions', () => {
        beforeEach(() => {
          Users.insert({
            _id: 'mentioned-user-id',
            username: 'mentioneduser'
          })
        })

        it('should generate a notification for this user', () => {
          Meteor.call('post/insert', {
            _id: 'mention-post-id',
            title: 'post-title',
            content: 'a mention to @mentioneduser',
            topicIds: ['startup']
          })

          const notifications = Notifications.find().fetch()
          expect(notifications.length).to.equal(1)

          const [notification] = notifications
          expect(notification.status).to.equal('active')
          expect(notification.reason).to.equal('mention')
          expect(notification.lastActionTimestamp).not.to.exist
          expect(notification.ownerId).to.equal('mentioned-user-id')
          expect(notification.postId).to.equal('mention-post-id')
        })
      })
    })

    describe('post/follow', () => {
      it('should follow a post', () => {
        Meteor.call('post/follow', 'uber')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.followingPosts.length).to.equal(1)

        const [post] = dbUser.followingPosts
        expect(post).to.equal('uber')

        const dbPost = Posts.findOne('uber')
        expect(dbPost.followers.length).to.equal(1)
        expect(dbPost.followers[0].userId).to.equal(currentUserId)

        const [follower] = dbPost.followers
        expect(follower.userId).to.equal(currentUserId)
      })
    })

    describe('post/unfollow', () => {
      it('should unfollow a post', () => {
        Meteor.call('post/follow', 'uber')
        Meteor.call('post/unfollow', 'uber')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.followingTopics.length).to.equal(0)

        const dbPost = Posts.findOne('uber')
        expect(dbPost.followers.length).to.equal(0)
      })
    })

    describe('post/delete', () => {
      it('should not allow non-owners to remove the post', () => {
        try {
          Meteor.call('post/delete', 'uber')
          fail('should not get pass post/delete if you are not the owner')
        } catch (err) {
          expect(err).to.exist
        }
      })
      it('should remove the post if you are the owner', () => {
        Posts.update('uber', { $set: {
          ownerId: currentUserId
        }})
        Meteor.call('post/delete', 'uber')
        expect(Posts.find().count()).to.equal(0)
      })
    })
  })

  describe('topics', () => {
    beforeEach(() => {
      Topics.insert({
        _id: 'startup',
        displayName: 'Startups'
      })
    })

    describe('topic/follow', () => {
      it('should follow a topic', () => {
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

    describe('topic/unfollow', () => {
      it('should unfollow a topic', () => {
        Meteor.call('topic/follow', 'startup')
        Meteor.call('topic/unfollow', 'startup')

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.followingTopics.length).to.equal(0)

        const dbTopic = Topics.findOne('startup')
        expect(dbTopic.followers.length).to.equal(0)
      })
    })

    describe('topic/removeFollower', () => {
      it('should remove follower', () => {
        Meteor.call('topic/follow', 'startup')
        Meteor.call('topic/removeFollower', 'startup', currentUserId)

        const dbUser = Users.findOne(currentUserId)
        expect(dbUser.followingTopics.length).to.equal(0)

        const dbTopic = Topics.findOne('startup')
        expect(dbTopic.followers.length).to.equal(0)
      })
    })

    describe('topic/remove', () => {
      it('should not allow non-owners to remove the topic', () => {
        try {
          Meteor.call('topic/remove', 'startup')
          fail('should not get pass topic/remove if you are not the owner')
        } catch (err) {
          expect(err).to.exist
        }
      })
      it('should remove the topic if you are the owner', () => {
        Topics.update('startup', { $set: {
          ownerId: currentUserId
        }})
        Meteor.call('topic/remove', 'startup')
        expect(Topics.find().count()).to.equal(0)
      })
    })

    describe('topic/create', () => {
      const TOPIC = {
        name: 'freedom',
        description: 'is sweet',
        cover: {
          url: 'http://cover'
        }
      }
      it('should create a topic', () => {
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

    describe('topics/users/import', () => {
      const userA = {
        firstName: 'A-first-name',
        lastName: 'A-last-name',
        email: 'a@a.com'
      }
      const userB = {
        firstName: 'B-first-name',
        lastName: 'B-last-name',
        email: 'b@b.com'
      }
      // User with wrong email
      const userC = {
        firstName: 'C-first-name',
        lastName: 'C-last-name',
        email: 'c@c@.com'
      }
      // User with same email as user A
      const userD = {
        firstName: 'D-first-name',
        lastName: 'D-last-name',
        email: 'a@a.com'
      }
      it('should import users to topic', () => {
        Meteor.call('topics/users/import', 'startup', [userA, userB])

        const dbTopic = Topics.findOne('startup')
        expect(dbTopic.followers.length).to.equal(2)

        var followersFirstNames = dbTopic.followers.map((follower) => {
          const followerId = follower.userId
          const dbUser = Users.findOne(followerId)
          return dbUser.firstName
        })
        var followersLastNames = dbTopic.followers.map((follower) => {
          const followerId = follower.userId
          const dbUser = Users.findOne(followerId)
          return dbUser.lastName
        })
        expect(followersFirstNames.sort()).to.deep.equal([userA.firstName, userB.firstName].sort())
        expect(followersLastNames.sort()).to.deep.equal([userA.lastName, userB.lastName].sort())
      })
      it('should filter users with invalid emails', () => {
        Meteor.call('topics/users/import', 'startup', [userA, userC])

        const dbTopic = Topics.findOne('startup')
        expect(dbTopic.followers.length).to.equal(1)

        const dbUser = Users.findOne(dbTopic.followers[0].userId)
        expect(dbUser.firstName).to.equal(userA.firstName)
        expect(dbUser.lastName).to.equal(userA.lastName)
      })
      it('should detect duplicate emails', () => {
        try {
          Meteor.call('topics/users/import', 'startup', [userA, userD])
          fail('should not import users with non-unique emails')
        } catch (err) {
          expect(err).to.exist
        }
      })
      it('should detect invalid topic', () => {
        try {
          Meteor.call('topics/users/import', 'money', [userA, userB])
          fail('should not import users to non-existent topic')
        } catch (err) {
          expect(err).to.exist
        }
      })
    })
  })

  describe('messages', () => {
    beforeEach(() => {
      Topics.insert({
        _id: 'startup',
        displayName: 'Startups'
      })
      Posts.insert({
        _id: 'uber',
        title: 'Uber is a taxi service',
        content: 'Post content',
        topicIds: ['startup']
      })
      Users.insert({
        _id: 'adilet-id',
        username: 'adilet'
      })
      Users.insert({
        _id: 'john-id',
        username: 'john'
      })
    })

    describe('messages/insert', () => {
      it('should insert a message into the DB', () => {
        Meteor.call('messages/insert', 'message-id', 'uber', 'agree with that')

        const dbMessage = Messages.findOne('message-id')
        expect(dbMessage._id).to.equal('message-id')
        expect(dbMessage.postId).to.equal('uber')
        expect(dbMessage.content).to.equal('agree with that')
        expect(dbMessage.ownerId).to.equal(currentUserId)

        const dbPost = Posts.findOne('uber')
        expect(dbPost.numMsgs).to.equal(1)
      })
      it('should make mentioned users follow the post', () => {
        Meteor.call('messages/insert', 'message-id', 'uber', 'agree with that, @adilet?')

        const dbPost = Posts.findOne('uber')
        expect(dbPost.followers.length).to.equal(1)
        expect(dbPost.followers[0].userId).to.equal('adilet-id')
      })
      it('should make multiple mentioned users follow the post', () => {
        Meteor.call('messages/insert', 'message-id', 'uber',
          'agree with that, @adilet? What about you, @john?'
        )

        const dbPost = Posts.findOne('uber')
        expect(dbPost.followers.length).to.equal(2)

        var followersIds = dbPost.followers.map((follower) => (follower.userId))
        expect(followersIds.sort()).to.deep.equal(['adilet-id', 'john-id'].sort())

        const notifications = Notifications.find().fetch()
        expect(notifications.length).to.equal(2)

        const [adiletNotif, johnNotif] = Notifications.find({}, {sort: {_id: 1}}).fetch()
        expect(adiletNotif.ownerId).to.equal('adilet-id')
        expect(johnNotif.ownerId).to.equal('john-id')
      })
      it('should handle one user mentioned multiple times', () => {
        Meteor.call('messages/insert', 'message-id', 'uber',
          'agree with that, @adilet? What about you, @john? Hey, @john?'
        )

        const dbPost = Posts.findOne('uber')
        expect(dbPost.followers.length).to.equal(2)

        var followersIds = dbPost.followers.map((follower) => (follower.userId))
        expect(followersIds.sort()).to.deep.equal(['adilet-id', 'john-id'].sort())
      })
    })

    describe('messages/delete', () => {
      it('should not allow non-owners to remove the post', () => {
        Meteor.call('messages/insert', 'message-id', 'uber', 'agree with that')
        try {
          Meteor.call('messages/delete', 'message-id')
          fail('should not get pass message/delete if you are not the owner of the message')
        } catch (err) {
          expect(err).to.exist
        }
      })
      it('should remove the post if you are the owner', () => {
        Meteor.call('messages/insert', 'message-id', 'uber', 'agree with that')
        Messages.update('message-id', { $set: {
          ownerId: currentUserId
        }})
        Meteor.call('messages/delete', 'message-id')
        expect(Messages.find().count()).to.equal(0)
      })
    })
  })

  describe('misc', () => {
    beforeEach(() => {
      Users.insert({
        _id: 'adilet-id',
        status: 'active',
        username: 'adilet'
      })
      Users.insert({
        _id: 'john-id',
        status: 'active',
        username: 'john'
      })
    })

    describe('get/followers', () => {
      it('should get followers by both ids and mentions', () => {
        const userViews = Meteor.call('get/followers', {
          followers: [{userId: 'adilet-id'}],
          mentionedUsernames: ['@john', '@jack']
        })
        expect(userViews.length).equal(2)
        var followersUsernames = userViews.map((follower) => (follower.displayUsername.substring(1)))
        expect(followersUsernames.sort()).to.deep.equal(['adilet', 'john'].sort())
      })
      it('should exclude yourself if the option is set', () => {
        const userViews = Meteor.call('get/followers', {
          followers: [{userId: 'adilet-id'}, {userId: currentUserId}],
          mentionedUsernames: [],
          excludeMyself: true
        })
        expect(userViews.length).equal(1)
        expect(userViews[0].displayUsername.substring(1)).equal('adilet')
      })
      it('should NOT exclude yourself if the option is NOT set', () => {
        Users.update(currentUserId, { $set: {
          username: 'currentUsername'
        }})
        const userViews = Meteor.call('get/followers', {
          followers: [{userId: 'adilet-id'}, {userId: currentUserId}],
          mentionedUsernames: [],
          excludeMyself: false
        })
        expect(userViews.length).equal(2)
        var followersUsernames = userViews.map((follower) => (follower.displayUsername.substring(1)))
        expect(followersUsernames.sort()).to.deep.equal(['adilet', 'currentUsername'].sort())
      })
    })

    describe('search/users', () => {
      it('should find right users by username', () => {
        const userViews = Meteor.call('search/users', 'adilet')
        expect(userViews.length).equal(1)
        expect(userViews[0].displayUsername.substring(1)).equal('adilet')
      })

      it('should not find anything if there is no user with such username', () => {
        const userViews = Meteor.call('search/users', 'jack')
        expect(userViews.length).equal(0)
      })
    })
  })
})
