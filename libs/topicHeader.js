TopicHeaders = new Mongo.Collection('topicHeaders');

TopicHeaderSchema = new SimpleSchema({
  topicHeader: { type: String },
  topicIds: { type: [String], defaultValue: [] },
  order: { type: Number, decimal: true },
});

TopicHeaders.attachSchema(TopicHeaderSchema);

export default TopicHeaders;
