Lists = new Mongo.Collection('topics');

// Calculate a default name for a list in the form of 'List A'
Lists.defaultName = function() {
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
  parentTopicId: { type: String, optional: true },
});

this.Lists.attachBehaviour('timestampable');
this.Lists.attachSchema(TopicSchema);
