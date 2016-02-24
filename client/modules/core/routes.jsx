import React from 'react'
import {mount} from 'react-mounter'

import LayoutMain from '/client/modules/core/containers/layout.js'
import PostList from '/client/modules/core/containers/post.list.js'
import PostDetails from '/client/modules/core/containers/post.details.js'
import TopicList from '/client/modules/core/containers/topic.list.js'
import Settings from '/client/modules/core/containers/settings.js'
import AddFollowers from '/client/modules/core/containers/add.followers.js'
import DirectorySearch from '/client/modules/core/containers/directory.search'
import ErrorPage from '/client/modules/core/components/error.jsx'
// This import has to be at the end for some reason else fails

function requireUserInSession (context) {
  if (!this.Meteor.userId()) {
    return this.FlowRouter.go('onboarding-login', {}, {
      ol: encodeURIComponent(context.path)
    })
  }
}

export default function (injectDeps, {FlowRouter, Meteor, Accounts, Tracker}) {
  const requireUserInSessionFn = requireUserInSession.bind({ Meteor, FlowRouter })
  const LayoutMainCtx = injectDeps(LayoutMain)

  FlowRouter.route('/guest', {
    name: 'guest',
    action (params) {
      if (Meteor.user()) {
        FlowRouter.go('choose-topics')
      } else {
        FlowRouter.go('onboarding-login')
      }
    }
  })

  // Paths below needs auth

  FlowRouter.route('/topics/:topicId', {
    name: 'postList',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action ({ topicId }) {
      mount(LayoutMainCtx, {
        content: (props) => <PostList topicId={topicId} {...props} />
      })
    }
  })

  FlowRouter.route('/settings', {
    name: 'settings',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action () {
      mount(LayoutMainCtx, {
        content: (props) => <Settings {...props} />
      })
    }
  })

  FlowRouter.route('/all-mine', {
    name: 'all-mine',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action () {
      mount(LayoutMainCtx, {
        content: (props) => <PostList postListType={'ALL_MINE'} {...props} />
      })
    }
  })

  FlowRouter.route('/search', {
    name: 'search',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action (args, {term}) {
      mount(LayoutMainCtx, {
        content: (props) => <PostList postListType='SEARCH' term={term} {...props} />
      })
    }
  })

  FlowRouter.route('/directory-search', {
    name: 'directory-search',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action (args, {term}) {
      mount(LayoutMainCtx, {
        content: (props) => <DirectorySearch term={term} {...props} />
      })
    }
  })

  FlowRouter.route('/all', {
    name: 'all',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
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
    triggersEnter: [requireUserInSessionFn],
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
    triggersEnter: [requireUserInSessionFn],
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
    triggersEnter: [requireUserInSessionFn],
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
