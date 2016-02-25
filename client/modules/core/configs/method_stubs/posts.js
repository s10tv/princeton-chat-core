export default function ({Meteor, Collections, UserService}) {
  const {Posts, Topics, Users} = Collections

  Meteor.methods({
    'post/insert' (_id, title, content, topicIds) {
      const createdAt = new Date()
      const ownerId = UserService.currentUser()._id

      const post = {
        _id, title, content, topicIds, ownerId, createdAt
      }
      Posts.insert(post)
    },

    'topic/follow' (topicId) {
      const user = UserService.currentUser()
      Users.update(user._id, { $addToSet: {
        followingTopics: topicId
      }})

      Topics.update(topicId, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }})
    },

    'topic/unfollow' (topicId) {
      const user = UserService.currentUser()
      Users.update(user._id, { $pull: {
        followingTopics: topicId
      }})

      Topics.update(topicId, { $pull: {
        followers: { userId: user._id }
      }})
    },

    'post/follow' (postId) {
      const user = UserService.currentUser()
      Users.update(user._id, { $addToSet: {
        followingPosts: postId
      }})

      Posts.update(postId, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }})
    },

    'post/unfollow' (postId) {
      const user = UserService.currentUser()
      Users.update(user._id, { $pull: {
        followingPosts: postId
      }})

      Posts.update(postId, { $pull: {
        followers: { userId: user._id }
      }})
    }
  })
}
