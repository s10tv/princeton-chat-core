import Inbox from '/client/modules/core/components/inbox.jsx'
import {useDeps, composeAll, composeWithTracker} from 'mantra-core'
import {processPost} from './post.list'
import {InboxCoverPhoto} from '/client/lib/unsplash.service.js'
import {processMessage} from './post.details.js'
import truncate from 'truncate'

function reasonExtended ({type, postTitle}) {
  postTitle = truncate(postTitle, 35)
  switch (type) {
    case 'newpost':
      return 'New post'
    case 'reply':
      return `New reply in ${postTitle}`
    case 'mention':
      return `You were mentioned in ${postTitle}`
  }
}

const composer = ({context, term}, onData) => {
  const {Meteor, Collections, UserService} = context()
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

        const processedPost = processPost(context(), post)
        return Object.assign({}, processedPost, {
          messages,
          _id: notification._id,
          notificationId: notification._id,
          reason: notification.reason,
          reasonExtended: reasonExtended({
            type: notification.reason,
            postTitle: processedPost.title
          })
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
  showUserProfile: actions.profile.showUserProfile,
  navigateToUrl: actions.global.navigateTo,
  context: () => context
})

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Inbox)
