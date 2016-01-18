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
  'comment/insert': (postId, commentText) => {
    console.log(postId, commentText);

    check(postId, String);
    check(commentText, String);

    const user = CurrentUser.get();
    Comments.insert({
      postId,
      commentText,
      ownerId: user._id,
    })
  },
})
