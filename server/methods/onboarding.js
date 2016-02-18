export default function (context) {
  const {slack, currentUser, Meteor, OnboardManager, Collections}= context
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
      Meteor.call('user/setStatusActive')
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
