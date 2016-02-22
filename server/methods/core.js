/*global IronMQ */
import {_} from 'underscore'
import NewTopicService from '../../lib/newtopic.service.js' // TODO: replace with validator

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default function (context) {
  const {audience, currentUser, Meteor, Collections, PostManager, TopicManager, SearchService, check,
    AvatarService, Accounts } = context
  const {Topics, Posts, Messages, Users} = Collections

  Meteor.methods({
    'post/insert': (_id, title, content, topicIds) => {
      check(_id, String)
      check(title, String)
      check(content, String)
      check(topicIds, [String])

      const user = currentUser()

      try {
        title = title.trim()
        content = content.trim()
      } catch (e) {
        throw new Meteor.Error(400, 'Every post needs to have a title and content.')
      }

      if (title.length === 0 || content.length === 0) {
        throw new Meteor.Error(400, 'Every post needs to have a title and content.')
      }

      // make sure that the topic ids entered are legit
      const filteredTopicIds = topicIds.filter((topicId) => {
        return Topics.findOne(topicId) !== undefined
      })

      if (filteredTopicIds.length === 0) {
        throw new Meteor.Error(400, 'Please enter at least one valid topicId.')
      }

      // We are good to insert the post.
      const postId = Posts.insert({
        _id,
        title,
        content,
        ownerId: user._id,
        topicIds: filteredTopicIds,
        followers: [{
          userId: user._id,
          unreadCount: 0
        }],
        numMsgs: 0
      })

      // The current user follows the current post they just posted
      Meteor.call('post/follow', postId)

      // update the num posts after posting.
      filteredTopicIds.forEach((topicId) => {
        Topics.update(topicId, { $set: {
          numPosts: Posts.find({isDM: { $ne: true }, topicIds: topicId}).count()
        }})
      })

      if (process.env.IRON_MQ_TOKEN && process.env.IRON_MQ_PROJECT_ID) {
        new IronMQ('web-post').send({
          payload: { postId }
        })
      }
    },

    'topic/follow': (topicId) => {
      check(topicId, String)
      check(currentUser(), Object)

      try {
        TopicManager.follow({topicId, user: currentUser()})
      } catch (err) {
        console.error(err)
        throw new Meteor.Error(500, 'There was a problem with subscribing to this channel.')
      }
    },

    'topic/unfollow': (topicId) => {
      check(topicId, String)
      check(currentUser(), Object)

      try {
        TopicManager.unfollow({topicId, user: currentUser()})
      } catch (err) {
        console.error(err)
        throw new Meteor.Error(500, 'There was a problem with unsubscribing to this channel.')
      }
    },

    'topic/removeFollower': (topicId, userId) => {
      check(topicId, String)
      check(userId, String)
      check(currentUser(), Object)

      try {
        TopicManager.unfollow({topicId, user: {_id: userId}})
      } catch (err) {
        console.error(err)
        throw new Meteor.Error(500, 'There was a problem removing follower.')
      }
    },

    'topic/remove': (topicId) => {
      check(topicId, String)
      const user = currentUser()
      const topic = Topics.findOne(topicId)

      if (!topic) {
        throw new Meteor.Error(400, 'Seems like you are trying to remove an invalid topic')
      }

      if (topic.ownerId !== user._id) {
        throw new Meteor.Error(400, 'You are not authorized to remove a topic that you do not own')
      }

      TopicManager.remove({ topicId, user })
    },

    'topic/create': (topicInfo) => {
      check(topicInfo, Object)
      const user = currentUser()

      if (!topicInfo.name) {
        throw new Meteor.Error(400, 'The topic needs to have a name.')
      }

      if (!topicInfo.description) {
        throw new Meteor.Error(400, 'The topic needs to have a description.')
      }

      if (!topicInfo.cover && !topicInfo.cover.url) {
        throw new Meteor.Error(400, 'The topic needs to have a cover photo.')
      }

      const topicNameError = NewTopicService.validateTopicName(topicInfo.name)
      if (topicNameError.reason) {
        throw new Meteor.Error(400, 'The topic name you entered has an error. Please check.')
      }

      const topicDescriptionError = NewTopicService.validateTopicDescription(topicInfo.description)
      if (topicDescriptionError.reason) {
        throw new Meteor.Error(400, 'The topic description you entered has an error. Please check.')
      }

      const topicId = topicInfo.name.toLowerCase()
      if (Topics.findOne(topicId)) {
        throw new Meteor.Error(400, `Topic "${topicInfo.name}" already exists.`)
      }

      Topics.insert({
        _id: topicId,
        displayName: capitalizeFirstLetter(topicInfo.name),
        description: topicInfo.description,
        followers: [],
        numPosts: 0,
        ownerId: user._id,
        cover: {
          url: topicInfo.cover.url
        }
      })

      Meteor.call('topic/follow', topicId)
      return topicId
    },

    'topics/users/import': (topicId, userInfos) => {
      check(topicId, String)
      check(userInfos, [Object])

      const topic = Topics.findOne(topicId)
      if (!topic) {
        throw new Meteor.Error(400, `Invalid topicId: ${topicId}.`)
      }

      var re = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const filteredUserInfos = userInfos.filter((userInfo) => re.test(userInfo.email))

      const groupedUserInfos = _.groupBy(filteredUserInfos, (userInfo) => userInfo.email)
      var hasDuplicateEmails = false
      _.each(groupedUserInfos, (userInfosArr, key) => {
        if (userInfosArr.length > 1) {
          hasDuplicateEmails = key
        }
      })

      if (hasDuplicateEmails) {
        throw new Meteor.Error(500, `You typed the same email ${hasDuplicateEmails} more than once, please check.`)
      }

      try {
        filteredUserInfos.forEach((userInfo) => {
          const email = userInfo.email
          const firstName = userInfo.firstName || ''
          const lastName = userInfo.lastName || ''
          let existingUser = Accounts.findUserByEmail(email)
          if (!existingUser) {
            let newUserId = Accounts.createUser({ email, password: email, profile: {} })

            Users.update(newUserId, { $set: {
              firstName,
              lastName,
              avatar: {
                url: AvatarService.generateDefaultAvatarForAudience(audience),
                isDefaultAvatar: true,
                color: AvatarService.generateRandomColorForDefaultAvatar()
              },
              isFullMember: false
            }})

            existingUser = Users.findOne(newUserId)
          }

          TopicManager.follow({ topicId, user: existingUser })
        })
      } catch (e) {
        console.log(e)
        throw new Meteor.Error(500, "Sorry, we messed up. We couldn't add your followers, but we tried very hard :/")
      }
    },

    'post/follow': (postId) => {
      check(postId, String)
      PostManager.follow({postId, user: currentUser()})
    },

    'post/unfollow': (postId) => {
      check(postId, String)
      PostManager.unfollow({postId, user: currentUser()})
    },

    'post/delete': (postId) => {
      check(postId, String)
      return PostManager.delete({postId, user: currentUser()})
    },

    'messages/insert': (_id, postId, commentText) => {
      check(_id, String)
      check(postId, String)
      check(commentText, String)

      const user = currentUser()
      Messages.insert({
        _id,
        postId,
        content: commentText,
        ownerId: user._id
      })

      if (process.env.IRON_MQ_TOKEN && process.env.IRON_MQ_PROJECT_ID) {
        new IronMQ('web-message').send({
          payload: { messageId: _id }
        })
      }

      Posts.update(postId, {$inc: { numMsgs: 1 }})
    },

    'messages/delete': (_id) => {
      check(_id, String)

      const user = currentUser()
      const message = Messages.findOne(_id)
      if (message.ownerId !== user._id) {
        throw new Meteor.Error('You can only delete your own messages')
      }
      Messages.remove({_id: _id})
    },

    'get/followers': (userIds) => {
      check(userIds, Array)
      check(currentUser(), Object)

      return userIds.map((user) => {
        return Users.findOne(user.userId)
      }).filter((user) => user !== undefined)
    },

    'search/username': (username) => {
      check(username, String)
      return Users.find({ username: { $regex: new RegExp(`^${username}`, 'i') } }, {limit: 3}).fetch()
    },

    'search/users': (input) => {
      check(input, String)
      console.log(input)
      currentUser()

      return SearchService.searchUsers(input)
    },

    'search/posts': (input) => {
      check(input, String)
      console.log(input)
      currentUser()

      return SearchService.searchPosts(input)
    }
  })
}
