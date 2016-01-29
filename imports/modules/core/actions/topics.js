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

  navigateToTopic({}, topicId) {
    return FlowRouter.go(`/topics/${topicId}`);
  },

  follow({Meteor}, topicId) {
    Meteor.call('topic/follow', topicId, (err) => {
      switch (FlowRouter.current().route.name) {
        case 'onboarding':
        case 'tigercub-directmessage':
          Meteor.call('welcome/topic/follow', topicId)
      }
    });
  },

  unfollow({Meteor}, topicId) {
    Meteor.call('topic/unfollow', topicId);
  },
}
