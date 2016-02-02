import UserService from '/imports/libs/UserService';

export default {
  create({Collections, LocalState, handleClose}, content, postId) {
    const id = Meteor.uuid();

    // There is a method stub for this in the config/method_stubs
    // That's how we are doing latency compensation
    Meteor.call('messages/insert', id, postId, content, (err) => {
      if (err) {
        return LocalState.set('MESSGE_SEND_ERROR', err.message);
      }
    });
  },

  showUserProfile({LocalState}, message) {
    LocalState.set('PROFILE_USER', message.owner);
  }
};
