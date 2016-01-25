Users = Meteor.users;

ImageSchema = new SimpleSchema({
  url: { type: String },
  width: { type: Number, optional: true },
  height: { type: Number, optional: true},
});

UserSchema = new SimpleSchema({
  firstName: { type: String, optional: true, defaultValue: 'Me' },
  lastName: { type: String, optional: true },
  classYear: { type: String, optional: true },
  classType: { type: String, optional: true },
  avatar: { type: ImageSchema, optional: true, defaultValue: {
    url: '/img/princeton-shield.png'
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

  isOnboardingDone: { type: Boolean, optional: true, defaultValue: false },
  isEmailVerified: { type: Boolean, optional: true, defaultValue: false },
  status: {
    type: String,
    optional: true,
    allowedValues: ['disabled', 'active', 'pending', 'review'],
    defaultValue: 'pending',
  },
});

Users.attachBehaviour('timestampable');
Users.attachSchema(UserSchema);

Users.allow({
  update: function (userId, doc, fields, modifier) {
    if (userId !== doc._id) {
      return false;
    }

    const checkFollowPost = {
      $addToSet: {
        followingPosts: String
      }
    };

    const checkunfollowPost = {
      $pull: {
        followingPosts: String
      }
    };

    const checkFollowTopic = {
      $addToSet: {
        followingTopics: String
      }
    };

    const checkUnfollowTopic = {
      $pull: {
        followingTopics: String
      }
    };

    try {
      check(modifier, Match.OneOf(
        checkFollowTopic,
        checkUnfollowTopic,
        checkFollowPost,
        checkunfollowPost));
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
})

Users.displayName = (user) => {
  return `${user.firstName} ${user.lastName}`
}

export default Users;
