import UserService from '/imports/libs/UserService';

export default {
  create({Collections, LocalState, handleClose}, title, content, topics) {
    const id = Meteor.uuid();
    const topicIds = topics.split(',');

    // There is a method stub for this in the config/method_stubs
    // That's how we are doing latency compensation
    Meteor.call('post/insert', id, title, content, topicIds, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.message);
      }

      LocalState.set('ADD_POST_POPUP_SHOWING', false);
    });
  },

  follow({Collections}, postId) {
    const currentUser = UserService.currentUser();
    if (currentUser) {
      Collections.Users.update(currentUser._id, { $addToSet: {
        followingPosts: postId,
      }})
    }
  },
};
