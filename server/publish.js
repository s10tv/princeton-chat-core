Meteor.publish('publicLists', function() {
  if (this.userId) {
    return Lists.find({userId: {$exists: false}});
  } else {
    this.ready();
  }
});

Meteor.publish('privateLists', function() {
  if (this.userId) {
    return Lists.find({userId: this.userId});
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
    }});
  } else {
    this.ready();
  }
});

Meteor.publish('todos', function(listId) {
  check(listId, String);

  return Todos.find({ $or: [
    { listId: listId },
    { listIds: listId },
  ]});
});

Meteor.publish('comments', function(todoId) {
  check(todoId, String);

  return [
    Comments.find({ postId: todoId }),
    Todos.find(todoId)
  ];
})
