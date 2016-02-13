export default {
  verifyAffiliation ({Meteor}, data) {
    Meteor.call('signup/verifyAffiliation', data, (err) => {
      if (err) {
        // TODO(tonyx): Display Error
        console.log(err)
        return
      }

      // TODO(tonyx): Display success indicator
      console.log('inserted invite')
    })
  }
}
