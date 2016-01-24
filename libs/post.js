Posts = new Mongo.Collection('posts');

PostSchema = new SimpleSchema({
  ownerId: { type: String },
  title: { type: String },
  content: { type: String },
  topicIds: { type: [String] }
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
