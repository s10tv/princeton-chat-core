import { Topics, Posts, Users} from '/imports/configs/collections';

export default class PostManager {

  static follow({ user, post }) {
    check(user, Object);
    check(post, Object);

    if (!post) {
      return;
    }

    Users.update(user._id, { $addToSet: {
      followingPosts: post._id,
    }});


    if (post.followers.filter(follower => follower.userId == user._id).length == 0) {
      Posts.update(post._id, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }});
    }

    post.topicIds.forEach(topicId => {
      Topics.update(topicId, { $set: {
        numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId }).count()
      }});
    });
  }

  static unfollow({ post, user }) {
    check(post, Object);
    check(user, Object);

    if (!post) {
      return;
    }

    Users.update(user._id, { $pull: {
      followingPosts: post._id,
    }});

    Posts.update(post._id, { $pull: {
      followers: { userId: user._id }
    }});

    post.topicIds.forEach(topicId => {
      Topics.update(topicId, { $set: {
        numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId }).count()
      }});
    });
  }
}
