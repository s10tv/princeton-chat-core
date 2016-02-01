import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import LayoutMain from '/imports/modules/core/components/layout/layout.jsx'
import PostList from '/imports/modules/core/containers/post.list.js'
import PostSingle from '/imports/modules/core/containers/post.details.js'
import DirectMessage from '/imports/modules/core/components/directMessage.jsx'
import TopicList from '/imports/modules/core/containers/topic.list.js'
import Onboarding from '/imports/modules/core/containers/onboarding.js'
import Signup from '/imports/modules/core/containers/signup.js'
import SignupDone from '/imports/modules/core/containers/signup.done.js'

import Login from '/imports/modules/core/containers/login.js'

import WebFontLoader from 'webfontloader';

function requireLogin(context) {
  if (!Meteor.userId()) {
    return FlowRouter.go('home');
  }
}

function redirectToAllMine(context) {
  if (Meteor.userId()) {
    return FlowRouter.go('all-mine');
  }
}

export default function (injectDeps) {
  WebFontLoader.load({
    google: {
      families: ['Roboto']
    }
  });

  const LayoutMainCtx = injectDeps(LayoutMain);
  const LoginWithCtx = injectDeps(Login);
  const SignupWithCtx = injectDeps(Signup);
  const SignupDoneWithCtx = injectDeps(SignupDone);

  FlowRouter.triggers.enter([requireLogin], {except: ["home", "invite", "signup", "signup-done" ]});
  FlowRouter.triggers.enter([redirectToAllMine], {only: ["home"]});

  FlowRouter.subscriptions = function() {
    this.register('topicsToFollow', Meteor.subscribe('topicsToFollow'));
    this.register('userData', Meteor.subscribe('userData'));
  };

  FlowRouter.route('/', {
    name: 'home',
    action() {
      mount(LoginWithCtx);
    }
  });

  FlowRouter.route('/topics/:topicId', {
    name: 'postList',
    action({ topicId }) {
      mount(LayoutMainCtx, {
        content: (props) => <PostList topicId={topicId} {...props} />
      })
    }
  });

  FlowRouter.route('/all-mine', {
    name: 'all-mine',
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <PostList postListType={'ALL_MINE'} {...props} />
      })
    }
  });

  FlowRouter.route('/all', {
    name: 'all',
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <PostList postListType={'ALL'} {...props} />
      })
    }
  });


  FlowRouter.route('/choose-topics', {
    name: 'choose-topics',
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <TopicList {...props} {...props} />
      })
    }
  });

  FlowRouter.route('/topics/:topicId/:postId', {
    name: 'postDetails',
    action({ topicId, postId }) {
      mount(LayoutMainCtx, {
        content: (props) => <PostSingle topicId={topicId} postId={postId} {...props } />
      })
    }
  });

  FlowRouter.route('/postdetails', {
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <PostSingle {...props} />
      })
    }
  });

  FlowRouter.route('/invite/:inviteId', {
    name: 'invite',
    action({ inviteId }) {
      Accounts.callLoginMethod({
        methodArguments: [{ invite: inviteId }],
        userCallback: (err) => {
          if (err) {
            return FlowRouter.go('home');
          }

          FlowRouter.go('onboarding')
        }
      })
    }
  });

  FlowRouter.route('/welcome', {
    name: 'onboarding',
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <Onboarding {...props} isDirectMessage={false} />
      })
    }
  });

  FlowRouter.route('/users/tigerbot', {
    name: 'tigercub-directmessage',
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <Onboarding {...props} isDirectMessage={true} />
      })
    }
  });

  FlowRouter.route('/users/:postId', {
    name: 'directmessage',
    action({ postId }) {
      mount(LayoutMainCtx, {
        content: (props) => <PostSingle postId={postId} {...props} />
      })
    }
  });

  FlowRouter.route('/signup', {
    name: 'signup',
    action() {
      mount(SignupWithCtx);
    }
  })

  FlowRouter.route('/signed-up', {
    name: 'signup-done',
    action() {
      mount(SignupDoneWithCtx);
    }
  })

  FlowRouter.route('/x-directmessage', {
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <DirectMessage {...props} />
      })
    }
  });

  FlowRouter.route('/x-postlist', {
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <PostList topicId={'marketing'} {...props} />
      })
    }
  });

  Tracker.autorun(() => {
    const isInvite = /\/invite\/[0-9A-Za-z_-]+$/.test(window.location.href);
    const isSignup = /\/signup$/.test(window.location.href);
    const isSignupDone = /\/signed-up$/.test(window.location.href);

    if (!Meteor.userId() && !isInvite && !isSignup && !isSignupDone) {
      return FlowRouter.go('/');
    }

    if (Meteor.user() && Meteor.user().status === 'pending') {
      return FlowRouter.go('onboarding');
    }
  })
}
