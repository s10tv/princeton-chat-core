export default function ({Meteor, OnboardManager, Collections}) {
  const {Invites} = Collections

  class AdminUserService {
    static get () {
      const user = Meteor.user()
      if (!user) {
        throw new Meteor.Error(401, 'Unauthorized - User not logged in')
      }
      if (!user.topicAdmins || user.topicAdmins.indexOf('global') < 0) {
        throw new Meteor.Error(401, 'Unauthorized - Must be admin')
      }
      return user
    }
  }

  Meteor.methods({
    'admin/user/invite': (inviteId) => {
      // verify admin identity
      AdminUserService.get()

      const invite = Invites.findOne({ _id: inviteId })
      if (!invite) {
        throw new Meteor.Error(400, 'Invite not found')
      }

      OnboardManager.handleManualVerify(invite)
    },

    'admin/invite/delete': (inviteId) => {
      // verify admin identity
      AdminUserService.get()

      Invites.remove(inviteId)
    }
  })
}
