import { Topics, Posts, Users, Messages } from '/imports/configs/collections'

Meteor.publish('topics', function() {
  if (this.userId) {
    return Topics.find()
  } else {
    this.ready();
  }
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {
      firstName: 1,
      lastName: 1,
      username: 1,
      avatar: 1,
      inviteCode: 1,
      emailPreference: 1,
      classYear: 1,
      classType: 1,
      info: 1,
      status: 1,
      followingTopics: 1,
      followingPosts: 1,
      tigerbotPostId: 1,
      'services.facebook.id': 1,
    }});
  } else {
    this.ready();
  }
});

Meteor.publish("usersData", function(tigerId) {
  if (this.userId) {
    check(tigerId, String);

    return Users.find({ _id: tigerId }, { fields: {
      firstName: 1,
      lastName: 1,
      avatar: 1,
      classYear: 1,
      classType: 1,
      info: 1,
      emails: 1
    }});
  } else {
    this.ready();
  }
});

Meteor.publishComposite('posts', function(topicId) {
  return {
    find: function() {
      check(topicId, Match.OneOf(null, String));

      var options = {}
      options.isDM = { $ne: true }; // don't get the direct messages

      if (topicId != null) {
        options.topicIds = topicId;
      }

      return Posts.find(options);
    },

    children: [
      {
        find: function(todo) {
          return Users.find({ _id: todo.ownerId });
        }
      }
    ]
  }
});

Meteor.publishComposite('messages', function(postId) {
  return {
    find: function() {
      check(postId, Match.Optional(String));
      return Posts.find({ _id: postId })

    },
    children: [
      {
        find: function(todo) {
          return Messages.find({ postId: postId })
        },

        children: [
          {
            find: function(comment) {
              return Users.find({ _id: comment.ownerId })
            }
          }
        ]
      },

      {
        find: function(todo) {
          return Users.find({ _id: todo.ownerId });
        }
      }
    ]
  }
});

Meteor.publishComposite('directMessages', function() {
  const myUserId = this.userId;
  if (myUserId) {
    return {
      find: function() {
        return Posts.find({
          isDM: true,
          'followers.userId': myUserId,
        });
      },

      children: [
        {
          find: function(post) {
            const otherUserIds = _.reject(post.followers, function(follower) {
              return follower.userId == myUserId;
            }).map(user => user.userId);

            return Users.find({ _id: { $in: otherUserIds } });
          }
        }
      ]
    }
  } else {
    this.ready();
  }
})

Meteor.publish('onboardingMessages', function() {
  if (this.userId) {
    const user = Users.findOne(this.userId);
    return [
      Users.find({ _id: 'system' }),
      Posts.find({ _id: user.tigerbotPostId}),
      Messages.find({ postId: user.tigerbotPostId }),
    ]
  } else {
    this.ready();
  }
});
