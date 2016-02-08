import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';

import LayoutMain from '/imports/modules/core/components/layout/layout.jsx'
import PostList from '/imports/modules/core/containers/post.list.js'
import PostDetails from '/imports/modules/core/containers/post.details.js'
import DirectMessage from '/imports/modules/core/components/directMessage.jsx'
import TopicList from '/imports/modules/core/containers/topic.list.js'
import Onboarding from '/imports/modules/core/containers/onboarding.js'
import SignupForm from '/imports/modules/core/containers/signup.form.js';
import Signup from '/imports/modules/core/containers/signup.js'
import SignupDone from '/imports/modules/core/containers/signup.done.js'
import Login from '/imports/modules/core/containers/login.js'
import GuestIndex from '/imports/modules/guest/containers/guestIndex.js'
import AddFollowers from '/imports/modules/core/containers/addfollowers.js'
import WebFontLoader from 'webfontloader';

function redirectToAllMine(context) {
  if (Meteor.userId()) {
    return FlowRouter.go('all-mine');
  }
}

export default function (injectDeps) {
  WebFontLoader.load({
    google: {
      families: ['Lato']
    }
  });
  const LayoutMainCtx = injectDeps(LayoutMain);
  const LoginWithCtx = injectDeps(Login);
  const SignupWithCtx = injectDeps(Signup);
  const SignupDoneWithCtx = injectDeps(SignupDone);
  const GuestIndexCtx = injectDeps(GuestIndex)

  // logged in users should be redirected to all-mine when they visit '/'
  FlowRouter.triggers.enter([redirectToAllMine], {only: ["home"]});

  FlowRouter.subscriptions = function() {
    this.register('userData', Meteor.subscribe('userData'));
  };
  FlowRouter.route('/', {
    name: 'signup',
    action() {
      mount(SignupWithCtx);
    }
  })
  FlowRouter.route('/guest', {
    name: 'guest',
    action({ userId }, { userId, hash }) {
      Accounts.callLoginMethod({
        methodArguments: [{ guest: { userId, hash }}],
        userCallback: (err) => {
          if (err) {
            console.log(err);
            // return FlowRouter.go('/login')
          }

          mount(GuestIndexCtx)
        }
      })
    }
  })
  FlowRouter.route('/signed-up', {
    name: 'signup-done',
    action() {
      mount(SignupDoneWithCtx);
    }
  })

  FlowRouter.route('/login', {
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

  FlowRouter.route('/add-followers/:topicId', {
    name: 'add-followers',
    action({ topicId }) {
      mount(LayoutMainCtx, {
        content: (props) => <AddFollowers topicId={topicId} {...props} />
      })
    }
  });

  FlowRouter.route('/topics/:topicId/:postId', {
    name: 'postDetails',
    action({ topicId, postId }) {
      mount(LayoutMainCtx, {
        content: (props) => <PostDetails topicId={topicId} postId={postId} {...props } />
      })
    }
  });

  FlowRouter.route('/postdetails', {
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <PostDetails {...props} />
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

          FlowRouter.go('signupForm')
        }
      })
    }
  });

  FlowRouter.route('/hello', {
    name: 'signupForm',
    action() {
      mount(LayoutMainCtx, {
        content: (props) => <SignupForm {...props} />
      });
    }
  })

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
        content: (props) => <PostDetails postId={postId} {...props} />
      })
    }
  });

  Tracker.autorun(() => {
    const isInvite = /\/invite\/[0-9A-Za-z_-]+$/.test(window.location.href);
    const isSignupForm = /\/hello$/.test(window.location.href);
    const isSignupPassword = /\account$/.test(window.location.href);
    const isLogin = /\/login.+$/.test(window.location.href);
    const isSignupDone = /\/signed-up$/.test(window.location.href);
    const isGuestPath = /\/guest.+$/.test(window.location.href);

    const isPostsPath = /\/topics\/[0-9A-Za-z_-]+\/[0-9A-Za-z_-]+$/.test(window.location.href);
    const isTopicsPath = /\/topics\/[0-9A-Za-z_-]+$/.test(window.location.href);

    if (!Meteor.userId() &&
        !isInvite &&
        !isSignupForm &&
        !isSignupPassword &&
        !isLogin &&
        !isGuestPath &&
        !isSignupDone) {

      let redirectPath = '/';
      if (isPostsPath || isTopicsPath) {
        redirectPath = `/login?ol=${encodeURIComponent(window.location.href)}`
      }

      return FlowRouter.go(redirectPath);
    }

    if (Meteor.user()) {
      if (Meteor.user().status === 'pending') {
        return FlowRouter.go('signupForm');
      }
    }
  })
}
