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
import Inbox from '/client/modules/core/containers/inbox'

// This import has to be at the end for some reason else fails

function requireUserInSession (context) {
  if (!this.Meteor.userId()) {
    return this.FlowRouter.go('onboarding-login', {}, {
      ol: encodeURIComponent(context.path)
    })
  }
}

export default function (injectDeps, {FlowRouter, Meteor}) {
  const requireUserInSessionFn = requireUserInSession.bind({ Meteor, FlowRouter })
  const LayoutMainCtx = injectDeps(LayoutMain)

  FlowRouter.route('/guest', {
    name: 'guest',
    action () {
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
    action ({ postId }) {
      mount(injectDeps(ToggleFollowing), {
        postId
      })
    }
  })
}
