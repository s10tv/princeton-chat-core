import { Meteor } from 'meteor/meteor'
import { Match, check } from 'meteor/check'
import { _ } from 'meteor/underscore'
import { Topics, Posts, Users, Messages, Invites } from '/lib/collections'

export default function () {
  Meteor.publish('posts.mine', function () {
    if (this.userId) {
      return Posts.find({
        'followers.userId': this.userId,
        isDM: false
      })
    } else {
      this.ready()
    }
  })
  Meteor.publish('topics.mine', function () {
    if (this.userId) {
      return Topics.find({
        'followers.userId': this.userId
      })
    } else {
      this.ready()
    }
  })

  Meteor.publish('topics', function () {
    return Topics.find()
  })

  Meteor.publish('invites', function() {
    if (this.userId) {
      const user = Users.findOne(this.userId)
      if (user.topicAdmins && user.topicAdmins.indexOf('global') >= 0) {
        return Invites.find()
      }
    }

    this.ready()
  })

  Meteor.publish('userData', function () {
    return Meteor.users.find({_id: this.userId}, { fields: {
      firstName: 1,
      lastName: 1,
      username: 1,
      avatar: 1,
      inviteCode: 1,
      emailPreference: 1,
      classYear: 1,
      classType: 1,
      info: 1,
      status: 1,
      followingTopics: 1,
      followingPosts: 1,
      topicAdmins: 1,
      'services.facebook.id': 1,
      'services.facebook.name': 1
    }})
  })

  Meteor.publishComposite('topic', function (topicId) {
    check(topicId, Match.OneOf(null, String))

    if (this.userId) {
      return {
        find: function () {
          return Topics.find({ _id: topicId })
        },

        children: [
          {
            find: function (topic) {
              return Users.find({
                _id: { $in: topic.followers.map(follower => follower.userId) }
              })
            }
          }
        ]
      }
    }

    this.ready()
  })

  Meteor.publishComposite('posts', function (topicId, isMine) {
    check(topicId, Match.OneOf(null, String))
    check(isMine, Match.OneOf(null, Boolean))

    return {
      find: function () {
        var options = {}
        options.isDM = { $ne: true } // don't get the direct messages

        if (isMine) {
          const user = Users.findOne(this.userId)
          if (user) {
            options['$or'] = [
              { _id: {$in: user.followingPosts} },
              { ownerId: this.userId },
              { topicIds: {$in: user.followingTopics} }
            ]
          }
        }

        if (topicId != null) {
          options.topicIds = topicId
        }

        return Posts.find(options)
      },

      children: [
        {
          find: function (post) {
            return Users.find({ $or: [
              {_id: post.ownerId},
              {_id: { $in: post.followers.map(user => user.userId) }}
            ]})
          }
        }
      ]
    }
  })

  Meteor.publishComposite('messages', function (postId) {
    return {
      find: function () {
        check(postId, Match.Optional(String))
        return Posts.find({ _id: postId })
      },
      children: [
        {
          find: function (todo) {
            return Messages.find({ postId: postId })
          },

          children: [
            {
              find: function (comment) {
                return Users.find({ _id: comment.ownerId })
              }
            }
          ]
        },

        {
          find: function (todo) {
            return Users.find({ $or: [
              { _id: todo.ownerId },
              { _id: { $in: todo.followers.map(follower => follower.userId) } }
            ]})
          }
        }
      ]
    }
  })

  Meteor.publishComposite('directMessages', function () {
    const myUserId = this.userId
    if (myUserId) {
      return {
        find: function () {
          return Posts.find({
            isDM: true,
            'followers.userId': myUserId
          })
        },

        children: [
          {
            find: function (post) {
              const otherUserIds = _.reject(post.followers, function (follower) {
                return follower.userId === myUserId
              }).map(user => user.userId)

              return Users.find({ _id: { $in: otherUserIds } })
            }
          }
        ]
      }
    } else {
      this.ready()
    }
  })

  Meteor.publish('onboardingMessages', function () {
    if (this.userId) {
      const user = Users.findOne(this.userId)
      return [
        Users.find({_id: 'system'}),
        Posts.find({_id: user.tigerbotPostId}),
        Messages.find({postId: user.tigerbotPostId})
      ]
    } else {
      this.ready()
    }
  })
}
