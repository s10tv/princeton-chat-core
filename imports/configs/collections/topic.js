import FollowerSchema from './common/follower';

Topics = new Mongo.Collection('topics');

// Calculate a default name for a list in the form of 'List A'
Topics.defaultName = function() {
  var nextLetter = 'A', nextName = 'List ' + nextLetter;
  while (Lists.findOne({name: nextName})) {
    // not going to be too smart here, can go past Z
    nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
    nextName = 'List ' + nextLetter;
  }

  return nextName;
};

TopicSchema = new SimpleSchema({
  displayName: { type: String },
  followers: { type: [FollowerSchema], defaultValue: [] },
  numPosts: { type: Number, defaultValue: 0 },
  parentTopicId: { type: String, optional: true },
  order: { type: Number, decimal: true },
});

Topics.attachBehaviour('timestampable');
Topics.attachSchema(TopicSchema);

export default Topics;
