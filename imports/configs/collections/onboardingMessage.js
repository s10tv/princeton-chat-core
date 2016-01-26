import {Mongo} from 'meteor/mongo';

const Messages = new Mongo.Collection('onboardingMessages');

const MessageSchema = new SimpleSchema({
  senderId: { type: String },
  ownerId: { type: String },
  type: { type: String, allowedValues: [
    'raw',
    'welcome',
    'firstname',
    'lastname',
    'classyear',
    'classtype',
    'share',
    'thanks',
    'linkservice']
  },
  content: { type: String, optional: true },

  // internal
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
