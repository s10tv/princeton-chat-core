import { Topics, Posts, Users, Messages } from '/imports/configs/collections';

class CurrentUser {
  static get() {
    user = Meteor.user();
    if (!user) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    return user;
  }
}

getLargestUserNumber = () => {
  const [ userWithHighestNumber ] = Users
    .find({}, { sort: { userNumber: 1 }, limit: 1 })
    .fetch();

  if (userWithHighestNumber && userWithHighestNumber.userNumber) {
    return userWithHighestNumber.userNumber + 1;
  } else {
    return 1;
  }
}

// onboarding related
sendBase = (user, sender, content, type, qnum, resumeType) => {
  Messages.insert({
    senderId: sender,
    ownerId: user._id,
    type: type,
    postId: user.tigerbotPostId,
    content: content,
    qnum: qnum,
    resumeType: resumeType,
  })
}

toggleTypingIndicatorForSystem = (post, isTyping) => {
  post.followers.map(follower => {
    if (follower.userId != user._id) {
      follower.isTyping = isTyping;
    }
    return follower;
  });

  Posts.update(post._id, { $set: {
    followers: post.followers
  }})
}

systemSend = (type, qnum, defaultTypeTime = 1000) => {
  const user = CurrentUser.get();

  return new Promise((resolve, reject) => {
    const post = Posts.findOne(user.tigerbotPostId);
    toggleTypingIndicatorForSystem(post, true);

    Meteor.setTimeout(() => {
      toggleTypingIndicatorForSystem(post, false);
      sendBase(user, 'system', undefined, type, qnum);

      return resolve(true);

    }, defaultTypeTime);
  })
}

systemSendRaw = (content, qnum, resumeType, defaultTypeTime = 1000) => {
  const user = CurrentUser.get();

  return new Promise((resolve, reject) => {
    const post = Posts.findOne(user.tigerbotPostId);
    toggleTypingIndicatorForSystem(post, true);

    Meteor.setTimeout(() => {
      toggleTypingIndicatorForSystem(post, false);
      sendBase(user, 'system', content, 'raw', qnum, resumeType)
      return resolve(true);
    }, defaultTypeTime);
  })
}

pause = (pauseTime = 1000) => {
  return new Promise((resolve, reject) => {
    Meteor.setTimeout(() => {
      resolve(true);
    }, pauseTime);
  })
}

Meteor.methods({
  'signup/alumniEmail': (alumniEmail) => {
    var email = (alumniEmail || "").trim();
    if (email.length == 0) {
      throw new Meteor.Error(400, 'To sign up, you need to enter your email.');
    }

    if (process.env.USE_ALUMNI_SUFFIX) {
      email = `${email}@alumni.princeton.edu`;
    }

    var user = Accounts.findUserByEmail(email);
    if (!user) {
      // our onboarding using react has a field called `email` on user, instead of meteor `emails`
      user = Users.findOne({ email: email });
    }

    if (!user) {
      var userNumber = getLargestUserNumber();
      const userId = Users.insert({
        userNumber: userNumber,
        status: 'pending',
      })

      Accounts.addEmail(userId, email);
      user = Users.findOne(userId);
    }

    const inviteCode = Random.id();
    Users.update(user._id, { $set: {
      inviteCode: inviteCode
    }})

    const inviteUrl = `${process.env.ROOT_URL}/invite/${inviteCode}?n=${user.userNumber}`;
    const postmark = Meteor.npmRequire("postmark");
    const postmarkKey = process.env.POSTMARK_API_KEY || 'a7c4668c-6430-4333-b303-38a4b9fe7426';
    const client = new postmark.Client(postmarkKey);

    const Future = Npm.require('fibers/future')
    const future = new Future()
    const onComplete = future.resolver()

    client.sendEmailWithTemplate({
      "From": "notifications@princeton.chat",
      "To": email,
      "TemplateId": 354341,
      "TemplateModel": {
        inviteLink: inviteUrl
      }
    }, onComplete)

    Future.wait(future)
    return future.get();
  },

  'signup/userInfo': (firstName, lastName, classYear, email) => {
    var user = Users.findOne({ email: email });
    if (!user) {
      var userNumber = getLargestUserNumber();
      const userId = Users.insert({
        status: 'review',
        firstName: firstName,
        lastName: lastName,
        userNumber: userNumber,
        classYear: classYear,
      });
      Accounts.addEmail(userId, email);
      user = Users.findOne(userId);
    }

    return user._id;
  },

  'topics/follow': (topicIds) => {
    const user = CurrentUser.get();

    const curatedTopicIds = topicIds.map(topicId => {
      return Topics.findOne(topicId);
    }).filter(topic => {
      return topic != undefined && topic != null;
    }).map(topic => {
      return topic._id;
    })

    Users.update(user._id, { $set: {
      followingTopics: curatedTopicIds,
    }})
  },

  'profile/update': (profile) => {
    const user = CurrentUser.get();
    Users.update(user._id, {
      $set: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        info: profile.info,
        classYear: profile.classYear,
        classType: profile.classType
      }
    });
  },

  'emailPreference/update': (preference) => {
    user = CurrentUser.get()
    Users.update(user._id, { $set: {
      emailPreference: preference
    }})
  },

  'post/insert': (_id, title, content, topicIds) => {
    user = CurrentUser.get()

    check(_id, String);
    check(title, String);
    check(content, String);
    check(topicIds, [String]);

    try {
      title = title.trim();
      content = content.trim();
    } catch (e) {
      throw new Meteor.Error(400, 'Every post needs to have a title and content.');
    }

    if (title.length == 0 || content.length == 0) {
      throw new Meteor.Error(400, 'Every post needs to have a title and content.');
    }

    // make sure that the topic ids entered are legit;
    const filteredTopicIds = topicIds.map(topicId => {
      return Topics.findOne(topicId);
    })
    .filter((topic) => {
      return topic != undefined
    })
    .map((topic) => {
      return topic._id;
    });

    if (filteredTopicIds.length == 0) {
      throw new Meteor.Error(400, 'Please enter at least one valid topicId.');
    }

    const postId = Posts.insert({
      _id,
      title,
      content,
      ownerId: user._id,
      topicIds: filteredTopicIds,
      followers: [{
        userId: user._id,
        unreadCount: 0,
      }],
      numMsgs: 0,
    })

    Meteor.call('post/follow', postId)
  },

  'topic/follow': (topicId) => {
    check(topicId, String);
    user = CurrentUser.get()
    Users.update(user._id, { $addToSet: {
      followingTopics: topicId,
    }});

    Topics.update(topicId, { $addToSet: {
      followers: { userId: user._id, unreadCount: 0 }
    }, $set: {
      numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId }).count()
    }});
  },

  'topic/unfollow': (topicId) => {
    check(topicId, String);
    user = CurrentUser.get()
    Users.update(user._id, { $pull: {
      followingTopics: topicId,
    }});

    Topics.update(topicId, { $pull: {
      followers: { userId: user._id }
    }, $set: {
      numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId }).count()
    }});
  },

  'post/follow': (postId) => {
    check(postId, String);
    user = CurrentUser.get()
    post = Posts.findOne(postId);

    if (post) {
      Users.update(user._id, { $addToSet: {
        followingPosts: postId,
      }});

      Posts.update(postId, { $addToSet: {
        followers: { userId: user._id, unreadCount: 0 }
      }});

      post.topicIds.forEach(topicId => {
        Topics.update(topicId, { $set: {
          numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId }).count()
        }});
      });
    }
  },

  'post/unfollow': (postId) => {
    check(postId, String);
    user = CurrentUser.get()
    post = Posts.findOne(postId);

    if (post) {
      Users.update(user._id, { $pull: {
        followingPosts: postId,
      }});

      Posts.update(postId, { $pull: {
        followers: { userId: user._id }
      }});

      post.topicIds.forEach(topicId => {
        Topics.update(topicId, { $set: {
          numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId }).count()
        }});
      });
    }
  },

  'messages/insert': (_id, postId, commentText) => {
    check(_id, String);
    check(postId, String);
    check(commentText, String);

    const user = CurrentUser.get();
    Messages.insert({
      _id,
      postId,
      content: commentText,
      ownerId: user._id,
    })

    Posts.update(postId, { $inc: { numMsgs: 1 }});
  },

  //onboarding related
  '_accounts/unlink/service': function (serviceName) {
    const user = CurrentUser.get();
    Accounts.unlinkService(user._id, serviceName);
  },

  'reset': () => {
    const user = CurrentUser.get();
    Users.update(user._id, { $set: {
      status: 'pending'
    }});

    Messages.remove({
      ownerId: user._id,
    });
    Messages.insert({
      senderId: 'system',
      ownerId: user._id,
      postId: user.tigerbotPostId,
      type: "welcome",
    })

    Meteor.call('welcome/triggerSelectTopicPrompt');
  },

  'welcome/triggerSelectTopicPrompt': () => {
    Meteor._sleepForMs(2500);

    const user = CurrentUser.get();
    return pause(2500).then(() => {
      return systemSend('topics', undefined, 3500);
    });
  },

  'welcome/topic/follow': (topicId) => {
    check(topicId, String);

    const user = CurrentUser.get();
    const topic = Topics.findOne(topicId);

    if (Messages.find({ ownerId: user._id, qnum: 'welcome/topic/follow' }).count() > 0) {
      // the user has answered this question already;
      return;
    }

    var sendMessageFeedback;
    if (topic) {
      sendMessageFeedback = systemSendRaw(`${ topic.displayName } sounds like a fun topic to follow.`,
        undefined, undefined, 2000).then(() => pause(2500));
    } else {
      sendMessageFeedback = Promise.resolve(true);
    }

    return sendMessageFeedback.then(() => systemSend('linkservice', 'welcome/topic/follow', 1500));
  },

  'welcome/setLoginService': (serviceName) => {
    check(serviceName, String);

    const user = CurrentUser.get();
    if (Messages.find({ ownerId: user._id, qnum: 'welcome/setLoginService' }).count() > 0) {
      return;
    }

    Users.update(user._id, { $set: {
      status: 'active'
    }})


    switch (serviceName) {
      case 'facebook':
        systemSendRaw('Got it. You can log in with Facebook next time.')
        .then(() => {
          return systemSend('thanks', 'welcome/setLoginService', 1500)
        })
        break;
      case 'password':
        systemSendRaw('Got it. You can log in with your new password next time.')
        .then(() => {
          return systemSend('thanks', 'welcome/setLoginService', 2500)
        })
        break;
    }
  },

  // 'welcome/yes': () => {
  //   const user = CurrentUser.get();
  //
  //   if (Messages.find({ ownerId: user._id, qnum: 'welcome/yes' }).count() > 0) {
  //     // the user has answered this question already;
  //     return;
  //   }
  //
  //   if (Messages.find({ ownerId: user._id, senderId: 'system' }).count() > 1) {
  //     send('Actually, I changed my mind. Sign me up now.')
  //     systemSendRaw('Wonderful! Glad you changed your mind.')
  //   } else {
  //     send('Sure! Count me in.')
  //     systemSendRaw('Wonderful! Welcome to Princeton.chat.')
  //   }
  //
  //   systemSendRaw(`Here, posts are grouped into topics, and you will only receive notifications for topics that you follow. Why don't you follow some topics that interest you?`);
  //   systemSend('topics', 'welcome/yes')
  // },
  //
  // 'welcome/no': () => {
  //   const user = CurrentUser.get();
  //
  //   if (Messages.find({ ownerId: user._id, qnum: { $in: ['welcome/yes', 'welcome/no']}}).count() == 0) {
  //     send('Not now. Remind me again in a bit')
  //     systemSendRaw('Alright then. We will follow up with you via email in the following weeks.', 'welcome/no')
  //   }
  // },

  // 'username/claim': (username) => {
  //   const currentUser = CurrentUser.get();
  //   const user = Users.findOne({ username: username });
  //   if (!user) {
  //     Users.update(currentUser._id, { $set: {
  //       username: username,
  //       avatar: { url: '/img/princeton-shield.png' },
  //       emailPreference: 'all',
  //       info: 'Go Tigers!',
  //       followingPosts: [],
  //       expertTopics: [],
  //       // dont need to set followingTopics because that should have been set at topics/follow.
  //
  //       status: 'active',
  //     }});
  //
  //     return true;
  //   }
  //
  //   return false;
  // },
  //
  // 'friends/add': (friendInfos) => {
  //   const user = CurrentUser.get();
  //   _.each(friendInfos, function(friendInfo) {
  //     if (friendInfo.isEmail) {
  //       Friends.insert({
  //         ofUserId: user._id,
  //         email: friendInfo.field
  //       })
  //     } else {
  //       Friends.insert({
  //         ofUserId: user._id,
  //         fullName: friendInfo.field
  //       })
  //     }
  //   });
  // },


  // TODO: for future versions
  // 'facebook/isActive': () => {
  //   user = CurrentUser.get();
  //   if (user.services.facebook) {
  //     return true;
  //   }
  //
  //   return false;
  // },
  //
  // 'instagram/isActive': () => {
  //   user = CurrentUser.get();
  //   if (user.services.instagram) {
  //     return true;
  //   }
  //
  //   return false;
  // },
  //
  // 'twitter/isActive': () => {
  //   user = CurrentUser.get();
  //   if (user.services.twitter) {
  //     return true;
  //   }
  //
  //   return false;
  // },
})
