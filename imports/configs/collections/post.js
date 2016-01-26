// A post is either the start of a public thread, or represents a direct message relationship.

Posts = new Mongo.Collection('posts');

FollowerSchema = new SimpleSchema({
  userId: { type: String },
  unreadCount: { type: Number, defaultValue: 0 },
})

PostSchema = new SimpleSchema({
  ownerId: { type: String },
  content: { type: String },
  followers: { type: [FollowerSchema], defaultValue: [] },

  // relevant for discussion posts
  title: { type: String, optional: true},
  topicIds: { type: [String], optional: true},
});

Posts.attachBehaviour('timestampable');
Posts.attachSchema(PostSchema);

Posts.allow({
  insert: function (userId, doc) {
    const noExtraFields = _.without(_.keys(doc), 'ownerId', 'title', 'content', 'topicIds').length === 0;
    const isMyDoc = (userId == doc.ownerId);

    return isMyDoc && noExtraFields;
  }
})

export default Posts;
