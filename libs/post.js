Posts = new Mongo.Collection('posts');

PostSchema = new SimpleSchema({
  ownerId: { type: String },
  title: { type: String },
  content: { type: String },
  topicIds: { type: [String] }
});

Posts.attachBehaviour('timestampable');
Posts.attachSchema(PostSchema);

export default Posts;
