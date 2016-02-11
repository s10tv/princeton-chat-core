import { check } from 'meteor/check'
import { Topics, Users } from '/lib/collections'

export default class TopicManager {
  static follow ({ topicId, user }) {
    check(topicId, String)
    check(user, Object)

    Users.update(user._id, { $addToSet: {
      followingTopics: topicId
    }})

    const topic = Topics.findOne(topicId)
    if (topic.followers.filter((follower) => follower.userId === user._id).length === 0) {
      Topics.update(topicId, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }})
    }
  }

  static unfollow ({ topicId, user }) {
    Users.update(user._id, { $pull: {
      followingTopics: topicId
    }})

    Topics.update(topicId, { $pull: {
      followers: { userId: user._id }
    }})
  }
}
