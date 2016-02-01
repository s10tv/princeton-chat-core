import { Topics, Posts, Users, Messages } from '/imports/configs/collections';
import TopicManager from '/imports/server/TopicManager';
import PostManager from '/imports/server/PostManager';

const slackUrl = process.env.SLACK_URL || 'https://hooks.slack.com/services/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'
const slackUsername = process.env.ENV || 'dev';
const slackEmoji = process.env.ENV == 'prod' ? ':beer:' : ':poop:';
const slack = Meteor.npmRequire('slack-notify')(slackUrl);

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

stripTrailingSlash = (str) => {
  if(str.substr(-1) === '/') {
      return str.substr(0, str.length - 1);
  }
  return str;
}

Meteor.methods({
  'signup': (options) => {
    check(options, Object);
    const { firstName, lastName, classYear, emailAddress } = options;

    check(firstName, String);
    check(lastName, String);
    check(classYear, String);
    check(emailAddress, String);

    var email = (emailAddress || "").trim();
    if (email.length == 0) {
      throw new Meteor.Error(400, 'To sign up, you need to enter your email.');
    }

    var user = Accounts.findUserByEmail(email);
    if (!user) {
      // our onboarding using react has a field called `email` on user, instead of meteor `emails`
      user = Users.findOne({ email: email });
    }

    if (!user) {
      var userNumber = getLargestUserNumber();
      const userId = Users.insert({
        firstName,
        lastName,
        classYear,
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

    slack.send({
      icon_emoji: slackEmoji,
      text: `${user.firstName} ${user.lastName} (${email}) signed up`,
      username: slackUsername,
    })

    if (process.env.SKIP_CHECK_PRINCETON_EMAIL || /.*@alumni.princeton.edu$/.test(email)) {
      const inviteUrl = `${stripTrailingSlash(process.env.ROOT_URL)}/invite/${inviteCode}`;
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
      try {
        future.get();
      } catch (err) {
        console.error(err);
        console.log(err.stack);
        return;
      }

      slack.send({
        icon_emoji: slackEmoji,
        text: `Sent a welcome email to ${email}.`,
        username: slackUsername,
      })

      return true;
    }

    // did not pass validation.
    return false;
  },

  'topics/users/import': (topicId, emails) => {
    check(topicId, String);
    check(emails, [String]);

    const topic = Topics.findOne(topicId);
    if (!topic) {
      throw new Meteor.Error(400, `Invalid topicId: ${topicId}.`);
    }

    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    emails.filter(email => re.test(email))
    .forEach(email => {
      let existingUser = Accounts.findUserByEmail(email);
      if (!existingUser) {
        // assign the user a username equal to their email username
        let username = email.substring(0, email.indexOf('@'));
        let newUserId = Accounts.createUser({ username, email, password: email, profile: {} });

        Users.update(newUserId, { $set: {
          firstName: username,
        }})

        existingUser = Users.findOne(newUserId);
      }

      TopicManager.follow({ topicId, user: existingUser });
    })
  },

  'signup/test': (emailOverride) => {
    check(emailOverride, Match.Optional(String))
    const [{user}] = JSON.parse(HTTP.call("GET", "https://randomuser.me/api/").content).results;
    const email = emailOverride || user.email;

    Meteor.call('signup', {
      firstName: user.name.first,
      lastName: user.name.last,
      classYear: '2012',
      emailAddress: email,
    });
  },

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
    const filteredTopicIds = topicIds.filter(topicId => {
      return Topics.findOne(topicId) != undefined
    })

    if (filteredTopicIds.length == 0) {
      throw new Meteor.Error(400, 'Please enter at least one valid topicId.');
    }

    // We are good to insert the post.
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

    // The current user follows the current post they just posted
    Meteor.call('post/follow', postId);

    // update the num posts after posting.
    filteredTopicIds.forEach(topicId => {
      Topics.update(topicId, { $set: {
        numPosts: Posts.find({ isDM: { $ne: true }, topicIds: topicId}).count()
      }});
    })

    if (process.env.IRON_WORKER_TOKEN && process.env.IRON_WORKER_PROJECT_ID) {
      new IronWorker().send({
          taskName: 'job_user_post_handler',
        payload: { postId }
      })
    }
  },

  'topic/follow': (topicId) => {
    check(topicId, String)
    TopicManager.follow({ topicId, user: CurrentUser.get()})
  },

  'topic/unfollow': (topicId) => {
    check(topicId, String)
    TopicManager.unfollow({ topicId, user: CurrentUser.get()})
  },

  'post/follow': (postId) => {
    check(postId, String);
    PostManager.follow({ post: Posts.findOne(postId), user: CurrentUser.get()})
  },

  'post/unfollow': (postId) => {
    check(postId, String);
    PostManager.unfollow({ post: Posts.findOne(postId), user: CurrentUser.get()})
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

    slack.send({
      icon_emoji: slackEmoji,
      text: `${user.firstName} ${user.lastName} just signed up. Total count: ${ Users.find().count() + 1 }.`,
      username: slackUsername,
    })

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

  'get/followers': (userIds) => {
    check(userIds, Array);

    return userIds.map(user => {
      return Users.findOne(user.userId);
    });
  }
})
