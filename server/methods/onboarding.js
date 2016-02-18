import {_} from 'underscore'

export default function (context) {
  const {audience, slack, currentUser, OnboardManager, Collections, TopicManager,
    AvatarService} = context
  const {Topics, Users} = Collections

  Meteor.methods({
    'signup/verifyAffiliation': (options) => {
      check(options, Object)
      check(currentUser(), Object)

      return OnboardManager.verifyAffiliation(options)
    },

    'signup/alumni': (options) => {
      check(options, Object)
      check(currentUser(), Object)

      return OnboardManager.verifyAlumni(options)
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
      const user = currentUser()

      if (user.services.facebook) {
        return `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`
      } else {
        throw new Meteor.Error(400, "You haven't linked Facebook yet.")
      }
    },

    'profile/update': (profile) => {
      check(profile, Object)
      check(profile.firstName, String)
      check(profile.lastName, String)
      check(profile.avatarUrl, String)
      check(profile.isDefaultAvatar, Boolean)
      check(profile.avatarColor, String)

      const user = currentUser()

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

    'welcome/signup': (info) => {
      check(info, Object)
      const user = currentUser()
      return new OnboardManager().handleSignup(user, info)
    },

    'welcome/linkfacebook': () => {
      const user = currentUser()

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
      const user = currentUser()
      const { invitees } = options;
      OnboardManager.handleInvites(user, invitees)
      Meteor.call('user/setStatusActive')
      return invitees
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

    'user/setStatusActive': () => {
      const currentUser = currentUser()

      Users.update(currentUser._id, { $set: {
        status: 'active'
      }})

      const count = Users.find().count()
      slack.send({
        icon_emoji: ':heart:',
        text: `${currentUser.firstName} ${currentUser.lastName} signed up. Total count: ${count}.`,
        username: 'signup'
      })
    }
  })
}
