export default {
  adminInvite: {
    sendInvite ({Meteor, sweetalert}, inviteId) {
      Meteor.call('admin/user/invite', inviteId, (err) => {
        if (err) {
          return sweetalert({title: 'Error inviting', text: err.reason})
        }
        return sweetalert({title: 'Invited', text: 'They will get an invite in their inbox.'})
      })
    },

    removeInvite ({ Meteor, sweetalert }, inviteId) {
      sweetalert({
        title: 'Are you sure?',
        text: 'You will permanently delete this invite',
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false
      }, function () {
        Meteor.call('admin/invite/delete', inviteId, (err) => {
          if (err) {
            return sweetalert({title: 'Error removing invite', text: err.reason})
          }
          return sweetalert({
            title: 'Invite Removed',
            text: 'You will not see this sucker again'
          })
        })
      })
    }
  }

}
