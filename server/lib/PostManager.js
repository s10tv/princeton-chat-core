export default class PostManager {

  constructor ({Meteor, Collections}) {
    this.Meteor = Meteor
    this.Collections = Collections
  }

  follow ({user, postId}) {
    const {Topics, Posts, Users} = this.Collections
    const post = Posts.findOne(postId)

    if (!post) {
      return
    }

    Users.update(user._id, { $addToSet: {
      followingPosts: post._id
    }})

    if (post.followers.filter((follower) => follower.userId === user._id).length === 0) {
      Posts.update(post._id, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }})
    }

    post.topicIds.forEach((topicId) => {
      Topics.update(topicId, { $set: {
        numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId }).count()
      }})
    })
  }

  unfollow ({postId, user}) {
    const {Topics, Posts, Users} = this.Collections
    const post = Posts.findOne(postId)

    if (!post || !user) {
      throw new this.Meteor.Error(400, 'Could not unfollow the post because the post ' +
        'was not found, or the user was accidentally logged out')
    }

    Users.update(user._id, { $pull: {
      followingPosts: post._id
    }})

    Posts.update(post._id, { $pull: {
      followers: { userId: user._id }
    }})

    post.topicIds.forEach((topicId) => {
      Topics.update(topicId, { $set: {
        numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId }).count()
      }})
    })
  }

  delete ({postId, user}) {
    const {Posts, Users} = this.Collections
    const post = Posts.findOne(postId)

    if (!post || !user) {
      throw new this.Meteor.Error(400, 'Could not remove the post because the post ' +
        'was not found, or the user was accidentally logged out')
    }

    if (post.ownerId !== user._id) {
      throw new this.Meteor.Error(400, 'You need to be the owner of the post to delete it')
    }

    // remove the post from followingPosts field in every user
    Users.find({
      _id: { $in: post.followers.map(follower => follower.userId) }
    }).forEach(user => {
      Users.update(user._id, {
        $pull: { followingPosts: post._id }
      })
    })

    Posts.remove(post._id)

    if (post.topicIds && post.topicIds[0]) {
      return `/topics/${post.topicIds[0]}`
    } else {
      return `/all-mine`
    }
  }
}
