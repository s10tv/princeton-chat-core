import { check } from 'meteor/check'
import { Topics, Posts, Users } from '/lib/collections'
import { Meteor } from 'meteor/meteor'

export default class PostManager {

  static follow ({ user, postId }) {
    check(user, Object)
    check(postId, String)

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

  static unfollow ({ postId, user }) {
    check(user, Object)
    check(postId, String)

    const post = Posts.findOne(postId)

    if (!post) {
      return
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

  static delete ({ postId, user }) {
    check(postId, String)
    check(user, Object)

    const post = Posts.findOne(postId)

    if (!post) {
      throw new Meteor.Error(400, `No post found with id: ${postId}`)
    }

    if (post.ownerId !== user._id) {
      throw new Meteor.Error(400, 'You need to be the owner of the post to delete it')
    }

    try {
      // remove the post from followingPosts field in every user
      Users.find({
        _id: { $in: post.followers.map(follower => follower.userId) }
      }).forEach(user => {
        Users.update(user._id, {
          $pull: { followingPosts: post._id }
        })
      })

      Posts.remove({
        _id: post._id
      }, true)

      if (post.topicIds && post.topicIds[0]) {
        return `/topics/${post.topicIds[0]}`
      } else {
        return `/all-mine`
      }
    } catch (e) {
      console.log(e)
      throw new Meteor.Error(500, "Sorry, we messed up. We couldn't delete your post, but we tried very hard :/")
    }
  }
}
