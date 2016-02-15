export default {
  adminInvite: {
    sendInvite ({Meteor, sweetalert}, inviteId) {
      Meteor.call('admin/user/invite', inviteId, (err) => {
        if (err) {
          return sweetalert({title: 'Error inviting', text: err.reason})
        }
      })
    },

    removeInvite ({ Meteor, sweetalert }, inviteId) {
      Meteor.call('admin/invite/delete', inviteId, (err) => {
        if (err) {
          return sweetalert({title: 'Error removing invite', text: err.reason})
        }
        return sweetalert({
          title: 'Invite Removed',
          text: 'You will not see this sucker again'
        })
      })
    }
  }
}
