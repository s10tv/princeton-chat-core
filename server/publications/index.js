import {isAdmin} from '/lib/admin'

export default function ({ Meteor, Collections, SearchService }) {
  const { Topics, Posts, Users, Messages, Invites, Notifications, AmaPosts,
    AmaActivities, AmaMessages} = Collections

  // guest index
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

  // guest - follow/unfollow
  Meteor.publish('post.single', function (postId) {
    return Posts.find({_id: postId})
  })

  // guest index
  Meteor.publish('topics.mine', function () {
    if (this.userId) {
      return Topics.find({
        'followers.userId': this.userId
      })
    } else {
      this.ready()
    }
  })

  // for admin panel
  Meteor.publish('invites', function () {
    if (this.userId) {
      const user = Users.findOne(this.userId)
      if (isAdmin(user)) {
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
      displayName: 1,
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

  // sidebar
  Meteor.publish('topics', function () {
    return Topics.find()
  })

  // post list
  Meteor.publishComposite('topic', function (topicId) {
    if (this.userId) {
      return {
        find: function () {
          return Topics.find({ _id: topicId })
        },

        children: [
          {
            find: function (topic) {
              return Users.find({
                _id: { $in: topic.followers.map((follower) => follower.userId) }
              })
            }
          }
        ]
      }
    }

    this.ready()
  })

  // post list
  Meteor.publishComposite('posts', function (options) {
    const isMine = options.isMine
    const topicId = options.topicId
    const term = options.term

    return {
      find: function () {
        // TODO: refactor search into its own publication
        if (term != null) {
          return SearchService.searchPosts(term)
        }

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
              {_id: { $in: post.followers.map((user) => user.userId) }}
            ]})
          }
        }
      ]
    }
  })

  // post details
  Meteor.publishComposite('messages', function (postId) {
    return {
      find: function () {
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
              { _id: { $in: todo.followers.map((follower) => follower.userId) } }
            ]})
          }
        }
      ]
    }
  })

  Meteor.publishComposite('inbox', function () {
    return {
      find: function () {
        return Notifications.find({
          ownerId: this.userId,
          status: 'active'
        })
      },

      children: [
        {
          find: function (notification) {
            return Posts.find({ _id: notification.postId })
          },

          children: [
            {
              find: (post) => {
                return Messages.find({postId: post._id})
              },
              children: [
                {
                  find: (message) => {
                    return Users.find({_id: message.ownerId})
                  }
                }
              ]
            },
            {
              find: (post) => {
                return Users.find({_id: post.ownerId})
              }
            }
          ]
        }
      ]
    }
  })

  Meteor.publishComposite('ama', function (amaPostId) {
    if (!amaPostId || !this.userId) {
      return this.ready()
    }

    return {
      find: function () {
        return AmaPosts.find({ _id: amaPostId })
      },
      children: [
        {
          find: function (amaPost) {
            return Users.find({ _id: amaPost.speakerId })
          }
        },
        {
          find: function (amaPost) {
            const participants = amaPost.participants || []
            return Users.find({_id: {$in: participants.map((participant) => participant.userId)}})
          }
        },
        {
          find: function (amaPost) {
            return AmaMessages.find({ amaPostId: amaPost._id })
          },
          children: [
            {
              find: function (amaMessage) {
                return Users.find({ _id: amaMessage.ownerId })
              }
            }
          ]
        },
        {
          find: function () {
            return AmaActivities.find({ amaPostId })
          },

          children: [
            {
              find: function (amaActivity) {
                if (amaActivity.originatorUserId) {
                  return Users.find({_id: amaActivity.originatorUserId})
                }
              }
            },
            {
              find: function (amaActivity) {
                if (amaActivity.amaMessageId) {
                  return AmaMessages.find({_id: amaActivity.amaMessageId})
                }
              }
            }
          ]
        }
      ]
    }
  })

  // search users
  Meteor.publish('directory.search', function (term) {
    if (this.userId) {
      return SearchService.searchUsers(term)
    } else {
      this.ready()
    }
  })
}
