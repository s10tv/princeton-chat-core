Friends = new Mongo.Collection('friends');

FriendSchema = new SimpleSchema({
  ofUserId: { type: String },
  fullName: { type: String, optional: true },
  email: { type: String, optional: true }
});

this.Friends.attachSchema(FriendSchema);
