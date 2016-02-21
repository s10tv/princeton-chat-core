export default function (context) {
  const {slack, Match, check, currentUser, Meteor,
    OnboardManager, Collections, AvatarService, audience}= context
  const {Users} = Collections

  Meteor.methods({
    'signup/verifyAffiliation': (options) => {
      check(options, Object)
      return OnboardManager.verifyAffiliation(options)
    },

    'signup/alumni': (options) => {
      check(options, Object)
      return OnboardManager.verifyAlumni(options)
    },

    'profile/avatar/useFacebook': () => {
      const user = currentUser()

      if (user.services.facebook) {
        Users.update(user._id, { $set: {
          avatar: {
            url:  `https://graph.facebook.com/${user.services.facebook.id}/picture?type=large`,
            isDefaultAvatar: false,
          }
        }})
      } else {
        throw new Meteor.Error(400, "You haven't linked Facebook yet.")
      }
    },

    'profile/avatar/useDefault': () => {
      const user = currentUser()

      Users.update(user._id, { $set: {
        avatar: {
          url: AvatarService.generateDefaultAvatarForAudience(audience),
          isDefaultAvatar: true,
          color: AvatarService.generateRandomColorForDefaultAvatar()
        }
      }})
    },

    'profile/update': (profile) => {
      check(profile, Object)
      check(profile.firstName, Match.Optional(String))
      check(profile.lastName, Match.Optional(String))
      check(profile.username, Match.Optional(String))
      check(profile.displayName, Match.Optional(String))

      const user = currentUser()
      const userWithThisUsername = Users.findOne({ username: profile.username })
      if (userWithThisUsername && userWithThisUsername._id !== user._id) {
        throw new Meteor.Error(400, 'This username is taken', {
          'username': 'This username is taken.'
        })
      }

      const updateValues = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        username: profile.username,
        displayName: profile.displayName,
      }

      if (profile.classYear) {
        updateValues.classYear = profile.classYear
      }

      try {
        Users.update(user._id, {
          $set: updateValues
        })
      } catch (err) {
        console.log(err)
        throw new Meteor.Error(500, 'Hmm seems like we have a problem updating your ' +
          'profile info.')
      }
    },

    'emailPreference/update': (preference) => {
      const user = currentUser()
      Users.update(user._id, { $set: {
        emailPreference: preference
      }})
    },

    'welcome/signup': (info) => {
      check(info, Object)
      const user = currentUser()
      return OnboardManager.handleSignup(user, info)
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
      return invitees
    },

    'welcome/setLoginService': (serviceName) => {
      check(serviceName, String)

      try {
        const user = currentUser()
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
      const user = currentUser()

      Users.update(user._id, { $set: {
        status: 'active'
      }})

      const count = Users.find().count()
      slack.send({
        icon_emoji: ':heart:',
        text: `${user.firstName} ${user.lastName} signed up. Total count: ${count}.`,
        username: 'signup'
      })
    }
  })
}
