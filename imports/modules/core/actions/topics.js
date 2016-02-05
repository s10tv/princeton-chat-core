import UserService from '/imports/libs/UserService';

export default {
  create({Collections, LocalState, FlowRouter, handleClose}, title, content, topics) {
    const id = Meteor.uuid();
    const topicIds = topics.split(',');

    // There is a method stub for this in the config/method_stubs
    // That's how we are doing latency compensation
    Meteor.call('post/insert', id, title, content, topicIds, (err) => {
      if (err) {
        return LocalState.set('SAVING_ERROR', err.message);
      }

      LocalState.set('ADD_POST_POPUP_SHOWING', false);
      FlowRouter.go(`/topics/${topicIds[0]}/${id}`)
    });
  },

  navigateToTopic({ FlowRouter }, topicId) {
    return FlowRouter.go(`/topics/${topicId}`);
  },

  navigateToTopicList({ FlowRouter }) {
    return FlowRouter.go('choose-topics');
  },

  updateTopicFollowers({ LocalState, Collections }, topicIds) {
    const userIdMap = Collections.Topics.find({ _id: { $in: topicIds }}).fetch().reduce((acc, topic) => {
      topic.followers.forEach(follower => {
        acc[follower.userId] = follower;
      });
      return acc;
    }, {});

    const followers = _.map(userIdMap, (val) => {
      return val;
    });

    Meteor.call('get/followers', followers, (err, res) => {
      if (err) {
        console.log(err);
      }

      LocalState.set('POST_FOLLOWERS', res);
    });
  },

  showTopicFollowers({ LocalState }) {
    LocalState.set('FOLLOWERS_MODAL_OPEN', true);
  },

  showTopicFollowersFromFollowersList({ LocalState }, followerList) {
    LocalState.set('POST_FOLLOWERS', followerList);
    LocalState.set('FOLLOWERS_MODAL_OPEN', true);
  },

  follow({Meteor, LocalState}, topicId) {
    Meteor.call('topic/follow', topicId, (err) => {
      if (err) {
        LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason);
      }
    });
  },

  unfollow({Meteor, LocalState}, topicId) {
    Meteor.call('topic/unfollow', topicId, (err) => {
      if (err) {
        LocalState.set('SHOW_GLOBAL_SNACKBAR_WITH_STRING', err.reason);
      }
    });
  },

  showAddNewUsersModal({LocalState}, topicId) {
    LocalState.set('SHOW_ADD_NEW_USERS', topicId);
  },

  closeAddNewUsersModal({LocalState}) {
    LocalState.set('SHOW_ADD_NEW_USERS', null);
  },

  addNewUsers({Meteor, LocalState}, topicId, emails) {
    Meteor.call('topics/users/import', topicId, emails, (err) => {
      if (err) {
        console.log(err);
      }

      LocalState.set("SHOW_ADD_NEW_USERS_SNACKBAR", true);
    });
  },

  closeAddNewUsersSnackbar({LocalState}) {
    LocalState.set("SHOW_ADD_NEW_USERS_SNACKBAR", false);
  }
}
