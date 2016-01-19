class CurrentUser {
  static get() {
    user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    return user;
  }
}

Meteor.methods({
  'emailPreference/update': (preference) => {
    user = CurrentUser.get()
    Users.update(user._id, { $set: {
      emailPreference: preference
    }})
  },

  'list/follow': (listId) => {
    user = CurrentUser.get();
    Users.update(user._id, { $addToSet: {
      followingTopics: listId
    }})
  },

  'list/unfollow': (listId) => {
    user = CurrentUser.get();
    Users.update(user._id, { $pull: {
      followingTopics: listId
    }})
  },

  'post/insert': (title, content, topicIds) => {
    user = CurrentUser.get()

    const fullTopics = topicIds.map(topicId => {
      return Lists.findOne(topicId);
    })

    return Todos.insert({
      title: title,
      content: content,
      ownerId: user._id,
      topics: fullTopics,
      listIds: topicIds,
    })
  },

  'comment/insert': (postId, commentText) => {
    console.log(postId, commentText);

    check(postId, String);
    check(commentText, String);

    const user = CurrentUser.get();
    Comments.insert({
      postId,
      content: commentText,
      ownerId: user._id,
    })
  },
})
