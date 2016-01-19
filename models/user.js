this.Users = Meteor.users;

UserSchema = new SimpleSchema({
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  classYear: { type: String, optional: true },
  classType: { type: String, optional: true },

  emailPreference: {
    type: String,
    optional: true,
    allowedValues: ['digest', 'all', 'none'],
    defaultValue: 'all',
  },
  emails: { type: [Object], blackbox: true, optional: true },

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
