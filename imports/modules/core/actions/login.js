import UserService from '/imports/libs/UserService';

export default {
  loginWithPassword({LocalState, FlowRouter}, email, password) {
    const id = Meteor.uuid();
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        LocalState.set('LOGIN_ERROR', true);
        return;
      }

      LocalState.set('LOGIN_ERROR', false);
      FlowRouter.go('all-mine');
    })
  },
  loginWithFacebook({LocalState, FlowRouter}) {
    Meteor.loginWithFacebook((err) => {
      if (err) {
        LocalState.set('LOGIN_ERROR', true);
        return;
      }

      LocalState.set('LOGIN_ERROR', false);
      FlowRouter.go('all-mine');
    })
  },
};
