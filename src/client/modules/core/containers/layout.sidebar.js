/*global confirm*/
import LayoutSidebar from '/src/client/modules/core/components/layout/layout.sidebar.jsx'
import UserService from '/src/lib/user.service.js'
import {useDeps, composeWithTracker, composeAll} from 'mantra-core'
import {isAdmin} from '/src/lib/admin'
import {_} from 'underscore'

export const composer = ({context}, onData) => {
  const {Meteor, Collections, FlowRouter} = context()
  if (Meteor.subscribe('topics').ready()) {
    const user = UserService.currentUser()

    const currentRouterPath = FlowRouter.current().path

    if (user) {
      const followedTopics = user ? Collections.Topics.find({
        _id: {$in: user.followingTopics}
      }, {sort: {createdAt: -1}}).fetch() : []

      const isFullAdmin = isAdmin(user)

      onData(null, {
        user,
        isFullAdmin,
        followedTopics,
        FlowRouter,
        currentRouterPath
      })
    }
  }
}

const confirmableActions = (actions) => ({
  showTopic: actions.topics.navigateToTopic,
  navigateTo: actions.topics.navigateTo,
  showAllTopics: actions.topics.navigateToTopicList,
  onTapSettings: actions.settings.navigateToSettings,
  onLogout: actions.settings.logout
})

const depsMapper = (context, actions) => {
  const c = {}
  _.each(confirmableActions(actions), (confirmableAction, key) => {
    c[key] = (args) => {
      if (!actions.posts.hasInteractedWithCreatePost(context)) {
        return confirmableAction(args)
      }

      if (confirm('Are you sure you want to leave the page?\nAll the effort you put into this post will be gone to waste. Forever.')) {
        return confirmableAction(args)
      }
    }
  })
  return {
    ...c,
    showAddPostPopupFn: actions.posts.showAddPostPopup,
    context: () => context
  }
}

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(LayoutSidebar)
