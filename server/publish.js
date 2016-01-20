Meteor.publish('publicLists', function() {
  if (this.userId) {
    return Lists.find()
  } else {
    this.ready();
  }
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {
      firstName: 1,
      lastName: 1,
      avatar: 1,
      emailPreference: 1,
      classYear: 1,
      classType: 1,
      info: 1,
      status: 1,
      followingTopics: 1,
      followingPosts: 1,
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

Meteor.publishComposite('todos', function(listId) {
  return {
    find: function() {
      check(listId, String);

      return Todos.find({ $or: [
        { listIds: listId },
      ]});
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

Meteor.publishComposite('comments', function(todoId) {
  return {
    find: function() {
      check(todoId, String);
      return Todos.find({ _id: todoId })

    },
    children: [
      {
        find: function(todo) {
          return Comments.find({ postId: todoId })
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

})

// Meteor.publish('onboardingMessages', function() {
//   if (this.userId) {
//     return Messages.find({ ownerId: this.userId })
//   } else {
//     this.ready();
//   }
// })
