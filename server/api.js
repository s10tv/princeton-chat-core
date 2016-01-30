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

class UsernameGenerator {
  static generate(user) {
    if (user.emails.length > 0) {
      const [ email ] = user.emails;
      return email.address.substring(0, email.address.indexOf('@'));
    } else if (user.firstName && user.lastName) {
      return `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}`;
    } else if (user.firstName) {
      return `${user.firstName.toLowerCase()}`;
    } else {
      return Meteor.uuid();
    }
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

send = (content) => {
  const user = CurrentUser.get();
  return sendBase(user, user._id, content, 'raw');
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
  const post = Posts.findOne(user.tigerbotPostId);
  toggleTypingIndicatorForSystem(post, true);

  return pause(defaultTypeTime).then(() => {
    toggleTypingIndicatorForSystem(post, false);
    sendBase(user, 'system', undefined, type, qnum);
    return Promise.resolve(true);
  })
}

systemSendRaw = (content, qnum, resumeType, defaultTypeTime = 1000) => {
  const user = CurrentUser.get();

  const post = Posts.findOne(user.tigerbotPostId);
  toggleTypingIndicatorForSystem(post, true);

  return pause(defaultTypeTime).then(() => {
    toggleTypingIndicatorForSystem(post, false);
    sendBase(user, 'system', content, 'raw', qnum, resumeType)
    return Promise.resolve(true);
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
  'signup/randomuser': () => {
    const [{user}] = JSON.parse(HTTP.call("GET", "https://randomuser.me/api/").content).results;
    const inviteCode = Meteor.uuid()
    Users.insert({
      firstName: user.name.first,
      lastName: user.name.last,
      emails: [
        { address: user.email, verified: false }
      ],
      classYear: "2012",
      inviteCode: inviteCode,
    })

    console.log(`http://localhost:3000/invite/${inviteCode}`);
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

    check(profile, Object);
    check(profile.firstName, String);
    check(profile.lastName, String);
    check(profile.classYear, Number);
    check(profile.username, String);
    check(profile.avatarUrl, String);

    Users.update(user._id, {
      $set: {
        firstName: profile.firstName,
        lastName: profile.lastName,
        classYear: profile.classYear,
        username: profile.username,
        avatar: {
          url: profile.avatarUrl
        },
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

    if (process.env.IRON_WORKER_TOKEN && process.env.IRON_WORKER_PROJECT_ID) {
      new IronWorker().send({
          taskName: 'job_user_post_handler',
        payload: { postId }
      })
    }
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

    if (process.env.IRON_WORKER_TOKEN && process.env.IRON_WORKER_PROJECT_ID) {
      new IronWorker().send({
          taskName: 'job_user_message_email_sender',
        payload: { messageId: _id }
      })
    }

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
  },

  'welcome/triggerSelectTopicPrompt': () => {
    const user = CurrentUser.get();

    if (Messages.find({ ownerId: user._id, qnum: 'welcome/triggerSelectTopicPrompt' }).count() > 0) {
      // the user has answered this question already;
      return;
    }

    send("I'm here! Now what?")

    return pause(1000).then(() => {
      return systemSend('topics', 'welcome/triggerSelectTopicPrompt', 3500);
    });
  },

  'welcome/topic/follow': (topicId) => {
    check(topicId, String);

    const user = CurrentUser.get();
    const topic = Topics.findOne(topicId);

    const hasSeenThisMessageBefore = Messages.find({ ownerId: user._id, qnum: 'welcome/topic/follow' }).count() > 0;

    // we check that the following topics length is not 1, to prevent the message from being sent
    // multiple times while the user clicks follow multiple times in a row.
    if ((user.followingTopics && user.followingTopics.length != 1) || hasSeenThisMessageBefore) {
      return;
    }

    var sendMessageFeedback;
    if (topic) {
      sendMessageFeedback = systemSendRaw(`Nice. I'm following ${ topic.displayName } too 😊 You will now get a notification anytime someone tags a post with ${ topic.displayName }.`,
        'welcome/topic/follow', undefined, 1500).then(() => pause(2000));
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
      username: UsernameGenerator.generate(user),
      emailPreference: 'all', // have this in here until users can choose their email prefs in onboarding.
      avatar: {
        url: '/images/princeton.svg'
      },
      status: 'active',
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
})
