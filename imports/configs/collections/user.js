Users = Meteor.users;

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
  avatar: { type: ImageSchema, optional: true },
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

  followingTopics: { type: [String], optional: true, defaultValue: [] },
  followingPosts: { type: [String], optional: true, defaultValue: [] },
  expertTopics: { type: [String], optional: true, defaultValue: [] },

  // the DM channel used to communicate with tigerbot.
  tigerbotPostId: { type: String, optional: true },

  // true if the user is a full member. False if the user is a guest (affiliation unverified)
  isFullMember: { type: Boolean, optional: true, defaultValue: false },

  // a list of topics that this user is an admin in.
  topicAdmins: { type: [String], optional: true, defaultValue: []},

  status: {
    type: String,
    optional: true,
    allowedValues: ['disabled', 'active', 'pending', 'review'],
    defaultValue: 'pending',
  },
})

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
