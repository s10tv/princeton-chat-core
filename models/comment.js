Comments = new Mongo.Collection('comments');

CommentSchema = new SimpleSchema({
  ownerId: { type: String },
  postId: { type: String },
  content: { type: String },
});

this.Comments.attachBehaviour('timestampable');
this.Comments.attachSchema(CommentSchema);
