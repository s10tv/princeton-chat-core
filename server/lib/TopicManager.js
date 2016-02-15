import { check } from 'meteor/check'
import { Topics, Users } from '/lib/collections'
import { Meteor } from 'meteor/meteor'

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

  static remove ({ topicId, user }) {
    const topic = Topics.findOne(topicId)

    if (!topic) {
      throw new Meteor.Error(400, 'Seems like you are trying to remove an invalid topic')
    }

    if (topic.ownerId !== user._id) {
      throw new Meteor.Error(400, 'You are not authorized to remove a topic that you do not own')
    }

    // remove the reference to the topic in every user that used to follow it
    Users.find({
      followingTopics: topicId
    }).forEach(user => {
      Users.update(user._id, {
        $pull: { followingTopics: topic._id }
      })
    })

    return Topics.remove(topic._id)
  }
}
