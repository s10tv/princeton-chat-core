export default {
  closeModal({ LocalState }) {
    LocalState.set('PROFILE_USER', null);
  }
}
