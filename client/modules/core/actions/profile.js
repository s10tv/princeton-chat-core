export default {
  closeModal ({ LocalState }) {
    LocalState.set('PROFILE_USER', null)
  },

  showUserProfile ({ LocalState }, user) {
    LocalState.set('PROFILE_USER', user)
  }
}
