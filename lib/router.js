var OnBeforeActions = {
    loginRequired: function(pause) {
      if (!Meteor.userId()) {
        this.render('signin');
        return pause();
      }
    }
};

Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody',

  // the appNotFound template is used for unknown routes and missing lists
  notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present
  waitOn: function() {
    return [
      Meteor.subscribe('publicLists'),
      Meteor.subscribe('userData'),
      Meteor.subscribe('onboardingMessages'),
    ];
  }
});

Router.onBeforeAction(OnBeforeActions.loginRequired, {
  only: ['settings', 'todoItemDetail', 'listsShow', 'home']
});

dataReadyHold = null;

if (Meteor.isClient) {
  // Keep showing the launch screen on mobile devices until we have loaded
  // the app's data
  dataReadyHold = LaunchScreen.hold();

  // Show the loading screen on desktop
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}

Router.route('join');
Router.route('signin');
Router.route('settings');

Router.route('todoItemDetail', {
  path: '/lists/:listId/:postId',
  // subscribe to todos before the page is rendered but don't wait on the
  // subscription, we'll just render the items as they arrive
  onBeforeAction: function () {
    this.commentsHandle = Meteor.subscribe('comments', this.params.postId);

    if (this.ready()) {
      // Handle for launch screen defined in app-body.js
      dataReadyHold.release();
    }
  },
  data: function () {
    return {
      todo: Todos.findOne(this.params.postId),
      comments: Comments.find({ todoId: this.params.postId }).fetch()
    }
  },
  action: function () {
    this.render();
  }
});

Router.route('listsShow', {
  path: '/lists/:_id',
  // subscribe to todos before the page is rendered but don't wait on the
  // subscription, we'll just render the items as they arrive
  onBeforeAction: function () {
    this.todosHandle = Meteor.subscribe('todos', this.params._id);

    if (this.ready()) {
      // Handle for launch screen defined in app-body.js
      dataReadyHold.release();
    }
  },
  data: function () {
    return Lists.findOne(this.params._id);
  },
  action: function () {
    this.render();
  }
});

Router.route('home', {
  path: '/',
  action: function() {
    Router.go('listsShow', Lists.findOne());
  }
});

Router.route('onboarding', {
  path: '/invite/:id',
  action: function() {
    Accounts.callLoginMethod({
      methodArguments: [{ invite: this.params.id }],
      userCallback: (err) => {
        if (err) {
          return Router.go('/');
        }

        if (Messages.find().count() == 0) {
          Meteor.call('reset');
        }

        this.render('invite');
      }
    })
  }
});
