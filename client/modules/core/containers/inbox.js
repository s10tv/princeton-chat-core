import Inbox from '/client/modules/core/components/inbox.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import {processPost} from './post.list'
import {InboxCoverPhoto} from '/client/lib/unsplash.service.js'
import {processMessage} from './post.details.js'

const composer = ({context, term}, onData) => {
  const {Meteor, Collections, UserService, FlowRouter} = context()
  const {Notifications, Posts, Messages} = Collections

  if (Meteor.subscribe('inbox', term).ready()) {
    const currentUser = UserService.currentUser()
    const notifications = Notifications
      .find({}, {sort: { createdAt: -1 }})
      .map((notification) => {
        const post = Posts.findOne(notification.postId)

        const messages = Messages
          .find({ postId: post._id, createdAt: {$gte: notification.lastActionTimestamp} })
          .map((message) => processMessage(context(), message))

        return Object.assign(processPost(context(), post), {
          messages,
          _id: notification._id,
          notificationId: notification._id,
          reason: notification.reason
        })
      })
    console.log(notifications)
    onData(null, {
      notifications,
      currentUser,
      topic: {
        displayName: 'My Inbox',
        cover: InboxCoverPhoto,
        followers: []
      },
      navigateToUrl: (url) => FlowRouter.go(url)
    })
  }
}

const depsMapper = (context, actions) => ({
  archiveInboxItem: actions.inbox.archive,
  showUserProfile: actions.profile.showUserProfile,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Inbox)
