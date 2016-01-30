import UserService from '/imports/libs/UserService';

export default {
  create({Collections, LocalState, handleClose}, title, content, topics) {
    const id = Meteor.uuid();
    const topicIds = topics.split(',');

    // There is a method stub for this in the config/method_stubs
    // That's how we are doing latency compensation
    Meteor.call('post/insert', id, title, content, topicIds, (err) => {
      if (err) {
        console.log(err.message);
        return LocalState.set('SAVING_ERROR', err.message);
      }

      LocalState.set('ADD_POST_POPUP_SHOWING', false);
      FlowRouter.go(`/topics/${topicIds[0]}/${id}`)
    });
  },

  showAddPostPopup({ LocalState }) {
    LocalState.set('ADD_POST_POPUP_SHOWING', true);
  },

  closeAddPostPopup({ LocalState }) {
    LocalState.set('ADD_POST_POPUP_SHOWING', false);
  },

  showUserProfile({ LocalState }, post) {
    LocalState.set('PROFILE_USER', post.owner);
  },

  showPostFollowers({ LocalState }, followers) {
    LocalState.set('FOLLOWERS_MODAL_OPEN', true);

    Meteor.call('get/followers', followers, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
      LocalState.set('POST_FOLLOWERS', res);
    });
  },

  follow({ Meteor }, postId) {
    Meteor.call('post/follow', postId);
  },

  unfollow({ Meteor }, postId) {
    Meteor.call('post/unfollow', postId);
  },
};
