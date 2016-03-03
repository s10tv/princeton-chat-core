export default class Notifier {
  constructor ({Collections}) {
    this.Collections = Collections
  }

  notifyMention ({ userId, postId, lastActionTimestamp }) {
    const {Notifications} = this.Collections
    Notifications.upsert({ postId: postId, ownerId: userId }, { $set: {
      postId,
      lastActionTimestamp,
      ownerId: userId,
      status: 'active',
      reason: 'mention'
    }})
  }
}
