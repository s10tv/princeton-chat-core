Messages = new Mongo.Collection('messages');

CommentSchema = new SimpleSchema({
  ownerId: { type: String },
  postId: { type: String }, // post id or direct message thread id.
  content: { type: String },
});

Messages.attachBehaviour('timestampable');
Messages.attachSchema(CommentSchema);

export default Messages;
