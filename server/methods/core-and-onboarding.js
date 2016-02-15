import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import { _ } from 'meteor/underscore'

import { Topics, Posts, Users, Messages } from '/lib/collections'
import AvatarService from '/lib/avatar.service.js'
import TopicManager from '/server/lib/TopicManager'
import PostManager from '/server/lib/PostManager'
import OnboardManager from '/server/lib/OnboardManager'
import NewTopicService from '/lib/newtopic.service.js'
import UserService from '/lib/user.service.js'
import {audience} from '../configs/index'

export default function () {
  class CurrentUser {
    static get () {
      const user = Meteor.user()
      if (!user) {
        throw new Meteor.Error(401, 'Unauthorized')
      }
      return user
    }
  }

  Meteor.methods({
    // returns invite code
    'signup/verifyAffiliation': (options) => {
      // Meteor._sleepForMs(2000)
      // throw new Meteor.Error('Unexpected error', 'My fantastic reason', {email: 'This is not a valid email'})
      check(options, Object)
      return new OnboardManager().verifyAffiliation(options)
    },

    // returns invite code
    'signup/alumni': (options) => {
      // Meteor._sleepForMs(2000)
      check(options, Object)
      return new OnboardManager().verifyAlumni(options)
    },

    'topics/users/import': (topicId, userInfos) => {
      check(topicId, String)
      check(userInfos, [Object])

      const topic = Topics.findOne(topicId)
      if (!topic) {
        throw new Meteor.Error(400, `Invalid topicId: ${topicId}.`)
      }

      var re = /^(([^<>()[\]\\.,:\s@"]+(\.[^<>()[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const filteredUserInfos = userInfos.filter(userInfo => re.test(userInfo.email))

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
        filteredUserInfos.forEach(userInfo => {
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

    'profile/getFacebookAvatar': () => {
      const user = CurrentUser.get()

      if (user.services.facebook) {
        return `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`
      } else {
        throw new Meteor.Error(400, "You haven't linked Facebook yet.")
      }
    },

    'profile/update': (profile) => {
      const user = CurrentUser.get()

      check(profile, Object)
      check(profile.firstName, String)
      check(profile.lastName, String)
      check(profile.avatarUrl, String)
      check(profile.isDefaultAvatar, Boolean)
      check(profile.avatarColor, String)

      const updateValues = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatar: {
          url: profile.avatarUrl,
          isDefaultAvatar: profile.isDefaultAvatar,
          color: profile.avatarColor
        }
      }

      if (profile.classYear) {
        updateValues.classYear = profile.classYear
      }

      Users.update(user._id, {
        $set: updateValues
      })
    },

    'emailPreference/update': (preference) => {
      const user = CurrentUser.get()
      Users.update(user._id, { $set: {
        emailPreference: preference
      }})
    },

    'post/insert': (_id, title, content, topicIds) => {
      const user = CurrentUser.get()

      check(_id, String)
      check(title, String)
      check(content, String)
      check(topicIds, [String])

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
      filteredTopicIds.forEach(topicId => {
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

      try {
        TopicManager.follow({topicId, user: CurrentUser.get()})
      } catch (err) {
        throw new Meteor.Error(500, 'There was a problem with following this topic.')
      }
    },

    'topic/unfollow': (topicId) => {
      check(topicId, String)

      try {
        TopicManager.unfollow({topicId, user: CurrentUser.get()})
      } catch (err) {
        throw new Meteor.Error(500, 'There was a problem with unfollowing this topic.')
      }
    },

    'topic/removeFollower': (topicId, userId) => {
      check(topicId, String)
      check(userId, String)

      try {
        TopicManager.unfollow({topicId, user: {_id: userId}})
      } catch (err) {
        throw new Meteor.Error(500, 'There was a problem removing follower.')
      }
    },

    'topic/remove': (topicId) => {
      console.log('topic/remove', topicId)
      check(topicId, String)

      const user = CurrentUser.get()
      const topic = Topics.findOne(topicId)

      if (!topic) {
        throw new Meteor.Error(400, 'Seems like you are trying to remove an invalid topic')
      }

      if (topic.ownerId !== user._id) {
        throw new Meteor.Error(400, 'You are not authorized to remove a topic that you do not own')
      }

      TopicManager.remove({ topicId })
    },

    'topic/create': (topicInfo) => {
      const user = CurrentUser.get()
      check(topicInfo, Object)

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
        displayName: UserService.capitalizeFirstLetter(topicInfo.name),
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

    'post/follow': (postId) => {
      check(postId, String)
      PostManager.follow({postId, user: CurrentUser.get()})
    },

    'post/unfollow': (postId) => {
      check(postId, String)
      PostManager.unfollow({postId, user: CurrentUser.get()})
    },

    'messages/insert': (_id, postId, commentText) => {
      check(_id, String)
      check(postId, String)
      check(commentText, String)

      const user = CurrentUser.get()
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

    'messages/delete': _id => {
      check(_id, String)

      const user = CurrentUser.get()
      const message = Messages.findOne(_id)
      if (message.ownerId !== user._id) {
        throw new Meteor.Error('You can only delete your own messages')
      }
      Messages.remove({_id: _id})
    },

    // onboarding related
    '_accounts/unlink/service': function (serviceName) {
      const user = CurrentUser.get()
      Accounts.unlinkService(user._id, serviceName)
    },

    'welcome/signup': (info) => {
      check(info, Object)
      const user = CurrentUser.get()
      return new OnboardManager().handleSignup(user, info)
    },

    'welcome/linkfacebook': () => {
      const user = CurrentUser.get()

      var avatarUrl = user.avatar.url
      var isDefaultAvatar = user.avatar.isDefaultAvatar

      if (user.services && user.services.facebook) {
        avatarUrl = `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`
        isDefaultAvatar = false
      }

      Users.update(user._id, { $set: {
        firstName: user.firstName || user.services.facebook.first_name,
        lastName: user.lastName || user.services.facebook.last_name,
        avatar: {
          url: avatarUrl,
          isDefaultAvatar
        }
      }})
    },

    'welcome/invite': (options) => {
      check(options, Object)
      const { invitees } = options;
      const user = CurrentUser.get()
      return new OnboardManager().handleInvites(user, invitees)
    },

    'welcome/setLoginService': (serviceName) => {
      check(serviceName, String)

      try {
        const user = CurrentUser.get()
        Users.update(user._id, { $set: {
          emailPreference: 'all', // have this in here until users can choose their email prefs in onboarding.
          status: 'active'
        }})
      } catch (error) {
        console.error(error)
        throw new Meteor.Error(500, `There was a problem setting up your ${serviceName}`)
      }
    },

    'get/followers': (userIds) => {
      check(userIds, Array)

      return userIds.map(user => {
        return Users.findOne(user.userId)
      }).filter((user) => user !== undefined)
    }
  })
}
