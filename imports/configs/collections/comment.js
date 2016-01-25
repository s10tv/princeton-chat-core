Comments = new Mongo.Collection('comments');

CommentSchema = new SimpleSchema({
  ownerId: { type: String },
  postId: { type: String },
  content: { type: String },
});

Comments.attachBehaviour('timestampable');
Comments.attachSchema(CommentSchema);

export default Comments;
