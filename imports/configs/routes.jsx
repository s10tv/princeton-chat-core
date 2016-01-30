import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import LayoutMain from '../modules/core/components-refactor/layout.jsx'
import PostList from '../modules/core/containers/post.list.js'
import PostSingle from '../modules/core/containers/post.details.js'
import DirectMessage from '../modules/core/components-refactor/directMessage.jsx'
import TopicList from '../modules/core/containers/topic.list.js'
import Onboarding from '../modules/core/containers/onboarding.js'
import OnboardingOverlay from '../modules/core/containers/onboarding.overlay.js'

import Login from '../modules/core/containers/login.js'

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
  const OnboardingOverlayCtx = injectDeps(OnboardingOverlay);

  FlowRouter.triggers.enter([requireLogin], {except: ["home", "invite" ]});
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
        content: (props) => <Onboarding {...props} />
      })
    }
  });

  FlowRouter.route('/users/tigerbot', {
    name: 'tigercub-directmessage',
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <Onboarding {...props} />
      })
    }
  });

  FlowRouter.route('/users/:postId', {
    name: 'directmessage',
    action({ postId }) {
      mount(LayoutMainCtx, {
        content: (props) => <PostSingle postId={postId} />
      })
    }
  });

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
    if (!Meteor.userId() && !/\/invite\/[0-9A-Za-z_-]+$/.test(window.location.href)) {
      return FlowRouter.go('/');
    }

    if (Meteor.user() && Meteor.user().status === 'pending') {
      return FlowRouter.go('onboarding');
    }
  })
}
