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
  $('#addPostModal').on('show.bs.modal', function(e) {
    var topicId = $(e.relatedTarget).data('topic-id');
    $(e.target).find('option[value="' + topicId + '"]').attr({ 'selected': true });

    $('#allTopics-select').select2({
      placeholder: 'Choose topics',
      multiple: true,
      width: '100%',
    })
  });

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
    var lists = Lists.find().fetch();
    const user = Meteor.user();
    if (user && user.followingTopics) {
      return lists.map((list) => {
        list.index = user.followingTopics.indexOf(list._id);
        return list
      }).sort(function(e1, e2) {
        return e1.index < e2.index;
      })
    }

    return lists;
  },
  isFollowingTopic: function() {
    const user = Meteor.user();
    if (user) {
      if (user.followingTopics) {
        if (user.followingTopics.indexOf(this._id) >= 0) {
          return true;
        }
      }
    }

    return false;
  },
  activeListClass: function() {
    var current = Router.current();
    if ((current.route.name === 'listsShow' && current.params._id === this._id) ||
      (current.route.name === 'todoItemDetail' && current.params.listId === this._id)) {
      return 'active';
    }
  },
  headerClass: function() {
    var current = Router.current();
    if (current.route.name == 'settings') {
      return 'active-header';
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
    return Meteor.user() && Meteor.user().status == 'active'; // second check needed for onboarding
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

    const errorBox = $('#addPostError');
    const displayError = (msg) => {
      errorBox.css({ 'display': 'block' });
      errorBox.text(msg);
    }

    const postTitle = $(event.target).find('[name=postTitle]').val();
    const postContent = $(event.target).find('[name=postContent]').val();
    const postTopics = $("#allTopics-select").val();

    if (!postTopics || postTopics.length == 0) {
      displayError('Please select at least one topic for this post.');
      return;
    }

    Meteor.call('post/insert', postTitle, postContent, postTopics, (err, postId) => {
      if (err) {
        displayError(err.reason);
        return
      }

      $('.modal').modal('hide');
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
