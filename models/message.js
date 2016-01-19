Messages = new Mongo.Collection('messages');

MessageSchema = new SimpleSchema({
  senderId: { type: String },
  ownerId: { type: String },
  type: { type: String, allowedValues: ['raw', 'welcome', 'firstname', 'lastname',
    'classyear',
    'classtype',
    'share',
    'thanks',
    'linkservice'] },
  content: { type: String, optional: true },

  // internal
  qnum: { type: String, optional: true },
  resumeType: { type: String, optional: true },
});

this.Messages.attachBehaviour('timestampable');
this.Messages.attachSchema(MessageSchema);
