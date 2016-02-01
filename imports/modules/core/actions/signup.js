export default {
  signup({Meteor, LocalState}, emailAddress, firstName, lastName, classYear) {
    LocalState.set('SIGNING_UP', true)

    Meteor.call('signup', { emailAddress, firstName, lastName, classYear }, (err) => {
      if (err) {
        return LocalState.set('SIGNUP_ERROR', err.message);
      }

      LocalState.set('EMAIL_SIGNING_UP', emailAddress)
      LocalState.set('SIGNING_UP', false)
      FlowRouter.go('signup-done')
    });
  },
};
