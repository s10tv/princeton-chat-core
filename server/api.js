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
sendBase = (sender, content, type, qnum, resumeType) => {
  const user = CurrentUser.get();

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

systemSend = (type, qnum) => {
  return sendBase('system', undefined, type, qnum)
}

systemSendRaw = (content, qnum, resumeType) => {
  return sendBase('system', content, 'raw', qnum, resumeType)
}

send = (content) => {
  const user = CurrentUser.get();
  return sendBase(user._id, content, 'raw');
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

  'username/claim': (username) => {
    const currentUser = CurrentUser.get();
    const user = Users.findOne({ username: username });
    if (!user) {
      Users.update(currentUser._id, { $set: {
        username: username,
        avatar: { url: '/img/princeton-shield.png' },
        emailPreference: 'all',
        info: 'Go Tigers!',
        followingPosts: [],
        expertTopics: [],
        // dont need to set followingTopics because that should have been set at topics/follow.

        status: 'active',
      }});

      return true;
    }

    return false;
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

  'friends/add': (friendInfos) => {
    const user = CurrentUser.get();
    _.each(friendInfos, function(friendInfo) {
      if (friendInfo.isEmail) {
        Friends.insert({
          ofUserId: user._id,
          email: friendInfo.field
        })
      } else {
        Friends.insert({
          ofUserId: user._id,
          fullName: friendInfo.field
        })
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

  'welcome/setLoginService': (serviceName) => {
    check(serviceName, String);

    const user = CurrentUser.get();
    if (Messages.find({ ownerId: user._id, qnum: 'welcome/setLoginService' }).count() > 0) {
      return;
    }

    switch (serviceName) {
      case 'facebook':
        return systemSend('thanks', 'welcome/setLoginService')
      case 'password':
        return systemSend('thanks', 'welcome/setLoginService')
    }
  },

  'welcome/yes': () => {
    const user = CurrentUser.get();

    if (Messages.find({ ownerId: user._id, qnum: 'welcome/yes' }).count() > 0) {
      // the user has answered this question already;
      return;
    }

    if (Messages.find({ ownerId: user._id, senderId: 'system' }).count() > 1) {
      send('Actually, I changed my mind. Sign me up now.')
      systemSendRaw('Wonderful! Glad you changed your mind.')
    } else {
      send('Sure! Count me in.')
      systemSendRaw('Wonderful! Welcome to Princeton.chat.')
    }

    systemSendRaw(`Here, posts are grouped into topics, and you will only receive notifications for topics that you follow. Why don't you follow some topics that interest you?`);
    systemSend('topics', 'welcome/yes')
  },

  'welcome/no': () => {
    const user = CurrentUser.get();

    if (Messages.find({ ownerId: user._id, qnum: { $in: ['welcome/yes', 'welcome/no']}}).count() == 0) {
      send('Not now. Remind me again in a bit')
      systemSendRaw('Alright then. We will follow up with you via email in the following weeks.', 'welcome/no')
    }
  },

  'welcome/topic/follow': (topicId) => {
    check(topicId, String);

    const user = CurrentUser.get();
    const topic = Topics.findOne(topicId);


    if (Messages.find({ ownerId: user._id, qnum: 'welcome/topic/follow' }).count() > 0) {
      // the user has answered this question already;
      return;
    }

    if (topic) {
      systemSendRaw(`${ topic.displayName } sounds like a fun topic.`);
    }

    systemSend('linkservice', 'welcome/topic/follow')
  },

  'message/add': (msg, type) => {
    const user = CurrentUser.get();

    const message = (msg || '').trim();

    if (message.length == 0) {
      return 0;
    }

    send(message)

    if (type) {
      switch(type) {
        // what is your first naem
        case 'firstname':
          Users.update(user._id, { $set: { firstName: message }});
          return systemSend('lastname');

        case 'lastname':
          Users.update(user._id, { $set: { lastName: message }});
          return systemSend('classyear');

        case 'classyear':
          const fourDigitRe = /^[0-9]{4}$/
          const shorthandRe = /^'[0-9]{2}$/
          if (message.match(fourDigitRe) != null || message.match(shorthandRe) != null) {

            var year;
            if (message.match(fourDigitRe) != null) {
              year = parseInt(message);
            } else {
              const parsed = parseInt(message.substring(1));
              if (parsed > 30) {
                year = parseInt(`19${parsed}`)
              } else {
                year = parseInt(`20${parsed}`)
              }
            }

            Users.update(user._id, { $set: { classYear: `${year}`}});

            const yearAsNum = parseInt(year);
            const diff = 2016 - yearAsNum;
            if (diff < 5) {
              systemSendRaw(`Oh it's only been ${diff} years since you've graduated.`, 'classyear');
              return systemSend('classtype');
            } else {
              systemSendRaw(`Wow you've been out of princeton for ${diff} years already? Time flies.`, 'classyear');
              return systemSend('classtype');
            }
          } else {
            return systemSendRaw('Please enter your classyear as a 4 digit number, or using the shorthand i.e. \'12.', undefined, 'classyear');
          }

          break;

        case 'classtype':
          if (message.toLowerCase() == 'undergraduate' || message.toLowerCase() == 'undergrad' || message.toLowerCase() == 'u') {
            Users.update(user._id, { $set: { classType: 'undergrad' }});
            systemSendRaw(`Ah of course. I miss my undergrad days too`, 'classtype');
            return systemSend('linkservice');
          } else if (message.toLowerCase() == 'graduate' || message.toLowerCase() == 'grad' || message.toLowerCase() == 'g') {
            Users.update(user._id, { $set: { classType: 'grad' }});
            systemSendRaw(`Ah of course. I miss my grad school days too`, 'classtype');
            return systemSend('linkservice');
          } else {
            return systemSendRaw('Please enter \'U\' for undergrad and \'G\' for grad', undefined, 'classtype');
          }
      }
    }
  },

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
