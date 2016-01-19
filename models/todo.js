Todos = new Mongo.Collection('todos');

PostSchema = new SimpleSchema({
  ownerId: { type: String },
  title: { type: String },
  content: { type: String },
  topics: { type: [Object], blackbox: true },
  listIds: { type: [String] }
});

this.Todos.attachBehaviour('timestampable');
this.Todos.attachSchema(PostSchema);

//  schema
//  ownerId: 'string'
//  listId: "jMNfHdSJvcg3NdKSF",
//  text: "Data on the Wire",
//  createdAt: ISODate("2016-01-17T17:47:19.955Z")
