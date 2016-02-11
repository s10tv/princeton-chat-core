import React from 'react'
import {mount} from 'react-mounter'

import LayoutMain from '/client/modules/core/components/layout/layout.jsx'
import PostList from '/client/modules/core/containers/post.list.js'
import PostDetails from '/client/modules/core/containers/post.details.js'
import TopicList from '/client/modules/core/containers/topic.list.js'
import SignupForm from '/client/modules/core/containers/signup.form.js'
import Signup from '/client/modules/core/containers/signup.js'
import SignupDone from '/client/modules/core/containers/signup.done.js'
import Login from '/client/modules/core/containers/login.js'
import GuestIndex from '/client/modules/guest/containers/guestIndex.js'
import AddFollowers from '/client/modules/core/containers/add.followers.js'

// This import has to be at the end for some reason else fails
import WebFontLoader from 'webfontloader'

export default function (injectDeps, {FlowRouter, Meteor, Accounts, Tracker}) {
  WebFontLoader.load({
    google: {
      families: [
        'Lato:300,400,700',
        'Quicksand'  // for ped & play home page
      ]
    }
  })

  const LayoutMainCtx = injectDeps(LayoutMain)
  const LoginWithCtx = injectDeps(Login)
  const SignupWithCtx = injectDeps(Signup)
  const SignupDoneWithCtx = injectDeps(SignupDone)
  const GuestIndexCtx = injectDeps(GuestIndex)

  function redirectToAllMine (context) {
    if (Meteor.userId()) {
      return FlowRouter.go('all-mine')
    }
  }
  // logged in users should be redirected to all-mine when they visit '/'
  FlowRouter.triggers.enter([redirectToAllMine], {only: ['signup']})

  FlowRouter.route('/', {
    name: 'signup',
    action () {
      mount(SignupWithCtx)
    }
  })

  FlowRouter.route('/guest', {
    name: 'guest',
    action (params, { userId, hash }) {
      Accounts.callLoginMethod({
        methodArguments: [{guest: { userId, hash }}],
        userCallback: (err) => {
          if (err) {
            return FlowRouter.go('/login')
          }

          mount(GuestIndexCtx)
        }
      })
    }
  })

  FlowRouter.route('/signed-up', {
    name: 'signup-done',
    action () {
      mount(SignupDoneWithCtx)
    }
  })

  FlowRouter.route('/login', {
    name: 'login',
    action () {
      mount(LoginWithCtx)
    }
  })

  FlowRouter.route('/invite/:inviteId', {
    name: 'invite',
    action ({ inviteId }) {
      Accounts.callLoginMethod({
        methodArguments: [{ invite: inviteId }],
        userCallback: (err) => {
          if (err) {
            return FlowRouter.go('login')
          }

          FlowRouter.go('signupForm')
        }
      })
    }
  })

  FlowRouter.route('/hello', {
    name: 'signupForm',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(LayoutMainCtx, {
        content: (props) => <SignupForm {...props} />
      })
    }
  })

  // Paths below needs auth

  FlowRouter.route('/topics/:topicId', {
    name: 'postList',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action ({ topicId }) {
      mount(LayoutMainCtx, {
        content: (props) => <PostList topicId={topicId} {...props} />
      })
    }
  })

  FlowRouter.route('/all-mine', {
    name: 'all-mine',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(LayoutMainCtx, {
        content: (props) => <PostList postListType={'ALL_MINE'} {...props} />
      })
    }
  })

  FlowRouter.route('/all', {
    name: 'all',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(LayoutMainCtx, {
        content: (props) => <PostList postListType={'ALL'} {...props} />
      })
    }
  })

  FlowRouter.route('/choose-topics', {
    name: 'choose-topics',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action () {
      mount(LayoutMainCtx, {
        content: (props) => <TopicList {...props} {...props} />
      })
    }
  })

  FlowRouter.route('/add-followers/:topicId', {
    name: 'add-followers',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action ({ topicId }) {
      mount(LayoutMainCtx, {
        content: (props) => <AddFollowers topicId={topicId} {...props} />
      })
    }
  })

  FlowRouter.route('/topics/:topicId/:postId', {
    name: 'postDetails',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    action ({ topicId, postId }) {
      mount(LayoutMainCtx, {
        content: (props) => <PostDetails topicId={topicId} postId={postId} {...props } />
      })
    }
  })

  Tracker.autorun(() => {
    const isInvite = /\/invite\/[0-9A-Za-z_-]+$/.test(window.location.href)
    const isSignupForm = /\/hello$/.test(window.location.href)
    const isSignupPassword = /\account$/.test(window.location.href)
    const isLogin = /\/login.+$/.test(window.location.href)
    const isSignupDone = /\/signed-up$/.test(window.location.href)
    const isGuestPath = /\/guest.+$/.test(window.location.href)

    const isPostsPath = /\/topics\/[0-9A-Za-z_-]+\/[0-9A-Za-z_-]+$/.test(window.location.href)
    const isTopicsPath = /\/topics\/[0-9A-Za-z_-]+$/.test(window.location.href)

    if (!Meteor.userId() &&
        !isInvite &&
        !isSignupForm &&
        !isSignupPassword &&
        !isLogin &&
        !isGuestPath &&
        !isSignupDone) {
      let redirectPath = '/'
      if (isPostsPath || isTopicsPath) {
        redirectPath = `/login?ol=${encodeURIComponent(window.location.href)}`
      }

      return FlowRouter.go(redirectPath)
    }

    if (Meteor.user()) {
      if (Meteor.user().status === 'pending') {
        return FlowRouter.go('signupForm')
      }
    }
  })
}
