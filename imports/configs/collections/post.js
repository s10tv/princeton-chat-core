// A post is either the start of a public thread, or represents a direct message relationship.

Posts = new Mongo.Collection('posts');

FollowerSchema = new SimpleSchema({
  userId: { type: String },
  unreadCount: { type: Number, defaultValue: 0 },
})

PostSchema = new SimpleSchema({
  content: { type: String },
  followers: { type: [FollowerSchema], defaultValue: [] },
  numMsgs: { type: Number, defaultValue: 0 }, // cache this so we don't have to count.

  // relevant for discussion posts
  ownerId: { type: String, optional: true },
  title: { type: String, optional: true},
  topicIds: { type: [String], optional: true},

  // relevant for direct messages
  isDM: { type: Boolean, optional: false, defaultValue: false },
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
