import { Topics, Posts, Users } from '/libs/collections'

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
      isOnboardingDone: 1,
      'services.facebook.id': 1,
      'services.instagram.id': 1,
      'services.instagram.profile_picture': 1,
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
      if (topicId != null) {
        options = { topicIds: topicId };
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

Meteor.publishComposite('comments', function(postId) {
  return {
    find: function() {
      check(postId, Match.Optional(String));
      return Posts.find({ _id: postId })

    },
    children: [
      {
        find: function(todo) {
          return Comments.find({ postId: postId })
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

Meteor.publishComposite('topicsToFollow', function() {
  return {
    find: function() {
      return TopicHeaders.find({});
    },
    children: [
      {
        find: function(topicHeader) {
          return Topics.find({ _id: {
            $in: topicHeader.topicIds
          }});
        }
      }
    ]
  }
});

// Meteor.publish('onboardingMessages', function() {
//   if (this.userId) {
//     return Messages.find({ ownerId: this.userId })
//   } else {
//     this.ready();
//   }
// })
