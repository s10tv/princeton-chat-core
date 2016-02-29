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
import ToggleFollowing from '/client/modules/core/containers/toggleFollowing'
import CreateNewPost from '/client/modules/core/containers/post.create'

// This import has to be at the end for some reason else fails

function requireUserInSession (context) {
  if (!this.Meteor.userId()) {
    return this.FlowRouter.go('onboarding-login', {}, {
      ol: encodeURIComponent(context.path)
    })
  }
}

export default function (injectDeps, {FlowRouter, Collections, Meteor, Accounts, Tracker,
  sweetalert, store}) {
  const requireUserInSessionFn = requireUserInSession.bind({ Meteor, FlowRouter })
  const LayoutMainCtx = injectDeps(LayoutMain)

  FlowRouter.route('/guest', {
    name: 'guest',
    action (params) {
      if (Meteor.userId()) {
        FlowRouter.go('choose-topics')
      } else {
        FlowRouter.go('onboarding-login')
      }
    }
  })

  FlowRouter.route('/guest/posts/:postId/:action', {
    name: 'follow-unfollow-post-from-email',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action ({ postId, action }) {
      mount(injectDeps(ToggleFollowing), {
        postId
      })
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
        content: (props) => <PostDetails topicId={topicId} postId={postId} {...props} />
      })
    }
  })

  FlowRouter.route('/add-post', {
    name: 'add-post',
    subscriptions: function () {
      this.register('userData', Meteor.subscribe('userData'))
    },
    triggersEnter: [requireUserInSessionFn],
    action () {
      mount(LayoutMainCtx, {
        content: (props) => <CreateNewPost {...props} />
      })
    }
  })

  FlowRouter.notFound = {
    action () {
      mount(ErrorPage)
    }
  }
}
