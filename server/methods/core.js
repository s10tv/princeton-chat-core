
export default function (context) {

  const {currentUser, Meteor, Collections, PostManager, TopicManager, check} = context
  const {Topics, Posts, Messages, Users} = Collections

  Meteor.methods({
    'post/insert': (_id, title, content, topicIds) => {
      check(_id, String)
      check(title, String)
      check(content, String)
      check(topicIds, [String])

      const user = currentUser()

      try {
        title = title.trim()
        content = content.trim()
      } catch (e) {
        throw new Meteor.Error(400, 'Every post needs to have a title and content.')
      }

      if (title.length === 0 || content.length === 0) {
        throw new Meteor.Error(400, 'Every post needs to have a title and content.')
      }

      // make sure that the topic ids entered are legit
      const filteredTopicIds = topicIds.filter((topicId) => {
        return Topics.findOne(topicId) !== undefined
      })

      if (filteredTopicIds.length === 0) {
        throw new Meteor.Error(400, 'Please enter at least one valid topicId.')
      }

      // We are good to insert the post.
      const postId = Posts.insert({
        _id,
        title,
        content,
        ownerId: user._id,
        topicIds: filteredTopicIds,
        followers: [{
          userId: user._id,
          unreadCount: 0
        }],
        numMsgs: 0
      })

      // The current user follows the current post they just posted
      Meteor.call('post/follow', postId)

      // update the num posts after posting.
      filteredTopicIds.forEach(topicId => {
        Topics.update(topicId, { $set: {
          numPosts: Posts.find({isDM: { $ne: true }, topicIds: topicId}).count()
        }})
      })

      if (process.env.IRON_MQ_TOKEN && process.env.IRON_MQ_PROJECT_ID) {
        new IronMQ('web-post').send({
          payload: { postId }
        })
      }
    },

    'topic/follow': (topicId) => {
      check(topicId, String)
      check(currentUser(), Object)

      try {
        TopicManager.follow({topicId, user: currentUser()})
      } catch (err) {
        throw new Meteor.Error(500, 'There was a problem with subscribing to this channel.')
      }
    },

    'topic/unfollow': (topicId) => {
      check(topicId, String)
      check(currentUser(), Object)

      try {
        TopicManager.unfollow({topicId, user: currentUser()})
      } catch (err) {
        throw new Meteor.Error(500, 'There was a problem with unsubscribing to this channel.')
      }
    },

    'topic/removeFollower': (topicId, userId) => {
      check(topicId, String)
      check(userId, String)
      check(currentUser(), Object)

      try {
        TopicManager.unfollow({topicId, user: {_id: userId}})
      } catch (err) {
        throw new Meteor.Error(500, 'There was a problem removing follower.')
      }
    },

    'topic/remove': (topicId) => {
      check(topicId, String)
      const user = currentUser()
      const topic = Topics.findOne(topicId)

      if (!topic) {
        throw new Meteor.Error(400, 'Seems like you are trying to remove an invalid topic')
      }

      if (topic.ownerId !== user._id) {
        throw new Meteor.Error(400, 'You are not authorized to remove a topic that you do not own')
      }

      TopicManager.remove({ topicId, user })
    },

    'topic/create': (topicInfo) => {
      check(topicInfo, Object)
      const user = currentUser()

      if (!topicInfo.name) {
        throw new Meteor.Error(400, 'The topic needs to have a name.')
      }

      if (!topicInfo.description) {
        throw new Meteor.Error(400, 'The topic needs to have a description.')
      }

      if (!topicInfo.cover && !topicInfo.cover.url) {
        throw new Meteor.Error(400, 'The topic needs to have a cover photo.')
      }

      const topicNameError = NewTopicService.validateTopicName(topicInfo.name)
      if (topicNameError.reason) {
        throw new Meteor.Error(400, 'The topic name you entered has an error. Please check.')
      }

      const topicDescriptionError = NewTopicService.validateTopicDescription(topicInfo.description)
      if (topicDescriptionError.reason) {
        throw new Meteor.Error(400, 'The topic description you entered has an error. Please check.')
      }

      const topicId = topicInfo.name.toLowerCase()
      if (Topics.findOne(topicId)) {
        throw new Meteor.Error(400, `Topic "${topicInfo.name}" already exists.`)
      }

      Topics.insert({
        _id: topicId,
        displayName: UserService.capitalizeFirstLetter(topicInfo.name),
        description: topicInfo.description,
        followers: [],
        numPosts: 0,
        ownerId: user._id,
        cover: {
          url: topicInfo.cover.url
        }
      })

      Meteor.call('topic/follow', topicId)
      return topicId
    },

    'post/follow': (postId) => {
      check(postId, String)
      PostManager.follow({postId, user: currentUser()})
    },

    'post/unfollow': (postId) => {
      check(postId, String)
      PostManager.unfollow({postId, user: currentUser()})
    },

    'post/delete': (postId) => {
      check(postId, String)
      return PostManager.delete({postId, user: currentUser()})
    },

    'messages/insert': (_id, postId, commentText) => {
      check(_id, String)
      check(postId, String)
      check(commentText, String)

      const user = currentUser()
      Messages.insert({
        _id,
        postId,
        content: commentText,
        ownerId: user._id
      })

      if (process.env.IRON_MQ_TOKEN && process.env.IRON_MQ_PROJECT_ID) {
        new IronMQ('web-message').send({
          payload: { messageId: _id }
        })
      }

      Posts.update(postId, {$inc: { numMsgs: 1 }})
    },

    'messages/delete': _id => {
      check(_id, String)

      const user = currentUser()
      const message = Messages.findOne(_id)
      if (message.ownerId !== user._id) {
        throw new Meteor.Error('You can only delete your own messages')
      }
      Messages.remove({_id: _id})
    },

    'get/followers': (userIds) => {
      check(userIds, Array)
      check(currentUser(), Object)

      return userIds.map(user => {
        return Users.findOne(user.userId)
      }).filter((user) => user !== undefined)
    }
  })
}