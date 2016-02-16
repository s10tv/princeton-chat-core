import React from 'react'
import {mount} from 'react-mounter'

import LayoutMain from '/client/modules/core/components/layout/layout.jsx'
import PostList from '/client/modules/core/containers/post.list.js'
import PostDetails from '/client/modules/core/containers/post.details.js'
import TopicList from '/client/modules/core/containers/topic.list.js'
import GuestIndex from '/client/modules/guest/containers/guestIndex.js'
import AddFollowers from '/client/modules/core/containers/add.followers.js'
import ErrorPage from '/client/modules/core/components/error.jsx'
// This import has to be at the end for some reason else fails

export default function (injectDeps, {FlowRouter, Meteor, Accounts, Tracker}) {
  const LayoutMainCtx = injectDeps(LayoutMain)
  const GuestIndexCtx = injectDeps(GuestIndex)

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
        content: (props) => <TopicList isLoggedIn isTopicClickable {...props} />
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

  FlowRouter.notFound = {
    action () {
      mount(ErrorPage)
    }
  }

  Tracker.autorun(() => {
    // const isInvite = /\/invite\/[0-9A-Za-z_-]+$/.test(window.location.href)
    // const isSignupForm = /\/hello$/.test(window.location.href)
    // const isSignupPassword = /\account$/.test(window.location.href)
    // const isLogin = /\/login.+$/.test(window.location.href)
    // const isSignupDone = /\/signed-up$/.test(window.location.href)
    // const isGuestPath = /\/guest.+$/.test(window.location.href)
    //
    // const isPostsPath = /\/topics\/[0-9A-Za-z_-]+\/[0-9A-Za-z_-]+$/.test(window.location.href)
    // const isTopicsPath = /\/topics\/[0-9A-Za-z_-]+$/.test(window.location.href)
    //
    // if (!Meteor.userId() &&
    //     !isInvite &&
    //     !isSignupForm &&
    //     !isSignupPassword &&
    //     !isLogin &&
    //     !isGuestPath &&
    //     !isSignupDone) {
    //   let redirectPath = '/'
    //   if (isPostsPath || isTopicsPath) {
    //     redirectPath = `/login?ol=${encodeURIComponent(window.location.href)}`
    //   }
    //
    //   return FlowRouter.go(redirectPath)
    // }
    //
    // if (Meteor.user()) {
    //   if (Meteor.user().status === 'pending') {
    //     return FlowRouter.go('signupForm')
    //   }
    // }
  })
}
