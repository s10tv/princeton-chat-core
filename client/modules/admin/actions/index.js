export default {
  adminInvite: {
    sendInvite ({Meteor, sweetalert}, inviteId) {
      Meteor.call('admin/user/invite', inviteId, (err) => {
        if (err) {
          return sweetalert({ title: 'Error inviting', text: err.reason })
        }
      })
    }
  }
}