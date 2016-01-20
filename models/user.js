this.Users = Meteor.users;

ImageSchema = new SimpleSchema({
  url: { type: String },
  width: { type: Number, optional: true },
  height: { type: Number, optional: true},
});

UserSchema = new SimpleSchema({
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  classYear: { type: String, optional: true },
  classType: { type: String, optional: true },
  avatar: {type: ImageSchema, optional: true, defaultValue: {
    url: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/71/Princeton_shield.svg/804px-Princeton_shield.svg.png'
  }},
  emailPreference: {
    type: String,
    optional: true,
    allowedValues: ['digest', 'all', 'none'],
    defaultValue: 'all',
  },
  emails: { type: [Object], blackbox: true, optional: true },
  inviteCode: { type: String, optional: true },
  userNumber: { type: Number, optional: true },

  username: { type: String, optional: true },
  services: { type: Object, optional: true, blackbox: true, defaultValue: {} },
  profile: { type: Object, optional: true, blackbox: true },
  info: { type: String, optional: true, defaultValue: 'Go Tigers!', max: 150 },

  followingTopics: { type: [String], defaultValue: [] },
  followingPosts: { type: [String], defaultValue: [] },
  expertTopics: { type: [String], defaultValue: [] },

  status: {
    type: String,
    optional: true,
    allowedValues: ['disabled', 'active', 'pending'],
    defaultValue: 'pending',
  },
});

this.Users.attachBehaviour('timestampable');
this.Users.attachSchema(UserSchema);

Users.displayName = (user) => {
  return `${user.firstName} ${user.lastName}`
}
