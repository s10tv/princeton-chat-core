export default class Notifier {
  constructor ({Collections}) {
    this.Collections = Collections
  }

  notifyMention ({ userId, postId }) {
    const {Notifications} = this.Collections
    Notifications.upsert({ postId: postId, ownerId: userId }, { $set: {
      postId,
      ownerId: userId,
      status: 'active',
      reason: 'mention'
    }})
  }
}
