import UserService from '/imports/libs/UserService';
import { getParameterByName } from '/imports/libs/urlutil'

export default {
  loginWithPassword({LocalState, FlowRouter}, email, password) {
    const id = Meteor.uuid();
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        LocalState.set('LOGIN_ERROR', true);
        alert('Email and password not recognized. Have you registered yet?')
        return;
      }

      LocalState.set('LOGIN_ERROR', false);

      const redirectUrl = getParameterByName('ol')
      if (redirectUrl && redirectUrl.length > 0) {
        window.location = redirectUrl;
        return;
      }

      return FlowRouter.go('all-mine');
    })
  },

  loginWithFacebook({LocalState, FlowRouter}) {
    Meteor.loginWithFacebook((err) => {
      if (err) {
        LocalState.set('LOGIN_ERROR', true);
        alert(err.reason)
        return
      }

      LocalState.set('LOGIN_ERROR', false);

      const redirectUrl = getParameterByName('ol')
      if (redirectUrl && redirectUrl.length > 0) {
        window.location = redirectUrl;
        return;
      }

      return FlowRouter.go('all-mine');
    })
  },
};
