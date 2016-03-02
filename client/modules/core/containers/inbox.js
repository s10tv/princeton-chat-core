import Inbox from '/client/modules/core/components/inbox.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import {processPost} from './post.list'
import {InboxCoverPhoto} from '/client/lib/unsplash.service.js'

const composer = ({context, term}, onData) => {
  const {Meteor, Collections, UserService} = context()
  const {Notifications, Posts, Users} = Collections

  if (Meteor.subscribe('inbox', term).ready()) {
    const currentUser = UserService.currentUser()
    const posts = Notifications
      .find({}, {sort: { createdAt: -1 }})
      .map((notification) => {
        const post = Posts.findOne(notification.postId)
        const rawMessage = Collections.Messages.findOne({ postId: post._id })
        const message = rawMessage
          ? Object.assign(rawMessage, {
            owner: UserService.getUserView(Users.findOne(rawMessage.ownerId))
          })
          : {}

        return Object.assign(processPost(context(), post), {
          message,
          notificationId: notification._id
        })
      })

    onData(null, {
      posts,
      currentUser,
      topic: {
        displayName: 'Inbox',
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
