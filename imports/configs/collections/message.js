Messages = new Mongo.Collection('messages');

MessageSchema = new SimpleSchema({
  ownerId: { type: String },
  postId: { type: String }, // post id or direct message thread id.
  content: { type: String, optional: true },

  // for use during onboarding
  senderId: { type: String, optional: true },
  type: { type: String, optional: true, allowedValues: [
    'raw',
    'welcome',
    'firstname',
    'lastname',
    'classyear',
    'classtype',
    'topics',
    'share',
    'thanks',
    'linkservice']
  },
  qnum: { type: String, optional: true },
  resumeType: { type: String, optional: true },
});

Messages.attachBehaviour('timestampable');
Messages.attachSchema(MessageSchema);

Messages.allow({
  insert: function(userId, doc, fields, modifier) {
    return doc.ownerId == userId;
  }
})

export default Messages;
