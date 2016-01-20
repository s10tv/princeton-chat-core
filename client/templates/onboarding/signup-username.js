var ERRORS_KEY = 'joinErrors';

Template.signupUsername.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Template.signupUsername.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  },
  errorClass: function(key) {
    return Session.get(ERRORS_KEY)[key] && 'error';
  }
});

Template.signupUsername.events({
  'submit': function(event, template) {
    event.preventDefault();
    const firstName = template.$('[name=firstName]').val();
    const lastName = template.$('[name=lastName]').val();
    const username = template.$('[name=username]').val();
    const classYear = $('#classYear').val();
    const parsedClassType = () => {
      switch($('#classType').val()) {
        case 'Undergraduate':
          return 'undergrad';
        case 'Graduate':
          return 'grad';
        default:
          return null;
      }
    };

    var errors = {};

    if (!firstName) {
      errors.firstName = "C'mon, all Tigers are given a first name!";
    }

    if (!lastName) {
      errors.password = "You forgot to tell us how do you get called in the army!";
    }

    if (firstName && lastName && (!firstName.match(/^[a-zA-Z]+$/) || !lastName.match(/^[a-zA-Z]+$/))) {
      errors.wrongName = "Names only consist from letters, right?";
    }

    if (!username) {
      errors.username = "You forgot to claim your username.";
    }

    if (username && !username.match(/^[a-zA-Z0-9]+$/)) {
      errors.wrongUsername = "Usernames should only consist from letters and numbers";
    }

    if (classYear == "Class Year") {
      errors.classYear = "When did you get your marvelous graduate cap?"
    }

    if (parsedClassType() == null) {
      errors.classType = "You forgot to choose a class type."
    }

    Session.set(ERRORS_KEY, errors);
    if (_.keys(errors).length) {
      return;
    }
  }
});
