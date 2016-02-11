import { Meteor } from 'meteor/meteor'
import { Match, check } from 'meteor/check'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import { Accounts } from 'meteor/accounts-base'

import AvatarService from '/lib/avatar.service.js'
import { Topics, Posts, Users, Messages } from '/lib/collections'
import TopicManager from '/server/lib/TopicManager'
import PostManager from '/server/lib/PostManager'
import _ from 'underscore'
import NewTopicService from '/lib/newtopic.service.js'
import UserService from '/lib/user.service.js'

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slackUsername = process.env.ENV || 'dev'
const slackEmoji = process.env.ENV === 'prod' ? ':beer:' : ':poop:'
const slack = Meteor.npmRequire('slack-notify')(slackUrl)
const audience = process.env.AUDIENCE || 'princeton'

class CurrentUser {
  static get () {
    const user = Meteor.user()
    if (!user) {
      throw new Meteor.Error(401, 'Unauthorized')
    }
    return user
  }
}

const getLargestUserNumber = () => {
  const [ userWithHighestNumber ] = Users
    .find({}, { sort: { userNumber: 1 }, limit: 1 })
    .fetch()

  if (userWithHighestNumber && userWithHighestNumber.userNumber) {
    return userWithHighestNumber.userNumber + 1
  } else {
    return 1
  }
}

const stripTrailingSlash = (str) => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1)
  }
  return str
}

Meteor.methods({
  'signup': (options) => {
    check(options, Object)
    const { firstName, lastName, classYear, emailAddress } = options

    check(firstName, String)
    check(lastName, String)
    check(emailAddress, String)
    check(classYear, Match.Optional(String))

    var email = (emailAddress || '').trim()
    if (email.length === 0) {
      throw new Meteor.Error(400, 'To sign up, you need to enter your email.')
    }

    var user = Accounts.findUserByEmail(email)
    if (!user) {
      // our onboarding using react has a field called `email` on user, instead of meteor `emails`
      user = Users.findOne({ email: email })
    }

    if (!user) {
      var userNumber = getLargestUserNumber()
      const userId = Users.insert({
        firstName,
        lastName,
        classYear,
        userNumber: userNumber,
        status: 'pending',
        avatar: {
          url: AvatarService.generateDefaultAvatarForAudience(audience),
          isDefaultAvatar: true,
          color: AvatarService.generateRandomColorForDefaultAvatar()
        }
      })

      Accounts.addEmail(userId, email)
      user = Users.findOne(userId)
    }

    const inviteCode = Random.id()
    Users.update(user._id, { $set: {
      inviteCode: inviteCode
    }})

    slack.send({
      icon_emoji: slackEmoji,
      text: `${user.firstName} ${user.lastName} (${email}) signed up`,
      username: slackUsername
    })

    if (process.env.SKIP_CHECK_PRINCETON_EMAIL || /.*@alumni.princeton.edu$/.test(email)) {
      const inviteUrl = `${stripTrailingSlash(process.env.ROOT_URL)}/invite/${inviteCode}`
      const postmark = Meteor.npmRequire('postmark')
      const postmarkKey = process.env.POSTMARK_API_KEY || 'a7c4668c-6430-4333-b303-38a4b9fe7426'
      const client = new postmark.Client(postmarkKey)

      const Future = Npm.require('fibers/future')
      const future = new Future()
      const onComplete = future.resolver()

      client.sendEmailWithTemplate({
        'From': process.env.POSTMARK_SENDER_SIG || 'notifications@princeton.chat',
        'To': email,
        'TemplateId': process.env.POSTMARK_WELCOME_TEMPLATE_ID || 354341,
        'TemplateModel': {
          inviteLink: inviteUrl
        }
      }, onComplete)

      Future.wait(future)
      try {
        future.get()
      } catch (err) {
        console.log('Received error from Postmark. Perhaps templateId or sender sig is wrong?')
        console.error(err)
        console.log(err.stack)
        return
      }

      slack.send({
        icon_emoji: slackEmoji,
        text: `Sent a welcome email to ${email}.`,
        username: slackUsername
      })

      return true
    }

    // did not pass validation.
    return false
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

  'signup/test': (emailOverride) => {
    check(emailOverride, Match.Optional(String))
    const [{user}] = JSON.parse(HTTP.call('GET', 'https://randomuser.me/api/').content).results
    const email = emailOverride || user.email

    Meteor.call('signup', {
      firstName: user.name.first,
      lastName: user.name.last,
      classYear: '2012',
      emailAddress: email
    })
  },

  'signup/randomuser': () => {
    const [{user}] = JSON.parse(HTTP.call('GET', 'https://randomuser.me/api/').content).results
    const inviteCode = Meteor.uuid()
    Users.insert({
      firstName: user.name.first,
      lastName: user.name.last,
      emails: [
        { address: user.email, verified: false }
      ],
      classYear: '2012',
      inviteCode: inviteCode,
      isFullMember: true,
      avatar: {
        url: AvatarService.generateDefaultAvatarForAudience(audience),
        isDefaultAvatar: true,
        color: AvatarService.generateRandomColorForDefaultAvatar()
      }
    })

    console.log(`http://localhost:3000/invite/${inviteCode}`)
  },

  'topics/follow': (topicIds) => {
    const user = CurrentUser.get()

    const curatedTopicIds = topicIds.map(topicId => {
      return Topics.findOne(topicId)
    }).filter(topic => {
      return topic !== undefined && topic != null
    }).map(topic => {
      return topic._id
    })

    Users.update(user._id, { $set: {
      followingTopics: curatedTopicIds
    }})
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
