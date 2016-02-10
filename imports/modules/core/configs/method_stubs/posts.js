import {Posts, Topics, Users} from '/imports/configs/collections'
import {Meteor} from 'meteor/meteor'
import {check} from 'meteor/check'
import UserService from '/imports/libs/user.service'

export default function () {
  Meteor.methods({
    'post/insert' (_id, title, content, topicIds) {
      check(_id, String)
      check(title, String)
      check(content, String)
      check(topicIds, [String])

      const createdAt = new Date()
      const ownerId = UserService.currentUser()._id

      const post = {
        _id, title, content, topicIds, ownerId, createdAt
      }
      Posts.insert(post)
    },

    'topic/follow' (topicId) {
      check(topicId, String)
      const user = UserService.currentUser()
      Users.update(user._id, { $addToSet: {
        followingTopics: topicId
      }})

      Topics.update(topicId, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }})
    },

    'topic/unfollow' (topicId) {
      check(topicId, String)
      const user = UserService.currentUser()
      Users.update(user._id, { $pull: {
        followingTopics: topicId
      }})

      Topics.update(topicId, { $pull: {
        followers: { userId: user._id }
      }})
    },

    'post/follow' (postId) {
      check(postId, String)
      const user = UserService.currentUser()
      Users.update(user._id, { $addToSet: {
        followingPosts: postId
      }})

      Posts.update(postId, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }})
    },

    'post/unfollow' (postId) {
      check(postId, String)
      const user = UserService.currentUser()
      Users.update(user._id, { $pull: {
        followingPosts: postId
      }})

      Posts.update(postId, { $pull: {
        followers: { userId: user._id }
      }})
    }
  })
}
