export default class TopicManager {

  constructor ({Meteor, Collections}) {
    this.Meteor = Meteor
    this.Collections = Collections
  }

  follow ({ topicId, user }) {
    const {Topics, Users, AmaPosts} = this.Collections

    Users.update(user._id, { $addToSet: {
      followingTopics: topicId
    }})

    const topic = Topics.findOne(topicId)
    if (topic.followers.filter((follower) => follower.userId === user._id).length === 0) {
      Topics.update(topicId, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }})
    }

    if (topic.type === 'ama') {
      const post = AmaPosts.findOne(topic._id)
      if (post) {
        AmaPosts.update(post._id, {$addToSet: {
          participants: { userId: user._id, unreadCount: 0 }
        }})
      }
    }
  }

  unfollow ({ topicId, user }) {
    const {Topics, Users, AmaPosts} = this.Collections
    Users.update(user._id, { $pull: {
      followingTopics: topicId
    }})

    Topics.update(topicId, { $pull: {
      followers: { userId: user._id }
    }})

    const topic = Topics.findOne(topicId)
    if (topic.type === 'ama') {
      const post = AmaPosts.findOne(topic._id)
      if (post) {
        AmaPosts.update(post._id, {$pull: {
          participants: {
            userId: user._id
          }
        }})
      }
    }
  }

  remove ({ topicId, user }) {
    const {Topics, Users} = this.Collections
    const topic = Topics.findOne(topicId)

    if (!topic) {
      throw new this.Meteor.Error(400, 'Seems like you are trying to remove an invalid topic')
    }

    if (topic.ownerId !== user._id) {
      throw new this.Meteor.Error(400, 'You are not authorized to remove a topic that you do not own')
    }

    // remove the reference to the topic in every user that used to follow it
    Users.find({
      followingTopics: topicId
    }).forEach((user) => {
      Users.update(user._id, {
        $pull: { followingTopics: topic._id }
      })
    })

    return Topics.remove(topic._id)
  }
}
