var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function () {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft: function () {
      Session.set(MENU_KEY, false);
    },
    wipeRight: function () {
      Session.set(MENU_KEY, true);
    },
    preventDefaultEvents: false
  });

  // Only show the connection error box if it has been 5 seconds since
  // the app started
  setTimeout(function () {
    // Launch screen handle created in lib/router.js
    dataReadyHold.release();

    // Show the connection error box
    Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.appBody.onRendered(function() {
  $('#allTopics-select').select2({
    placeholder: 'Choose topics',
    multiple: true,
    width: '100%',
  })

  this.find('#content-container')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn(function () {
          if (listFadeInHold) {
            listFadeInHold.release();
          }
        });
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        $(this).remove();
      });
    }
  };

  this.autorun(function() {
    if (Meteor.userId()) {
      const user = Meteor.user();
      Session.set('profile', {
        firstName: user.firstName,
        lastName: user.lastName,
        classYear: user.classYear,
        classType: user.classType,
        info: user.info,
      });
    }
  });
});

Template.appBody.helpers({
  // We use #each on an array of one item so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes. #each looks at the _id property of it's
  // items to know when to insert a new item and when to update an old one.
  thisArray: function() {
    return [this];
  },
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },
  cordova: function() {
    return Meteor.isCordova && 'cordova';
  },
  emailLocalPart: function() {
    var email = Meteor.user().emails[0].address;
    return email.substring(0, email.indexOf('@'));
  },
  userMenuOpen: function() {
    return Session.get(USER_MENU_KEY);
  },
  lists: function() {
    return Lists.find();
  },
  activeListClass: function() {
    var current = Router.current();
    if ((current.route.name === 'listsShow' && current.params._id === this._id) ||
      (current.route.name === 'todoItemDetail' && current.params.listId === this._id)) {
      return 'active';
    }
  },
  connected: function() {
    if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
      return Meteor.status().connected;
    } else {
      return true;
    }
  },
  loggedIn: function() {
    return Meteor.user() != undefined;
  },

  // all profile editing related
  profile: function() {
    return Session.get('profile');
  },
  possibleYears: function() {
    const currentYear = (new Date()).getFullYear();
    return _.range(1900, currentYear + 1);
  },
  isYearSelected: function(year) {
    return Session.get('profile').classYear == year;
  },
  isClassTypeSelected: function(classType) {
    return Session.get('profile').classType === classType;
  }
});

Template.appBody.events({
  'submit #newPostForm': function(event) {
    event.preventDefault();
    const postTitle = $(event.target).find('[name=postTitle]').val();
    const postContent = $(event.target).find('[name=postContent]').val();
    const postTopics = $("#allTopics-select").val();

    if (postTopics.length == 0) {
      console.log('you have to attach at least one topic');
      return;
    }

    Meteor.call('post/insert', postTitle, postContent, postTopics, (err, postId) => {
      $('.modal').modal('hide');

      if (err) {
        console.log(err);
        return
      }

      Router.go(`/lists/${postTopics[0]}/${postId}`);
    });
  },

  'click .js-menu': function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },

  'click .content-overlay': function(event) {
    Session.set(MENU_KEY, false);
    event.preventDefault();
  },

  'click .js-user-menu': function(event) {
    Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
    // stop the menu from closing
    event.stopImmediatePropagation();
  },

  'click #menu a': function() {
    Session.set(MENU_KEY, false);
  },

  'click .js-logout': function() {
    Meteor.logout();

    // if we are on a private list, we'll need to go to a public one
    var current = Router.current();
    if (current.route.name === 'listsShow' && current.data().userId) {
      Router.go('listsShow', Lists.findOne({userId: {$exists: false}}));
    }
  },

  'click .js-new-list': function() {
    var list = {name: Lists.defaultName(), incompleteCount: 0};
    list._id = Lists.insert(list);

    Router.go('listsShow', list);
  },

  'click #profileEditDismiss': function() {
    Session.set('profile', {});
  },

  'click #editProfileSubmit': function(event) {
    event.preventDefault();
    const firstName = $('#profileFirstName').val();
    const lastName = $('#profileLastName').val();
    const classYear = $('#profileClassYear').val();
    const parsedClassType = () => {
      switch($('#profileClassType').val()) {
        case 'Undergraduate':
          return 'undergrad';
        case 'Graduate':
          return 'grad';
      }
    };
    const info = $('#profileInfo').val();
    var updatedProfile = {
      firstName, lastName, classYear, classType: parsedClassType(), info
    };
    Meteor.call('profile/update', updatedProfile, function(err) {
      if (err) {
        console.log(err);
      }

      Session.set('profile', updatedProfile);
      $('#editProfileModal').modal('hide');
    });
  }
});
