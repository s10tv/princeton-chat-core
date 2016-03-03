import Inbox from '/client/modules/core/components/inbox.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import {processPost} from './post.list'
import {InboxCoverPhoto} from '/client/lib/unsplash.service.js'

const composer = ({context, term}, onData) => {
  const {Meteor, Collections, UserService} = context()
  const {Notifications, Posts, Users, Messages} = Collections

  if (Meteor.subscribe('inbox', term).ready()) {
    const currentUser = UserService.currentUser()
    const notifications = Notifications
      .find({}, {sort: { createdAt: -1 }})
      .map((notification) => {
        const post = Posts.findOne(notification.postId)
        const messages = Messages
          .find({ postId: post._id, createdAt: {$gte: notification.lastMessageTime} })
          .map((message) => (
            Object.assign(message, {
              owner: UserService.getUserView(Users.findOne(message.ownerId))
            })
          ))

        return Object.assign(processPost(context(), post), {
          messages,
          showPostDetails: !notification.lastMessageTime,
          _id: notification._id,
          notificationId: notification._id
        })
      })

    onData(null, {
      notifications,
      currentUser,
      topic: {
        displayName: 'My Inbox',
        cover: InboxCoverPhoto,
        followers: []
      }
    })
  }
}

const depsMapper = (context, actions) => ({
  archiveInboxItem: actions.inbox.archive,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Inbox)
